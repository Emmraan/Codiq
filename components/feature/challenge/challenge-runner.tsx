"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, Lightbulb, Loader2, Play, RotateCcw, XCircle } from "lucide-react";

import { MonacoEditor } from "@/components/feature/playground/monaco-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/store/progress-store";
import { validatorSources } from "@/lib/generated/validator-sources";
import { cn } from "@/lib/utils";
import type { CheckResult, ConsoleLine, ValidationResult } from "@/validators/types";
import { createHarness } from "@/validators/harness";
import type { ChallengeMetadata, Difficulty } from "@/types/content";

import { SuccessDialog } from "./success-dialog";

const LANGUAGE_BY_EXT: Record<string, string> = {
  html: "html",
  htm: "html",
  css: "css",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  json: "json",
  md: "markdown",
};

function languageForFile(name: string): string {
  const extension = name.split(".").pop() ?? "";
  return LANGUAGE_BY_EXT[extension] ?? "plaintext";
}

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  beginner: "text-success border-success/30 bg-success/10",
  intermediate: "text-sky-400 border-sky-500/30 bg-sky-500/10",
  advanced: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  expert: "text-destructive border-destructive/30 bg-destructive/10",
};

interface ChallengeRunnerProps {
  challenge: ChallengeMetadata;
  /** Unique id used to record lab completion (the lesson slug). */
  labId: string;
}

type RunStatus = "idle" | "running" | "done";

const MAX_CONSOLE_LINES = 200;

