"use client";

import {
  SandpackConsole,
  SandpackPreview,
  SandpackProvider,
  SandpackTranspiledCode,
  useSandpack,
  type SandpackFiles,
} from "@codesandbox/sandpack-react";
import { Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PlaygroundPreset } from "@/types/playground";

import { MonacoEditor } from "./monaco-editor";

interface SandpackWorkspaceProps {
  preset: PlaygroundPreset;
  title: string;
}

export function SandpackWorkspace({ preset, title }: SandpackWorkspaceProps) {
  const files: SandpackFiles = {};
  for (const file of preset.files) {
    files[file.path] = file.code;
  }

  return (
    <SandpackProvider
      template={preset.template}
      files={files}
      options={{
        initMode: "user-visible",
        autoReload: true,
        recompileMode: "delayed",
        recompileDelay: 500,
        activeFile: preset.mainFile,
        visibleFiles: preset.files.map((file) => file.path),
        externalResources: preset.externalResources,
      }}
    >
      <div className="bg-card border-border flex h-[80vh] min-h-[520px] flex-col overflow-hidden rounded-lg border">
        <WorkspaceToolbar title={title} />
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2">
          <EditorPane preset={preset} />
          <PreviewPane preset={preset} />
        </div>
      </div>
    </SandpackProvider>
  );
}

function WorkspaceToolbar({ title }: { title: string }) {
  const { sandpack } = useSandpack();
  const { runSandpack, resetAllFiles } = sandpack;

  return (
    <div className="border-border flex items-center justify-between gap-2 border-b px-4 py-2">
      <span className="text-foreground truncate text-sm font-semibold">{title}</span>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => resetAllFiles()}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw /> Reset
        </Button>
        <Button size="sm" onClick={() => runSandpack()}>
          <Play /> Run
        </Button>
      </div>
    </div>
  );
}

function EditorPane({ preset }: { preset: PlaygroundPreset }) {
  const { sandpack } = useSandpack();
  const { files, activeFile, setActiveFile, updateFile } = sandpack;

  const activePath = preset.files.some((file) => file.path === activeFile)
    ? activeFile
    : preset.mainFile;
  const activePreset = preset.files.find((file) => file.path === activePath) ??
    preset.files[0] ?? {
      path: activePath,
      language: "javascript",
      code: "",
    };

  const raw = files[activePath];
  const code = typeof raw === "string" ? raw : (raw?.code ?? "");

  return (
    <div className="border-border flex min-h-[320px] flex-col border-b lg:min-h-0 lg:border-r lg:border-b-0">
      <div className="border-border bg-muted/40 flex items-center gap-1 overflow-x-auto border-b px-2 py-1.5">
        {preset.files.map((file) => {
          const isActive = file.path === activePath;
          return (
            <button
              key={file.path}
              type="button"
              onClick={() => setActiveFile(file.path)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {file.path.replace(/^\//, "")}
            </button>
          );
        })}
      </div>
      <div className="relative min-h-0 flex-1">
        <MonacoEditor
          key={activePath}
          path={activePath}
          language={activePreset.language}
          value={code}
          onChange={(next) => updateFile(activePath, next)}
        />
      </div>
    </div>
  );
}

function PreviewPane({ preset }: { preset: PlaygroundPreset }) {
  const panels: Array<{ value: string; label: string; node: React.ReactNode }> = [];
  if (preset.showsPreview) {
    panels.push({
      value: "preview",
      label: "Preview",
      node: <SandpackPreview style={{ height: "100%" }} showNavigator={false} />,
    });
  }
  if (preset.showsConsole) {
    panels.push({
      value: "console",
      label: "Console",
      node: <SandpackConsole showHeader={false} maxMessageCount={200} />,
    });
  }
  if (preset.showsTranspiled) {
    panels.push({
      value: "output",
      label: "Output",
      node: <SandpackTranspiledCode className="h-full" />,
    });
  }

  return (
    <div className="bg-muted/30 relative min-h-[320px] lg:min-h-0">
      {panels.length <= 1 ? (
        <div className="h-full">{panels[0]?.node}</div>
      ) : (
        <Tabs defaultValue={panels[0]?.value} className="h-full">
          <TabsList className="mx-3 mt-3 w-auto">
            {panels.map((panel) => (
              <TabsTrigger key={panel.value} value={panel.value}>
                {panel.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {panels.map((panel) => (
            <TabsContent key={panel.value} value={panel.value} className="h-[calc(100%-2.75rem)]">
              {panel.node}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
