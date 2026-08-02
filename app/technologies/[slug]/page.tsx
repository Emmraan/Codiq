import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Clock, FlaskConical, Star } from "lucide-react";

import { MdxContent } from "@/components/composite/mdx-content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TechIcon } from "@/components/composite/tech-icon";
import {
  getLessonsByModule,
  getModulesByTechnology,
  getTechnology,
  technologies,
} from "@/lib/generated/content-registry";
import type { TechnologyDocName } from "@/types/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((tech) => ({ slug: tech.slug }));
}

type TechnologyPageParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: TechnologyPageParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const tech = getTechnology(slug);
  return {
    title: tech ? `${tech.name} — Lessons, modules & playground` : "Technology",
    description: tech?.description,
  };
}

const DOC_ORDER: TechnologyDocName[] = [
  "intro",
  "installation",
  "structure",
  "best-practices",
  "summary",
];

const DOC_LABELS: Record<TechnologyDocName, string> = {
  intro: "Introduction",
  installation: "Installation",
  structure: "Project structure",
  "best-practices": "Best practices",
  summary: "Summary",
};

export default async function TechnologyDetailPage({ params }: { params: TechnologyPageParams }) {
  const { slug } = await params;
  const tech = getTechnology(slug);

  if (!tech) notFound();

  const modules = getModulesByTechnology(slug);
  const docs = DOC_ORDER.filter((name) => tech.docs[name]);

  return (
    <div className="container-site py-12">
      <header>
        <Badge variant="secondary" className="capitalize">
          {tech.category}
        </Badge>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div
            className="flex size-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${tech.color}22`, color: tech.color }}
          >
            <TechIcon name={tech.icon} className="size-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{tech.name}</h1>
        </div>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{tech.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {tech.difficulty}
          </Badge>
          <Badge variant="outline">
            <BookOpen /> {tech.lessonCount} lessons
          </Badge>
          {tech.estimatedHours !== undefined && (
            <Badge variant="outline">
              <Clock /> ~{tech.estimatedHours}h
            </Badge>
          )}
          <Badge variant="warning">
            <Star /> {tech.lessonCount * 40} XP total
          </Badge>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/technologies/${tech.slug}/playground`}>
              <FlaskConical /> Open Playground
            </Link>
          </Button>
          {modules[0] && (
            <Button variant="outline" asChild>
              <Link href={`/learn/${tech.slug}/${modules[0].slug}`}>
                Start learning <ArrowRight />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Guide docs */}
      {docs.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">Guides</h2>
          <div className="space-y-10">
            {docs.map((name) => (
              <article key={name} className="max-w-3xl">
                <h3 className="text-muted-foreground mb-2 text-sm font-semibold tracking-widest uppercase">
                  {DOC_LABELS[name]}
                </h3>
                <MdxContent path={tech.docs[name] as string} />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Modules */}
      <section className="mt-14">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Modules <span className="text-muted-foreground">({modules.length})</span>
        </h2>
        <div className="space-y-4">
          {modules.map((mod, index) => {
            const modLessons = getLessonsByModule(slug, mod.slug).filter(
              (lesson) => lesson.status !== "draft",
            );
            return (
              <Card key={mod.slug}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-mono text-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <CardTitle className="text-lg">{mod.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-1">{mod.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {modLessons.length} lesson{modLessons.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-1">
                    {modLessons.map((lesson) => (
                      <li key={lesson.slug}>
                        <Link
                          href={`/learn/${slug}/${mod.slug}/${lesson.slug}`}
                          className="text-muted-foreground hover:text-primary flex items-center gap-2 text-sm"
                        >
                          <span className="text-primary">•</span>
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
