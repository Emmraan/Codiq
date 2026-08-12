import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Star, Target } from "lucide-react";

import { MdxContent } from "@/components/composite/mdx-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChallengeRunner } from "@/components/feature/challenge/challenge-runner";
import {
  getLessonBySlug,
  getLessonsByModule,
  getModulesByTechnology,
  getTechnology,
  lessons,
} from "@/lib/generated/content-registry";
import { formatReadingTime } from "@/lib/utils";
import type { RegisteredLesson } from "@/types/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedLessons().map((lesson) => ({
    technology: lesson.technologySlug,
    module: lesson.moduleSlug,
    lesson: lesson.slug,
  }));
}

function publishedLessons(): RegisteredLesson[] {
  return lessons.filter((lesson) => lesson.status !== "draft");
}

type LessonPageParams = Promise<{ technology: string; module: string; lesson: string }>;

export async function generateMetadata({
  params,
}: {
  params: LessonPageParams;
}): Promise<Metadata> {
  const { lesson } = await params;
  const entry = getLessonBySlug(lesson);
  const tech = entry ? getTechnology(entry.technologySlug) : undefined;
  return {
    title: entry ? `${entry.title} · ${tech?.name ?? entry.technologySlug}` : "Lesson",
    description: entry?.description,
  };
}

export default async function LessonPage({ params }: { params: LessonPageParams }) {
  const { technology, module: moduleSlug, lesson: lessonSlug } = await params;
  const lesson = getLessonBySlug(lessonSlug);

  if (!lesson || lesson.status === "draft") notFound();
  if (lesson.technologySlug !== technology || lesson.moduleSlug !== moduleSlug) notFound();

  const tech = getTechnology(technology);
  const allLessons = publishedLessons();
  const index = allLessons.findIndex((entry) => entry.slug === lesson.slug);
  const prevLesson = index > 0 ? allLessons[index - 1] : undefined;
  const nextLesson =
    index >= 0 && index < allLessons.length - 1 ? allLessons[index + 1] : undefined;

  const moduleList = getModulesByTechnology(technology);
  const challenge = lesson.challenge;

  return (
    <div className="container-site py-12">
      {/* Breadcrumb */}
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
          <li>
            <Link href={`/learn/${technology}/${moduleSlug}`} className="hover:text-foreground">
              {getModulesByTechnology(technology).find((m) => m.slug === moduleSlug)?.title ??
                moduleSlug}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            {lesson.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {lesson.difficulty}
          </Badge>
          <Badge variant="outline">
            <Clock /> {formatReadingTime(lesson.readingTime)}
          </Badge>
          <Badge variant="warning">
            <Star /> {lesson.xp} XP
          </Badge>
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          {lesson.title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">{lesson.description}</p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Course contents */}
        <aside className="hidden lg:block">
          <nav aria-label="Course contents" className="sticky top-24 space-y-6">
            {moduleList.map((mod) => {
              const modLessons = getLessonsByModule(technology, mod.slug).filter(
                (entry) => entry.status !== "draft",
              );
              return (
                <div key={mod.slug}>
                  <Link
                    href={`/learn/${technology}/${mod.slug}`}
                    className="text-foreground hover:text-primary text-sm font-semibold"
                  >
                    {mod.title}
                  </Link>
                  <ul className="border-border mt-2 space-y-1 border-l pl-3">
                    {modLessons.map((entry) => (
                      <li key={entry.slug}>
                        <Link
                          href={`/learn/${technology}/${mod.slug}/${entry.slug}`}
                          aria-current={entry.slug === lesson.slug ? "page" : undefined}
                          className={
                            entry.slug === lesson.slug
                              ? "text-primary block text-sm font-medium"
                              : "text-muted-foreground hover:text-foreground block text-sm"
                          }
                        >
                          {entry.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0">
          <article className="mx-auto max-w-3xl">
            <MdxContent path={lesson.mdxPath} />
          </article>

          {challenge && (
            <Card className="mt-12">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="text-primary size-5" />
                  <CardTitle>Lab Challenge</CardTitle>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {challenge.objectives.map((objective) => (
                    <li key={objective} className="text-muted-foreground flex gap-2 text-sm">
                      <span className="text-primary">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <ChallengeRunner challenge={challenge} labId={lesson.slug} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prev / next */}
          <nav
            aria-label="Lesson navigation"
            className="border-border mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2"
          >
            {prevLesson ? (
              <Link
                href={`/learn/${prevLesson.technologySlug}/${prevLesson.moduleSlug}/${prevLesson.slug}`}
                className="group hover:border-primary/50 border-border flex flex-col gap-1 rounded-lg border p-4 transition-colors"
              >
                <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase">
                  <ChevronLeft className="size-3.5" /> Previous
                </span>
                <span className="group-hover:text-primary font-medium">{prevLesson.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.technologySlug}/${nextLesson.moduleSlug}/${nextLesson.slug}`}
                className="group hover:border-primary/50 border-border flex flex-col gap-1 rounded-lg border p-4 transition-colors sm:text-right"
              >
                <span className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wider uppercase sm:justify-end">
                  Next <ChevronRight className="size-3.5" />
                </span>
                <span className="group-hover:text-primary font-medium">{nextLesson.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
