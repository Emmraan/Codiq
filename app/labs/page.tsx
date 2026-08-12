import Link from "next/link";
import { Brain, Star, Target } from "lucide-react";

import { PageHeader } from "@/components/composite/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/composite/empty-state";
import { lessons } from "@/lib/generated/content-registry";

export const metadata = {
  title: "Labs",
  description: "Hands-on challenges with instant validation across every technology.",
};

export default function LabsPage() {
  const labs = lessons
    .filter((lesson) => lesson.status !== "draft" && lesson.challenge)
    .sort((a, b) => {
      const techA = a.technologySlug;
      const techB = b.technologySlug;
      return techA.localeCompare(techB) || a.order - b.order;
    });

  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Challenges"
        title="Labs"
        description="Solve hands-on challenges and get validated instantly. Every lab earns XP toward your level."
      />
      <div className="mt-12">
        {labs.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No labs published yet"
            description="Lab challenges ship with each lesson. Add a lesson with a challenge.json and validator.ts to publish one here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lesson) => {
              const challenge = lesson.challenge;
              if (!challenge) return null;
              return (
                <Link
                  key={lesson.slug}
                  href={`/learn/${lesson.technologySlug}/${lesson.moduleSlug}/${lesson.slug}`}
                  className="group"
                >
                  <Card className="hover:border-primary/50 h-full transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="group-hover:text-primary text-base">
                          {challenge.title}
                        </CardTitle>
                        <Badge variant="warning" className="shrink-0">
                          <Star /> {challenge.xp}
                        </Badge>
                      </div>
                      <CardDescription>{challenge.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {lesson.technologySlug}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        <Brain /> {challenge.validator.type}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
