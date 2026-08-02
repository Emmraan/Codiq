import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <Compass className="text-muted-foreground size-10" />
      <p className="text-muted-foreground font-mono text-sm">404</p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The page you are looking for does not exist or has not been published yet.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">
            <ArrowLeft /> Back home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/technologies">Browse technologies</Link>
        </Button>
      </div>
    </div>
  );
}