export function ChallengeRunner({ challenge, labId }: ChallengeRunnerProps) {
  const [files, setFiles] = useState<Record<string, string>>(() => ({ ...challenge.seed }));
  const [activeFile, setActiveFile] = useState<string>(() => Object.keys(challenge.seed)[0] ?? "");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [completed, setCompleted] = useState(
    () =>
      typeof window !== "undefined" && useProgressStore.getState().completedLabs.includes(labId),
  );

  const harnessRef = useRef<ReturnType<typeof createHarness> | null>(null);
  const consoleRef = useRef<ConsoleLine[]>([]);

  const validatorSource = useMemo(
    () => (challenge.validatorKey ? validatorSources[challenge.validatorKey] : undefined),
    [challenge.validatorKey],
  );

  const entries = useMemo(() => Object.entries(files), [files]);
  const seed = useMemo(() => ({ ...challenge.seed }), [challenge.seed]);

  const getHarness = useCallback(() => {
    if (!harnessRef.current && validatorSource) {
      harnessRef.current = createHarness(validatorSource, challenge.validator.type, (line) => {
        consoleRef.current = [...consoleRef.current, line].slice(-MAX_CONSOLE_LINES);
        setConsoleLines(consoleRef.current);
      });
    }
    return harnessRef.current;
  }, [validatorSource, challenge.validator.type]);

  useEffect(
    () => () => {
      harnessRef.current?.destroy();
      harnessRef.current = null;
    },
    [],
  );

  const describeCheck = (id: string): CheckResult | undefined =>
    result?.checks.find((check) => check.id === id);

  const run = useCallback(async () => {
    const harness = getHarness();
    if (!harness || status === "running") return;

    consoleRef.current = [];
    setConsoleLines([]);
    setResult(null);
    setStatus("running");

    const next = await harness.run(files, challenge.validator);
    setResult(next);
    setStatus("done");

    if (next.passed && !useProgressStore.getState().completedLabs.includes(labId)) {
      useProgressStore.getState().completeLab(labId, challenge.xp);
      setCompleted(true);
      setShowSuccess(true);
    }
  }, [challenge.validator, challenge.xp, files, getHarness, labId, status]);

  const reset = useCallback(() => {
    setFiles(seed);
    setActiveFile(Object.keys(seed)[0] ?? "");
    consoleRef.current = [];
    setConsoleLines([]);
    setResult(null);
    setStatus("idle");
    setHintsShown(0);
  }, [seed]);

  const showHint = useCallback(() => {
    setHintsShown((count) => Math.min(count + 1, challenge.hints.length));
  }, [challenge.hints.length]);

  const fileNames = Object.keys(seed);
  const passedCount = result?.checks.filter((check) => check.passed).length ?? 0;
  const failCount = result ? result.checks.filter((check) => !check.passed).length : 0;
  const running = status === "running";

  return (
    <div className="border-border overflow-hidden rounded-lg border">
      {/* Toolbar */}
      <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className={cn("capitalize", DIFFICULTY_STYLE[challenge.difficulty])}
          >
            {challenge.difficulty}
          </Badge>
          <Badge variant="warning">{challenge.xp} XP</Badge>
          {completed && <Badge variant="success">Completed</Badge>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            disabled={running}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw /> Reset
          </Button>
          <Button size="sm" onClick={run} disabled={running || !validatorSource}>
            {running ? <Loader2 className="animate-spin" /> : <Play />}
            {running ? "Validating…" : "Run"}
          </Button>
        </div>
      </div>

      <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-2">
        {/* Editor */}
        <div className="border-border flex min-h-[340px] flex-col border-b lg:border-r lg:border-b-0">
          <div className="border-border bg-muted/40 flex items-center gap-1 overflow-x-auto border-b px-2 py-1.5">
            {fileNames.length === 0 && (
              <span className="text-muted-foreground px-2 py-1 text-xs">
                This challenge has no starter files.
              </span>
            )}
            {fileNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setActiveFile(name)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-mono text-xs whitespace-nowrap transition-colors",
                  activeFile === name
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="relative min-h-0 flex-1">
            {entries.length > 0 && (
              <MonacoEditor
                key={activeFile}
                path={`/${activeFile}`}
                language={languageForFile(activeFile)}
                value={files[activeFile] ?? ""}
                onChange={(value) => setFiles((prev) => ({ ...prev, [activeFile]: value ?? "" }))}
              />
            )}
          </div>
        </div>

        {/* Results */}
        <ResultsPanel
          running={running}
          result={result}
          consoleLines={consoleLines}
          requirements={challenge.requirements}
          hints={challenge.hints}
          hintsShown={hintsShown}
          showHint={showHint}
          passedCount={passedCount}
          failCount={failCount}
          requireAccount={!validatorSource}
          describeCheck={describeCheck}
        />
      </div>

      <SuccessDialog open={showSuccess} onOpenChange={setShowSuccess} xp={challenge.xp} />
    </div>
  );
}

interface ResultsPanelProps {
  running: boolean;
  result: ValidationResult | null;
  consoleLines: ConsoleLine[];
  requirements: Array<{ id: string; label: string; hint?: string }>;
  hints: string[];
  hintsShown: number;
  showHint: () => void;
  passedCount: number;
  failCount: number;
  requireAccount: boolean;
  describeCheck: (id: string) => CheckResult | undefined;
}

function ResultsPanel({
  running,
  result,
  consoleLines,
  requirements,
  hints,
  hintsShown,
  showHint,
  passedCount,
  failCount,
  requireAccount,
  describeCheck,
}: ResultsPanelProps) {
  const feedback = result?.feedback ?? [];
  const total = requirements.length;

  return (
    <div className="flex min-h-0 flex-col overflow-y-auto">
      <div className="border-border bg-muted/30 border-b px-4 py-2.5">
        <span className="text-foreground text-sm font-semibold">Results</span>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* Run banner */}
        {running && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Running your code in the sandbox…
          </div>
        )}

        {requireAccount && (
          <div className="text-muted-foreground border-border bg-muted/30 rounded-md border p-3 text-sm">
            This challenge ships without a validator bundle. Add a{" "}
            <code className="font-mono">validator.ts</code> next to{" "}
            <code className="font-mono">challenge.json</code> to enable grading.
          </div>
        )}

        {!running && result && (
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-center gap-3 rounded-md border p-3 text-sm font-medium",
                result.passed
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {result.passed ? (
                <CheckCircle2 className="size-5 shrink-0" />
              ) : (
                <XCircle className="size-5 shrink-0" />
              )}
              <span>
                {result.passed
                  ? `All ${total} checks passed — well done!`
                  : `${failCount} of ${total} checks failed`}
              </span>
            </div>

            <Progress
              value={total === 0 ? 0 : Math.round((passedCount / total) * 100)}
              className="h-1.5"
            />
          </div>
        )}

        {/* Requirements checklist */}
        <section aria-label="Requirements">
          <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Requirements
          </h4>
          <ul className="border-border divide-border mt-2 divide-y rounded-md border">
            {requirements.map((requirement) => {
              const check = describeCheck(requirement.id);
              const state =
                check === undefined
                  ? running
                    ? "running"
                    : "pending"
                  : check.passed
                    ? "pass"
                    : "fail";
              return (
                <li key={requirement.id} className="flex gap-3 p-3">
                  <RequirementIcon state={state} />
                  <div className="min-w-0">
                    <p className="text-foreground/90 text-sm">{requirement.label}</p>
                    {state === "fail" && check?.hint && (
                      <p className="text-muted-foreground mt-1 text-xs">{check.hint}</p>
                    )}
                    {state === "fail" && check?.message && (
                      <p className="text-destructive mt-1 text-xs">{check.message}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Feedback */}
        {feedback.length > 0 && (
          <section aria-label="Feedback">
            <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Feedback
            </h4>
            <ul className="mt-2 space-y-1.5">
              {feedback.map((line, index) => (
                <li key={index} className="text-muted-foreground text-xs">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Console */}
        {consoleLines.length > 0 && (
          <section aria-label="Console output">
            <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Console
            </h4>
            <pre className="bg-muted/40 text-foreground/90 mt-2 max-h-48 overflow-y-auto rounded-md p-3 font-mono text-xs leading-5">
              {consoleLines.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    line.level === "error" && "text-destructive",
                    line.level === "warn" && "text-warning",
                  )}
                >
                  <span className="text-muted-foreground select-none">{line.level}</span>{" "}
                  {line.text}
                </div>
              ))}
            </pre>
          </section>
        )}

        {/* Hints */}
        <section aria-label="Hints">
          <div className="flex items-center justify-between">
            <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Hints
            </h4>
            {hints.length > hintsShown && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground h-7 text-xs"
                onClick={showHint}
              >
                <Lightbulb /> Reveal hint ({hintsShown}/{hints.length})
              </Button>
            )}
          </div>
          {hintsShown === 0 ? (
            <p className="text-muted-foreground mt-2 text-xs">
              Stuck? Hints reveal progressively and never cost anything.
            </p>
          ) : (
            <ol className="border-border mt-2 space-y-2 rounded-md border p-3">
              {hints.slice(0, hintsShown).map((hint, index) => (
                <li key={index} className="text-muted-foreground flex gap-2 text-xs leading-5">
                  <span className="text-primary shrink-0 font-semibold">{index + 1}.</span>
                  <span className="whitespace-pre-wrap">{hint}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

type RequirementState = "pending" | "running" | "pass" | "fail";

function RequirementIcon({ state }: { state: RequirementState }) {
  if (state === "pass") {
    return <CheckCircle2 className="text-success mt-0.5 size-4 shrink-0" />;
  }
  if (state === "fail") {
    return <XCircle className="text-destructive mt-0.5 size-4 shrink-0" />;
  }
  return (
    <Circle
      className={cn(
        "text-muted-foreground mt-0.5 size-4 shrink-0",
        state === "running" && "animate-pulse",
      )}
    />
  );
}
