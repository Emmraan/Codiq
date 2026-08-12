/**
 * Sandboxed iframe validation harness.
 *
 * Runs a challenge's compiled validator bundle inside an opaque iframe
 * (`sandbox="allow-scripts"` WITHOUT `allow-same-origin`, so the frame has an
 * opaque origin and can never touch the hosting page) and communicates over
 * `postMessage`. See docs/VALIDATION_ENGINE.md for the full protocol spec.
 *
 * The harness is intentionally thin: all per-challenge behaviour lives in the
 * validator bundle. It builds the `srcdoc`, relays messages, enforces a timeout
 * and always resolves with a structured `ValidationResult` (it never throws).
 */

import type {
  ConsoleLine,
  RuntimeLibrary,
  RunRequest,
  SandboxMessage,
  ValidationResult,
  ValidatorType,
} from "./types";

export const DEFAULT_VALIDATOR_TIMEOUT_MS = 8000;

/** Well-known runtime libraries bootstrapped into the sandbox (before the rest
 *  of the harness) when a validator type needs them. */
export const RUNTIME_LIBS = {
  typescript: {
    name: "typescript",
    global: "ts",
    url: "https://cdn.jsdelivr.net/npm/typescript@5.5.4/lib/typescript.min.js",
  },
  react: {
    name: "react",
    global: "React",
    url: "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  },
  "react-dom": {
    name: "react-dom",
    global: "ReactDOM",
    url: "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
  },
} as const satisfies Record<string, RuntimeLibrary>;

/** Which runtime libraries each built-in validator type needs in the sandbox. */
export const BUILTIN_RUNTIME: Record<ValidatorType, RuntimeLibrary[]> = {
  html: [],
  css: [],
  js: [],
  express: [],
  ts: [RUNTIME_LIBS.typescript],
  react: [RUNTIME_LIBS.typescript, RUNTIME_LIBS.react, RUNTIME_LIBS["react-dom"]],
};

/** Resolve the sandbox runtime libraries for a validator type. */
export function runtimeLibsFor(type: string): RuntimeLibrary[] {
  return BUILTIN_RUNTIME[type as ValidatorType] ?? [];
}

/**
 * The harness bootstrap that runs inside the sandbox. It captures console
 * output, relays it to the host, waits for any required runtime globals, and
 * executes the validator bundle on demand.
 *
 * NOTE: written ES5-style so it can be embedded in `srcdoc` without a build
 * step. Never introduce template literals or `${}` sequences here.
 */
const HARNESS_BOOTSTRAP_CORE = `
(function () {
  var captured = [];

  function stringify(value) {
    if (typeof value === "string") return value;
    if (value === undefined) return "undefined";
    if (typeof value === "function") return String(value);
    try { return JSON.stringify(value); } catch (e) { return String(value); }
  }

  function format() {
    var parts = [];
    for (var i = 0; i < arguments.length; i++) parts.push(stringify(arguments[i]));
    return parts.join(" ");
  }

  function post(message) {
    try { parent.postMessage(message, "*"); } catch (e) { /* never throws */ }
  }

  ["log", "info", "warn", "error"].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      var text = format.apply(null, arguments);
      try { captured.push({ level: level, text: text }); } catch (e) { /* ignore */ }
      if (original && original.apply) original.apply(console, arguments);
      post({ type: "console", level: level, text: text });
    };
  });

  window.__codiqConsole = captured;

  var pendingRun = null;

  function missingLibs() {
    var missing = [];
    for (var i = 0; i < REQUIRED_LIBS.length; i++) {
      if (typeof window[REQUIRED_LIBS[i]] === "undefined") missing.push(REQUIRED_LIBS[i]);
    }
    return missing;
  }

  function execute(msg) {
    var id = msg.id;
    var bundle = window.__codiqValidator;
    var validator = bundle && (bundle.validator || bundle);
    if (!validator || typeof validator.run !== "function") {
      post({ type: "error", id: id, message: "The validator bundle did not expose a runnable validator." });
      return;
    }
    window.__codiqConsole.length = 0;
    Promise.resolve()
      .then(function () { return validator.run({ code: msg.code, config: msg.config }); })
      .then(function (result) {
        post({ type: "result", id: id, result: result });
      })
      .catch(function (error) {
        var message = error && error.message ? String(error.message) : String(error);
        post({ type: "error", id: id, message: "Validator crashed: " + message });
      });
  }

  function runPending() {
    if (!pendingRun) return;
    var msg = pendingRun;
    pendingRun = null;
    execute(msg);
  }

  window.addEventListener("message", function (event) {
    var msg = event.data;
    if (!msg || msg.type !== "run") return;
    if (pendingRun) {
      post({ type: "error", id: pendingRun.id, message: "A run is already in progress." });
      return;
    }
    pendingRun = msg;
    if (missingLibs().length === 0) {
      runPending();
    } else {
      post({ type: "error", id: msg.id, message: "Required runtime library did not load in the sandbox." });
      pendingRun = null;
    }
  });

  if (missingLibs().length === 0) {
    post({ type: "ready" });
  } else {
    post({ type: "error", message: "Runtime library failed to load in the sandbox." });
  }
})();
`;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bootstrapPrelude(runtime: RuntimeLibrary[]): string {
  const globals = runtime.map((lib) => lib.global);
  return `var REQUIRED_LIBS = ${JSON.stringify(globals)};\n`;
}

/** Build the full `srcdoc` document for a validator bundle + runtime libs. */
export function buildSandboxHtml(validatorSource: string, runtime: RuntimeLibrary[] = []): string {
  const libTags = runtime.map((lib) => `<script src="${escapeHtml(lib.url)}"></script>`).join("");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${libTags}
  </head>
  <body>
    <script>${validatorSource}</script>
    <script>${bootstrapPrelude(runtime)}${HARNESS_BOOTSTRAP_CORE}</script>
  </body>
</html>`;
}

/** Factory for the underlying iframe — injectable for tests. */
export type FrameFactory = (srcdoc: string) => HTMLIFrameElement;

export function createDefaultFrame(srcdoc: string): HTMLIFrameElement {
  const frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-scripts");
  frame.setAttribute("aria-hidden", "true");
  frame.setAttribute("tabindex", "-1");
  frame.title = "sandboxed code validator — opaque origin, no page access";
  frame.style.display = "none";
  frame.srcdoc = srcdoc;
  return frame;
}

export interface SandboxHarnessOptions {
  /** Raw IIFE source of the compiled validator bundle. */
  validatorSource: string;
  /** Runtime libraries to load into the sandbox before validation. */
  runtime?: RuntimeLibrary[];
  timeoutMs?: number;
  /** Live console-stream callback (in addition to `result.console`). */
  onConsole?: (line: ConsoleLine) => void;
  /** Override iframe creation (tests). Defaults to a hidden real iframe. */
  createFrame?: FrameFactory;
}

interface PendingRun {
  resolve: (result: ValidationResult) => void;
  timer: number;
}

/**
 * Client-side harness managing one validator sandbox iframe. Reusable across
 * multiple runs; destroyed automatically on timeout or `destroy()`.
 */
export class SandboxHarness {
  private readonly options: Required<Omit<SandboxHarnessOptions, "onConsole" | "createFrame">> &
    Pick<SandboxHarnessOptions, "onConsole" | "createFrame">;

  private frame: HTMLIFrameElement | null = null;
  private readonly listener: (event: MessageEvent) => void;
  private readonly pending = new Map<number, PendingRun>();
  private seq = 0;
  private destroyed = false;

  constructor(options: SandboxHarnessOptions) {
    this.options = {
      validatorSource: options.validatorSource,
      runtime: options.runtime ?? [],
      timeoutMs: options.timeoutMs ?? DEFAULT_VALIDATOR_TIMEOUT_MS,
      onConsole: options.onConsole,
      createFrame: options.createFrame,
    };
    this.listener = (event) => this.handleMessage(event);
  }

  /** Run the validator over the learner's code. Always resolves. */
  run(code: Record<string, string>, config: Record<string, unknown>): Promise<ValidationResult> {
    if (this.destroyed) {
      return Promise.resolve(this.failed("The validation sandbox was disposed."));
    }
    const frame = this.ensureFrame();
    const id = ++this.seq;

    return new Promise((resolve) => {
      const timer = window.setTimeout(
        () => this.handleTimeout(id, resolve),
        this.options.timeoutMs,
      );
      this.pending.set(id, { resolve, timer });
      this.postToFrame(frame, { id, type: "run", code, config } satisfies RunRequest);
    });
  }

  destroy(): void {
    this.destroyed = true;
    for (const pending of this.pending.values()) {
      window.clearTimeout(pending.timer);
      pending.resolve(this.failed("The validation sandbox was disposed."));
    }
    this.pending.clear();
    if (this.listener) window.removeEventListener("message", this.listener);
    if (this.frame) {
      const frame = this.frame;
      this.frame = null;
      try {
        frame.remove();
      } catch {
        /* already detached */
      }
    }
  }

  private ensureFrame(): HTMLIFrameElement {
    if (this.frame) return this.frame;
    const html = buildSandboxHtml(this.options.validatorSource, this.options.runtime ?? []);
    const create = this.options.createFrame ?? createDefaultFrame;
    const frame = create(html);
    this.frame = frame;
    window.addEventListener("message", this.listener);
    try {
      if (typeof frame.remove !== "function") {
        // Tests provide non-DOM frames; nothing to append.
        void frame;
      } else if (document.body) {
        document.body.appendChild(frame);
      }
    } catch {
      /* sandbox attachment is best-effort */
    }
    return frame;
  }

  private postToFrame(frame: HTMLIFrameElement, message: RunRequest): void {
    // A transient null contentWindow self-heals via the run timeout.
    frame.contentWindow?.postMessage(message, "*");
  }

  private handleMessage(event: MessageEvent): void {
    if (!this.frame || event.source !== this.frame.contentWindow) return;
    if (event.origin !== "null") return;
    const message = event.data as SandboxMessage | undefined;
    if (!message || typeof message !== "object") return;

    if (message.type === "console") {
      this.options.onConsole?.({
        level: message.level as ConsoleLine["level"],
        text: message.text,
      });
      return;
    }
    if (message.type === "ready") return;
    if (message.type === "result" && typeof message.id === "number") {
      this.resolvePending(message.id, message.result);
      return;
    }
    if (message.type === "error" && typeof message.id === "number") {
      this.resolvePending(message.id, this.failed(`[sandbox] ${message.message}`));
    }
  }

  private resolvePending(id: number, result: ValidationResult): void {
    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);
    window.clearTimeout(pending.timer);
    pending.resolve(result);
  }

  private handleTimeout(id: number, resolve: (result: ValidationResult) => void): void {
    if (!this.pending.has(id)) return;
    this.pending.delete(id);
    resolve(this.failed("Validation timed out — is the code stuck in an infinite loop?"));
    this.destroy();
  }

  private failed(message: string): ValidationResult {
    return { passed: false, checks: [], console: [], feedback: [message] };
  }
}

/** Convenience factory used by the ChallengeRunner. */
export function createHarness(
  validatorSource: string,
  type: string,
  onConsole?: (line: ConsoleLine) => void,
): SandboxHarness {
  return new SandboxHarness({
    validatorSource,
    runtime: runtimeLibsFor(type),
    onConsole,
  });
}
