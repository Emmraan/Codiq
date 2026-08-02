import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/composite/empty-state";
import { TechIcon } from "@/components/composite/tech-icon";
import { learningPaths } from "@/config/learning-paths";
import { getModulesByTechnology, getTechnology, lessons } from "@/lib/generated/content-registry";

export const metadata = {
  title: "Learning Path",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return learningPaths.map((path) => ({ slug: path.slug }));
}

export default async function PathDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = learningPaths.find((p) => p.slug === slug);

  if (!path) notFound();

  const technologies = path.technologies
    .map((techSlug) => getTechnology(techSlug))
    .filter((tech) => tech !== undefined);

  const publishedLessons = lessons.filter((lesson) => lesson.status !== "draft");
  const pathLessonCount = publishedLessons.filter((lesson) =>
    path.technologies.includes(lesson.technologySlug),
  ).length;

  const firstTechnology = technologies[0];
  const firstModule = firstTechnology ? getModulesByTechnology(firstTechnology.slug)[0] : undefined;

  return (
    <div className="container-site py-16">
      <Badge variant="secondary">{path.difficulty}</Badge>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex size-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${path.color}22`, color: path.color }}
        >
          <TechIcon name={path.icon} className="size-5" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{path.title}</h1>
      </div>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{path.description}</p>

      <h2 className="mt-12 mb-4 text-xl font-semibold">Technologies in order</h2>
      <ol className="space-y-3">
        {technologies.map((tech, index) => {
          return (
            <li key={tech.slug}>
              <Link href={`/technologies/${tech.slug}`} className="group block">
                <Card className="hover:border-primary/50 transition-colors">
                  <CardHeader className="flex-row items-center gap-4">
                    <span className="text-muted-foreground font-mono text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${tech.color}22`, color: tech.color }}
                    >
                      <TechIcon name={tech.icon} className="size-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary text-base transition-colors">
                        {tech.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">{tech.description}</p>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                  </CardHeader>
                </Card>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-12">
        <EmptyState
          icon={BookOpen}
          title="Path progress arrives next"
          description={`${pathLessonCount} lessons across ${technologies.length} technologies are live on this path. Automatic progress tracking, XP and completion rings land in a later phase.`}
          action={
            firstModule && firstTechnology ? (
              <Button asChild>
                <Link href={`/learn/${firstTechnology.slug}/${firstModule.slug}`}>
                  Start the path <ArrowRight />
                </Link>
              </Button>
            ) : undefined
          }
        />
      </div>
    </div>
  );
}
