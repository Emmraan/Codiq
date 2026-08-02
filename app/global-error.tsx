"use client";

import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <TriangleAlert className="text-destructive size-10" />
          <h1 className="text-2xl font-bold tracking-tight">Fatal error</h1>
          <p className="text-muted-foreground max-w-md text-sm">
            The application failed to start. Reloading usually fixes this.
          </p>
          <button
            type="button"
            onClick={reset}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
