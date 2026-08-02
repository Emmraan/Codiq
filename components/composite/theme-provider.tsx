"use client";

import * as React from "react";

import { useSettingsStore } from "@/store/settings-store";

/**
 * Applies the active theme as a `data-theme` attribute on <html>.
 * Dark is the default (see globals.css); light is opt-in from Settings.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
