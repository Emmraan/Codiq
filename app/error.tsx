"use client";

import { useEffect } from "react";
import { TriangleAlert, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <TriangleAlert className="text-destructive size-10" />
      <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        An unexpected error occurred while rendering this page. Your progress is safe.
      </p>
      <Button onClick={reset} variant="outline">
        <RefreshCw /> Try again
      </Button>
    </div>
  );
}
