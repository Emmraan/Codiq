/**
 * MDX component provider.
 *
 * Compiled content imports `useMDXComponents` from this module (wired through
 * the `providerImportSource` compile option in `lib/content/mdx.ts`). It maps
 * markdown elements to styled primitives and provides the CODIQ-specific
 * building blocks: notes, diagrams, common-mistakes, interview-questions, and
 * playground placeholders.
 */
import type { ComponentType, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, CircleAlert, FlaskConical, XCircle } from "lucide-react";

/**
 * Component map contract for the MDX provider (mirrors `MDXComponents` from the
 * `mdx` type package without adding a dependency).
 */
export type MDXComponents = Record<string, ComponentType | undefined>;

type NoteVariant = "info" | "warning" | "success";

const noteStyles: Record<NoteVariant, { box: string; icon: ReactNode }> = {
  info: {
    box: "border-primary/30 bg-primary/[0.06]",
    icon: <CircleAlert className="text-primary size-4 shrink-0" />,
  },
  warning: {
    box: "border-warning/40 bg-warning/[0.08]",
    icon: <AlertTriangle className="text-warning size-4 shrink-0" />,
  },
  success: {
    box: "border-success/40 bg-success/[0.08]",
    icon: <CheckCircle2 className="text-success size-4 shrink-0" />,
  },
};

function Note({
  variant = "info",
  title,
  children,
}: {
  variant?: NoteVariant;
  title?: string;
  children?: ReactNode;
}) {
  const style = noteStyles[variant];
  return (
    <div className={`my-6 flex gap-3 rounded-lg border p-4 ${style.box}`}>
      {style.icon}
      <div className="text-foreground/90 min-w-0 flex-1 text-sm leading-7">
        {title ? <p className="text-foreground mb-1 font-semibold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}

function Diagram({ title = "Diagram", children }: { title?: string; children?: ReactNode }) {
  return (
    <figure className="border-muted-foreground/40 my-6 rounded-lg border border-dashed p-6 text-center">
      <figcaption className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
        {title}
      </figcaption>
      <div className="text-muted-foreground text-sm">{children}</div>
    </figure>
  );
}

function CommonMistakes({ children }: { children?: ReactNode }) {
  return (
    <div className="border-destructive/30 bg-destructive/[0.06] my-6 rounded-lg border p-4">
      <p className="text-destructive mb-2 flex items-center gap-2 text-sm font-semibold">
        <XCircle className="size-4" />
        Common mistakes
      </p>
      <div className="text-foreground/90 text-sm leading-7">{children}</div>
    </div>
  );
}

function InterviewQuestion({
  level = "common",
  children,
}: {
  level?: string;
  children?: ReactNode;
}) {
  return (
    <details className="group border-border bg-muted/40 open:bg-muted/60 my-6 rounded-lg border p-4">
      <summary className="text-foreground cursor-pointer text-sm font-semibold select-none">
        Interview question
        <span className="text-muted-foreground ml-2 text-xs font-normal">({level})</span>
      </summary>
      <div className="text-foreground/90 mt-3 text-sm leading-7">{children}</div>
    </details>
  );
}

function Playground({ title = "Live playground" }: { title?: string }) {
  return (
    <div className="border-border bg-card my-6 rounded-lg border p-6 text-center">
      <FlaskConical className="text-muted-foreground mx-auto mb-2 size-5" />
      <p className="text-foreground text-sm font-semibold">{title}</p>
      <p className="text-muted-foreground mt-1 text-xs">
        Interactive playgrounds become interactive in a later phase.
      </p>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="text-foreground mt-10 mb-4 scroll-mt-24 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-foreground mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="text-foreground mt-6 mb-2 scroll-mt-24 text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  h5: (props) => (
    <h5 className="text-foreground mt-5 mb-2 scroll-mt-24 text-base font-semibold" {...props} />
  ),
  h6: (props) => (
    <h6
      className="text-muted-foreground mt-4 mb-2 scroll-mt-24 text-sm font-semibold tracking-wider uppercase"
      {...props}
    />
  ),
  p: (props) => <p className="text-foreground/90 my-4 leading-7" {...props} />,
  a: (props) => (
    <a className="text-primary font-medium underline-offset-4 hover:underline" {...props} />
  ),
  ul: (props) => <ul className="text-foreground/90 my-4 list-disc space-y-1.5 pl-6" {...props} />,
  ol: (props) => (
    <ol className="text-foreground/90 my-4 list-decimal space-y-1.5 pl-6" {...props} />
  ),
  li: (props) => <li className="leading-7" {...props} />,
  strong: (props) => <strong className="text-foreground font-semibold" {...props} />,
  em: (props) => <em {...props} />,
  del: (props) => <del className="text-muted-foreground" {...props} />,
  hr: (props) => <hr className="border-border my-8" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-primary/40 bg-muted/30 text-muted-foreground my-6 rounded-r-lg border-l-4 py-2 pr-4 pl-4 italic"
      {...props}
    />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element -- content images have arbitrary dimensions; next/image needs fixed ones
    <img className="border-border my-6 rounded-lg border" alt="" {...props} />
  ),
  code: (props) => (
    <code
      className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[0.9em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="border-border bg-muted/50 my-6 overflow-x-auto rounded-lg border p-4 text-sm leading-6 [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[0.9em]"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="text-foreground/90 w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border-border bg-muted/40 border-b px-3 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props) => <td className="border-border border-b px-3 py-2 align-top" {...props} />,
  Note,
  Diagram,
  CommonMistakes,
  InterviewQuestion,
  Playground,
};

export function useMDXComponents(): MDXComponents {
  return mdxComponents;
}
