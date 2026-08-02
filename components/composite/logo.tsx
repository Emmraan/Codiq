import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the wordmark, showing only the mark. */
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="glow-primary from-primary via-primary/80 to-chart-2 text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-sm font-black"
      >
        C
      </span>
      {!iconOnly && <span className="text-lg font-bold tracking-tight">CODIQ</span>}
    </span>
  );
}
