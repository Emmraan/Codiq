import {
  Atom,
  Blocks,
  BookOpen,
  Braces,
  CodeXml,
  FlaskConical,
  LayoutPanelTop,
  Palette,
  Route,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Wind,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps stable string keys (used in content metadata and config seeds) to
 * Lucide components. Adding a new icon here makes it available to any
 * technology/module without touching content files.
 */
export const iconMap: Record<string, LucideIcon> = {
  atom: Atom,
  blocks: Blocks,
  book: BookOpen,
  braces: Braces,
  code: CodeXml,
  flask: FlaskConical,
  "layout-template": LayoutPanelTop,
  palette: Palette,
  route: Route,
  server: Server,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  terminal: Terminal,
  wind: Wind,
};

/** Neutral fallback used when a key is unknown. */
export const FALLBACK_ICON: LucideIcon = Blocks;

/** Resolve an icon by its stable key, falling back to a neutral default. */
export function getIcon(name?: string): LucideIcon {
  return (name ? iconMap[name] : undefined) ?? FALLBACK_ICON;
}
