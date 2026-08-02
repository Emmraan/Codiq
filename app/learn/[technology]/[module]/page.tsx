import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getLessonsByModule,
  getModulesByTechnology,
  getTechnology,
  modules,
} from "@/lib/generated/content-registry";
import { formatReadingTime } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.map((mod) => ({ technology: mod.technologySlug, module: mod.slug }));
}

type ModulePageParams = Promise<{ technology: string; module: string }>;

export async function generateMetadata({
  params,
}: {
  params: ModulePageParams;
}): Promise<Metadata> {
  const { technology, module } = await params;
  const mod = getModulesByTechnology(technology).find((m) => m.slug === module);
  const tech = getTechnology(technology);
  return {
    title: mod ? `${mod.title} · ${tech?.name ?? technology}` : "Module",
    description: mod?.description,
  };
}

export default async function ModulePage({ params }: { params: ModulePageParams }) {
  const { technology, module: moduleSlug } = await params;
  const mod = getModulesByTechnology(technology).find((m) => m.slug === moduleSlug);

  if (!mod) notFound();

  const tech = getTechnology(technology);
  const lessonsInModule = getLessonsByModule(technology, moduleSlug).filter(
    (lesson) => lesson.status !== "draft",
  );
  const techModules = getModulesByTechnology(technology);
  const moduleIndex = techModules.findIndex((m) => m.slug === moduleSlug);
  const prevModule = moduleIndex > 0 ? techModules[moduleIndex - 1] : undefined;
  const nextModule =
    moduleIndex >= 0 && moduleIndex < techModules.length - 1
      ? techModules[moduleIndex + 1]
      : undefined;

  return (
    <div className="container-site py-12">
      <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/technologies" className="hover:text-foreground">
              Technologies
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/technologies/${technology}`} className="hover:text-foreground">
              {tech?.name ?? technology}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            {mod.title}
          </li>
        </ol>
      </nav>

      <header className="mt-6">
        <Badge variant="secondary">
          <BookOpen /> {lessonsInModule.length} lesson{lessonsInModule.length === 1 ? "" : "s"}
        </Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {mod.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">{mod.description}</p>
      </header>

      <ol className="mt-10 max-w-3xl space-y-3">
        {lessonsInModule.map((lesson, index) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/${technology}/${moduleSlug}/${lesson.slug}`}
              className="group block"
            >
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="flex items-center gap-4 p-4">
                  <span className="text-muted-foreground font-mono text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="group-hover:text-primary font-semibold">{lesson.title}</p>
                    <p className="text-muted-foreground truncate text-sm">{lesson.description}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {lesson.difficulty}
                    </Badge>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="size-3.5" />
                      {formatReadingTime(lesson.readingTime)}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Star className="size-3.5" />
                      {lesson.xp}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ol>

      <nav aria-label="Module navigation" className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
        {prevModule ? (
          <Link
            href={`/learn/${technology}/${prevModule.slug}`}
            className="group hover:border-primary/50 border-border flex flex-col gap-1 rounded-lg border p-4 transition-colors"
          >
            <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
              <ChevronLeft className="size-3.5" /> Previous module
            </span>
            <span className="group-hover:text-primary font-medium">{prevModule.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {nextModule ? (
          <Link
            href={`/learn/${technology}/${nextModule.slug}`}
            className="group hover:border-primary/50 border-border flex flex-col gap-1 rounded-lg border p-4 transition-colors sm:text-right"
          >
            <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase sm:justify-end">
              Next module <ChevronRight className="size-3.5" />
            </span>
            <span className="group-hover:text-primary font-medium">{nextModule.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
