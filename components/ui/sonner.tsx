"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

import { useSettingsStore } from "@/store/settings-store";

function Toaster(props: ToasterProps) {
  const theme = useSettingsStore((s) => s.theme);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}

export { Toaster };
