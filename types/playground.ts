/**
 * Contracts for the per-technology playgrounds (Phase 3).
 *
 * These types intentionally avoid importing Monaco/Sandpack so the preset
 * config stays a plain, serializable data structure that server components
 * can hand to client islands.
 */

/** How a technology's playground is rendered. */
export type PlaygroundMode = "sandpack" | "express-mock";

/** Sandpack template presets we use. */
export type SandpackTemplateName = "vanilla" | "vanilla-ts" | "react-ts" | "node";

/** Monaco language id per file. */
export type MonacoLanguage = "html" | "css" | "javascript" | "typescript" | "json" | "markdown";

export interface PlaygroundFile {
  /** Absolute path inside the sandbox, e.g. `/styles.css`. */
  path: string;
  /** Monaco language id for the editor. */
  language: MonacoLanguage;
  /** Initial contents shown on first load. */
  code: string;
}

export interface PlaygroundPreset {
  mode: PlaygroundMode;
  /** Sandpack template used when `mode === "sandpack"`. */
  template: SandpackTemplateName;
  /** Ordered, editable files (also the file tabs). */
  files: PlaygroundFile[];
  /** Path opened by default. */
  mainFile: string;
  /** Show the live browser preview. */
  showsPreview: boolean;
  /** Show the console panel (JS logs / Node stdout). */
  showsConsole: boolean;
  /** Show the transpiled output panel (TS → JS). */
  showsTranspiled: boolean;
  /** Extra resources injected into the sandbox (e.g. Tailwind CDN). */
  externalResources?: string[];
  /** Short helper text shown above the workspace. */
  description: string;
}
