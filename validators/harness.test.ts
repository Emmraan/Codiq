import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildSandboxHtml,
  createDefaultFrame,
  RUNTIME_LIBS,
  runtimeLibsFor,
  SandboxHarness,
  type SandboxHarnessOptions,
} from "./harness";
import type { ValidationResult } from "./types";

const VALIDATOR_SOURCE =
  "var __codiqValidator = { validator: { type: 'css', run: function () { return Promise.resolve({ passed: false, checks: [], console: [], feedback: ['mocked'] }); } } };";

const EMPTY_RESULT: ValidationResult = { passed: false, checks: [], console: [], feedback: [] };

let messageHandlers: Array<(event: MessageEvent) => void>;

function makeFakeFrame() {
  const postMessage = vi.fn();
  const frame = {
    srcdoc: "",
    contentWindow: { postMessage },
    remove: vi.fn(),
    setAttribute: vi.fn(),
    style: {},
    title: "",
  };
  return { frame, postMessage };
}

function makeHarness(
  frame: ReturnType<typeof makeFakeFrame>,
  options: Pick<SandboxHarnessOptions, "timeoutMs" | "onConsole"> = {},
) {
  return new SandboxHarness({
    validatorSource: VALIDATOR_SOURCE,
    createFrame: () => frame.frame as unknown as HTMLIFrameElement,
    ...options,
  });
}

function fireFromFrame(data: unknown, source?: unknown) {
  const event = {
    data,
    source: source === undefined ? null : source,
    origin: "null",
    type: "message",
  } as MessageEvent;
  for (const handler of [...messageHandlers]) handler(event);
}

beforeEach(() => {
  messageHandlers = [];
  vi.spyOn(window, "addEventListener").mockImplementation((type, listener) => {
    if (type === "message" && typeof listener === "function") {
      messageHandlers.push(listener as (event: MessageEvent) => void);
    }
    return undefined;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("buildSandboxHtml", () => {
  it("embeds the validator source and runtime library scripts", () => {
    const html = buildSandboxHtml(VALIDATOR_SOURCE, [RUNTIME_LIBS.typescript]);
    expect(html).toContain(
      'src="https://cdn.jsdelivr.net/npm/typescript@5.5.4/lib/typescript.min.js"',
    );
    expect(html).toContain(VALIDATOR_SOURCE);
    expect(html).toContain("REQUIRED_LIBS");
    expect(html).toContain('["ts"]');
  });

  it("creates an opaque sandbox frame (allow-scripts, no allow-same-origin)", () => {
    expect(createDefaultFrame("<!doctype html>").getAttribute("sandbox")).toBe("allow-scripts");
  });

  it("maps the correct runtime libs for each validator type", () => {
    expect(runtimeLibsFor("react").map((lib) => lib.name)).toEqual([
      "typescript",
      "react",
      "react-dom",
    ]);
    expect(runtimeLibsFor("ts").map((lib) => lib.name)).toEqual(["typescript"]);
    expect(runtimeLibsFor("js")).toEqual([]);
    expect(runtimeLibsFor("unknown")).toEqual([]);
  });
});

describe("SandboxHarness protocol", () => {
  it("posts a run request and resolves with the reported result", async () => {
    const fake = makeFakeFrame();
    const onConsole = vi.fn();
    const harness = makeHarness(fake, { onConsole });

    const promise = harness.run({ "a.css": "x" }, { foo: 1 });
    expect(fake.postMessage).toHaveBeenCalledTimes(1);
    const runMsg = fake.postMessage.mock.calls[0]?.[0] as {
      id: number;
      type: string;
      code: Record<string, string>;
      config: Record<string, unknown>;
    };
    expect(runMsg.type).toBe("run");
    expect(runMsg.code).toEqual({ "a.css": "x" });
    expect(runMsg.config).toEqual({ foo: 1 });

    const result: ValidationResult = {
      passed: true,
      checks: [{ id: "a", label: "A", passed: true }],
      console: [],
      feedback: [],
    };
    fireFromFrame(
      { type: "console", id: runMsg.id, level: "log", text: "hello" },
      fake.frame.contentWindow,
    );
    fireFromFrame({ type: "result", id: runMsg.id, result }, fake.frame.contentWindow);
    await expect(promise).resolves.toEqual(result);
    expect(onConsole).toHaveBeenCalledWith({ level: "log", text: "hello" });
    harness.destroy();
  });

  it("ignores messages from a different source, a wrong origin and stale ids", async () => {
    const fake = makeFakeFrame();
    const harness = makeHarness(fake);

    const promise = harness.run({}, {});
    const runMsg = fake.postMessage.mock.calls[0]?.[0] as { id: number };

    // Wrong event.source → ignored.
    fireFromFrame({ type: "result", id: runMsg.id, result: EMPTY_RESULT }, { not: "the frame" });
    // Unknown origin → ignored.
    const orphan = {
      data: { type: "result", id: runMsg.id, result: EMPTY_RESULT },
      source: fake.frame.contentWindow,
      origin: "https://attacker.example",
      type: "message",
    } as unknown as MessageEvent;
    for (const handler of [...messageHandlers]) handler(orphan);
    // Stale id → ignored.
    fireFromFrame({ type: "result", id: 9999, result: EMPTY_RESULT }, fake.frame.contentWindow);

    const good: ValidationResult = { passed: true, checks: [], console: [], feedback: [] };
    fireFromFrame({ type: "result", id: runMsg.id, result: good }, fake.frame.contentWindow);
    await expect(promise).resolves.toEqual(good);
    harness.destroy();
  });

  it("maps sandbox errors into a failed result", async () => {
    const fake = makeFakeFrame();
    const harness = makeHarness(fake);

    const promise = harness.run({}, {});
    const runMsg = fake.postMessage.mock.calls[0]?.[0] as { id: number };
    fireFromFrame(
      { type: "error", id: runMsg.id, message: "Validator crashed: boom" },
      fake.frame.contentWindow,
    );
    await expect(promise).resolves.toMatchObject({
      passed: false,
      feedback: ["[sandbox] Validator crashed: boom"],
    });
    harness.destroy();
  });

  it("times out and disposes the frame when the sandbox hangs", async () => {
    vi.useFakeTimers();
    const fake = makeFakeFrame();
    const harness = makeHarness(fake, { timeoutMs: 50 });

    const promise = harness.run({}, {});
    await vi.advanceTimersByTimeAsync(60);
    await expect(promise).resolves.toMatchObject({ passed: false });
    expect(fake.frame.remove).toHaveBeenCalled();
  });

  it("resolves pending runs when destroyed", async () => {
    const fake = makeFakeFrame();
    const harness = makeHarness(fake);
    const promise = harness.run({}, {});
    harness.destroy();
    await expect(promise).resolves.toMatchObject({ passed: false });
  });
});
