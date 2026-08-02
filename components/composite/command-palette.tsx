"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MoonIcon, SunIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUIStore } from "@/store/ui-store";
import { useSettingsStore } from "@/store/settings-store";
import { useHotkey } from "@/hooks/use-hotkey";
import { mainNav, secondaryNav } from "@/config/nav";
import { siteConfig } from "@/config/site";

/**
 * Global command palette (⌘K). Phase 1 exposes quick navigation and actions;
 * instant full-content search lands in Phase 6 (see features/search/).
 */
export function CommandPalette() {
  const router = useRouter();
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  useHotkey("k", () => setOpen(true));

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {[...mainNav, ...secondaryNav].map((item) => (
            <CommandItem key={item.href} value={item.title} onSelect={() => navigate(item.href)}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.description && (
                <span className="text-muted-foreground ml-2 text-xs">{item.description}</span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem
            value="Toggle theme"
            onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            <span>Switch to {theme === "dark" ? "light" : "dark"} theme</span>
          </CommandItem>
          <CommandItem
            value="Open GitHub"
            onSelect={() => window.open(siteConfig.links.github, "_blank")}
          >
            <span>Open GitHub repository</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
