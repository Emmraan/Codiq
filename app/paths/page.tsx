import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/composite/page-header";
import { TechIcon } from "@/components/composite/tech-icon";
import { learningPaths } from "@/config/learning-paths";

export const metadata = {
  title: "Learning Paths",
  description: "Guided curriculum sequences for frontend, backend, and full stack development.",
};

export default function PathsPage() {
  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Curricula"
        title="Learning Paths"
        description="Follow a recommended sequence of technologies. Each path takes you from fundamentals to confidently reading official documentation."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {learningPaths.map((path) => {
          return (
            <Link key={path.slug} href={`/paths/${path.slug}`} className="group">
              <Card className="hover:border-primary/50 h-full transition-colors">
                <CardHeader>
                  <div
                    className="mb-2 flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${path.color}22`, color: path.color }}
                  >
                    <TechIcon name={path.icon} className="size-5" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {path.title}
                  </CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {path.technologies.length} technologies · {path.estimatedHours}h
                  </span>
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
