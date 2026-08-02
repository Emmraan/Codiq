"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/composite/github-icon";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/composite/mode-toggle";
import { Logo } from "@/components/composite/logo";
import { mainNav, secondaryNav } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="container-site flex h-14 items-center gap-4">
        <Link href="/" aria-label="CODIQ home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === item.href && "text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="bg-muted/40 text-muted-foreground hover:bg-muted hidden h-9 w-56 items-center gap-2 rounded-md border px-3 text-sm transition-colors sm:flex"
          >
            <SearchIcon className="size-4" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="bg-background text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => setCommandPaletteOpen(true)}
            className="sm:hidden"
          >
            <SearchIcon className="size-4" />
          </Button>

          <ModeToggle />

          <Button variant="ghost" size="icon" asChild aria-label="GitHub repository">
            <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="size-4" />
            </Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="md:hidden"
              >
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {[...mainNav, ...secondaryNav].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href && "bg-accent text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
