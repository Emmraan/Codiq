"use client";

import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";
import type { PlaygroundPreset } from "@/types/playground";

const SandpackWorkspace = dynamic(
  () => import("./sandpack-workspace").then((mod) => mod.SandpackWorkspace),
  { ssr: false, loading: () => <WorkspaceSkeleton /> },
);

const ExpressMockPanel = dynamic(
  () => import("./express-mock-panel").then((mod) => mod.ExpressMockPanel),
  { ssr: false, loading: () => <WorkspaceSkeleton /> },
);

interface PlaygroundProps {
  preset: PlaygroundPreset;
  title: string;
}

export function Playground({ preset, title }: PlaygroundProps) {
  return (
    <div className="mt-6">
      <p className="text-muted-foreground max-w-2xl text-sm">{preset.description}</p>
      <div className="mt-4">
        {preset.mode === "express-mock" ? (
          <ExpressMockPanel preset={preset} title={title} />
        ) : (
          <SandpackWorkspace preset={preset} title={title} />
        )}
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="bg-card border-border flex h-[80vh] min-h-[520px] flex-col overflow-hidden rounded-lg border">
      <div className="border-border flex items-center gap-4 border-b px-4 py-2.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="ml-auto h-8 w-24" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 p-4 lg:grid-cols-2">
        <Skeleton className="h-full min-h-[280px]" />
        <Skeleton className="h-full min-h-[280px]" />
      </div>
    </div>
  );
}
