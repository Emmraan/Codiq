"use client";

import Editor, { loader } from "@monaco-editor/react";

import { useSettingsStore } from "@/store/settings-store";

/**
 * Self-host the Monaco runtime from `public/vs` (copied from
 * `node_modules/monaco-editor/min/vs` by `pnpm setup:monaco`) instead of
 * pulling it from a CDN. `loader.config` only records settings here; the
 * actual AMD bootstrap happens client-side inside `Editor`.
 */
loader.config({ paths: { vs: "/vs" } });

interface MonacoEditorProps {
  /** Monaco language id, e.g. `"typescript"` or `"css"`. */
  language: string;
  /** Current source. */
  value: string;
  /** Unique model path (keeps a separate model per file). */
  path: string;
  onChange?: (value: string) => void;
}

export function MonacoEditor({ language, value, path, onChange }: MonacoEditorProps) {
  const fontSize = useSettingsStore((s) => s.editorFontSize);
  const editorTheme = useSettingsStore((s) => s.editorTheme);

  return (
    <Editor
      path={path}
      language={language}
      value={value}
      theme={editorTheme}
      onChange={(next) => onChange?.(next ?? "")}
      options={{
        fontSize,
        fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
        fixedOverflowWidgets: true,
      }}
    />
  );
}
