import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/composite/page-header";
import { TechIcon } from "@/components/composite/tech-icon";
import { technologies } from "@/lib/generated/content-registry";

export const metadata = {
  title: "Technologies",
  description: "Browse every technology available on CODIQ — lessons, playgrounds, and challenges.",
};

export default function TechnologiesPage() {
  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Library"
        title="Technologies"
        description="Each technology includes a guided introduction, structured modules, a live playground, and validated challenges. The library is designed to grow without limits."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {technologies.map((tech) => {
          return (
            <Link key={tech.slug} href={`/technologies/${tech.slug}`} className="group">
              <Card className="hover:border-primary/50 h-full transition-colors">
                <CardHeader>
                  <div
                    className="mb-2 flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${tech.color}22`, color: tech.color }}
                  >
                    <TechIcon name={tech.icon} className="size-5" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {tech.name}
                  </CardTitle>
                  <CardDescription>{tech.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="size-3.5" />
                    {tech.lessonCount} lesson{tech.lessonCount === 1 ? "" : "s"}
                  </span>
                  <span className="text-muted-foreground capitalize">{tech.category}</span>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
