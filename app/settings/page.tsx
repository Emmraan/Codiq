"use client";

import { useRouter } from "next/navigation";
import { MonitorCog, RotateCcw, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/composite/page-header";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSettingsStore, type EditorTheme } from "@/store/settings-store";
import { useProgressStore } from "@/store/progress-store";
import { cn } from "@/lib/utils";

const editorThemes: Array<{ value: EditorTheme; label: string }> = [
  { value: "vs-dark", label: "Dark" },
  { value: "vs", label: "Light" },
  { value: "hc-black", label: "High contrast" },
];

export default function SettingsPage() {
  const router = useRouter();
  const {
    theme,
    setTheme,
    editorFontSize,
    setEditorFontSize,
    editorTheme,
    setEditorTheme,
    animationsEnabled,
    setAnimationsEnabled,
  } = useSettingsStore();
  const resetProgress = useProgressStore((s) => s.resetProgress);

  const handleResetProgress = () => {
    resetProgress();
    toast.success("Progress reset", { description: "All local progress has been cleared." });
    router.refresh();
  };

  return (
    <div className="container-site max-w-3xl py-16">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Personalize your experience. Everything is stored locally in your browser."
      />

      <div className="mt-10 space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose how CODIQ looks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <p className="text-muted-foreground mt-1 text-sm">Dark mode is the default.</p>
              </div>
              <div className="inline-flex rounded-lg border p-1">
                {(["dark", "light"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                      theme === value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Animations</Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  Subtle motion for transitions and completions.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
              >
                <Zap className={cn("size-4", !animationsEnabled && "opacity-40")} />
                {animationsEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Editor</CardTitle>
            <CardDescription>Playground and challenge editor preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="editor-theme">Editor theme</Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  Monaco color scheme in the playground.
                </p>
              </div>
              <div className="inline-flex rounded-lg border p-1">
                {editorThemes.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditorTheme(value)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      editorTheme === value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="font-size">Font size</Label>
                <p className="text-muted-foreground mt-1 text-sm">Editor font size in pixels.</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  id="font-size"
                  type="number"
                  min={10}
                  max={24}
                  value={editorFontSize}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (v >= 10 && v <= 24) setEditorFontSize(v);
                  }}
                  className="w-20 text-center"
                />
                <span className="text-muted-foreground text-sm">px</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>Your progress lives in this browser only.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Reset progress</Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  Erases all lessons, labs, XP and badges. This cannot be undone.
                </p>
              </div>
              <Button variant="destructive" onClick={handleResetProgress}>
                <RotateCcw /> Reset
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Export / Import</Label>
                <p className="text-muted-foreground mt-1 text-sm">
                  Back up or restore your progress.
                </p>
              </div>
              <Badge variant="secondary">
                <MonitorCog className="size-3" /> Phase 6
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
