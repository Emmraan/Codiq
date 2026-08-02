import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Standard page hero used across index pages. */
export function PageHeader({ eyebrow, title, description, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {eyebrow && <div className="text-muted-foreground text-sm font-medium">{eyebrow}</div>}
      <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl text-lg text-pretty">{description}</p>
      )}
      {children}
    </div>
  );
}
