"use client";

import { useMemo, useState } from "react";
import { Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  matchRequest,
  parseExpressRoutes,
  type HttpMethod,
  type MockResponse,
} from "@/features/playground/express-mock";
import type { PlaygroundPreset } from "@/types/playground";

import { MonacoEditor } from "./monaco-editor";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLOR: Record<HttpMethod, string> = {
  GET: "text-emerald-500",
  POST: "text-sky-500",
  PUT: "text-amber-500",
  PATCH: "text-violet-500",
  DELETE: "text-rose-500",
};

interface HistoryEntry {
  method: HttpMethod;
  path: string;
  body?: string;
  res: MockResponse;
}

interface ExpressMockPanelProps {
  preset: PlaygroundPreset;
  title: string;
}

export function ExpressMockPanel({ preset, title }: ExpressMockPanelProps) {
  const mainFile = preset.files.find((file) => file.path === preset.mainFile) ?? preset.files[0];

  const [code, setCode] = useState(mainFile?.code ?? "");
  const routes = useMemo(() => parseExpressRoutes(code), [code]);

  const [method, setMethod] = useState<HttpMethod>("GET");
  const [path, setPath] = useState("/");
  const [body, setBody] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  if (!mainFile) return null;

  const sendRequest = () => {
    const res = matchRequest(routes, method, path.trim() || "/", body);
    setHistory((entries) =>
      [{ method, path: path.trim() || "/", body, res }, ...entries].slice(0, 25),
    );
  };

  return (
    <div className="bg-card border-border flex h-[80vh] min-h-[520px] flex-col overflow-hidden rounded-lg border">
      <div className="border-border flex items-center justify-between gap-2 border-b px-4 py-2">
        <span className="text-foreground truncate text-sm font-semibold">{title}</span>
        <span className="text-muted-foreground hidden shrink-0 text-xs sm:block">
          {routes.length} route{routes.length === 1 ? "" : "s"} parsed
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Editor */}
        <div className="border-border flex min-h-[320px] flex-col border-b lg:min-h-0 lg:border-r lg:border-b-0">
          <div className="border-border bg-muted/40 border-b px-4 py-1.5">
            <span className="text-muted-foreground font-mono text-xs">
              {mainFile.path.replace(/^\//, "")}
            </span>
          </div>
          <div className="relative min-h-0 flex-1">
            <MonacoEditor
              path={mainFile.path}
              language={mainFile.language}
              value={code}
              onChange={setCode}
            />
          </div>
        </div>

        {/* Mock request panel */}
        <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="border-border bg-muted/30 flex flex-col gap-2 border-b p-3">
            <div className="flex gap-2">
              <div className="bg-background inline-flex shrink-0 rounded-md border p-0.5">
                {METHODS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMethod(value)}
                    className={cn(
                      "rounded px-2 py-1 text-xs font-semibold transition-colors",
                      method === value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <Input
                value={path}
                onChange={(event) => setPath(event.target.value)}
                placeholder="/users/:id"
                className="font-mono text-sm"
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendRequest();
                }}
              />
            </div>
            <Input
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder='Request body (JSON) — e.g. {"name":"Ada"}'
              className="font-mono text-sm"
              onKeyDown={(event) => {
                if (event.key === "Enter") sendRequest();
              }}
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={sendRequest}>
                <Send /> Send request
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setHistory([])}
              >
                <Trash2 /> Clear
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-muted-foreground px-4 py-6 text-sm">
                Send a request to see the simulated response. Click a parsed route below to fill the
                path.
              </p>
            ) : (
              <ul className="divide-border divide-y">
                {history.map((entry, index) => (
                  <li key={index} className="px-4 py-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant="outline"
                        className={cn("font-mono", METHOD_COLOR[entry.method])}
                      >
                        {entry.method}
                      </Badge>
                      <code className="text-foreground truncate font-mono">{entry.path}</code>
                      <span
                        className={cn(
                          "ml-auto shrink-0 font-mono font-semibold",
                          entry.res.status >= 400 ? "text-rose-500" : "text-emerald-500",
                        )}
                      >
                        {entry.res.status}
                      </span>
                    </div>
                    <pre className="bg-muted/40 text-foreground/90 mt-2 overflow-x-auto rounded-md p-2 font-mono text-xs leading-5">
                      {JSON.stringify(entry.res.body, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-border bg-card/95 sticky bottom-0 border-t px-4 py-3">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Parsed routes
              </p>
              <ul className="space-y-1">
                {routes.length === 0 ? (
                  <li className="text-muted-foreground text-sm">
                    No routes found — use{" "}
                    <code className="font-mono">app.get(&quot;/path&quot;, ...)</code> style
                    handlers.
                  </li>
                ) : (
                  routes.map((route, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => {
                          setMethod(route.method);
                          setPath(route.path);
                        }}
                        className="hover:bg-muted flex w-full items-center gap-2 rounded px-1 py-1 text-left text-xs transition-colors"
                      >
                        <span className={cn("font-mono font-semibold", METHOD_COLOR[route.method])}>
                          {route.method}
                        </span>
                        <code className="text-foreground truncate font-mono">{route.path}</code>
                        <span className="text-muted-foreground ml-auto font-mono">
                          {route.status}
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
