import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FlaskConical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/composite/empty-state";
import { TechIcon } from "@/components/composite/tech-icon";
import { technologySeeds } from "@/config/technologies";

export const metadata = {
  title: "Technology",
};

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = technologySeeds.find((t) => t.slug === slug);

  if (!tech) notFound();

  return (
    <div className="container-site py-16">
      <Badge variant="secondary" className="capitalize">
        {tech.category}
      </Badge>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex size-11 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${tech.color}22`, color: tech.color }}
        >
          <TechIcon name={tech.icon} className="size-5" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{tech.name}</h1>
      </div>
      <p className="text-muted-foreground mt-4 max-w-2xl text-lg">{tech.description}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={`/technologies/${tech.slug}/playground`}>
            <FlaskConical /> Open Playground
          </Link>
        </Button>
      </div>

      <div className="mt-16">
        <EmptyState
          icon={FlaskConical}
          title={`${tech.name} content is on the way`}
          description={`Lessons, examples, playground and challenges for ${tech.name} arrive with the Phase 2 content pipeline.`}
          action={
            <Button asChild>
              <Link href="/technologies">
                Browse all technologies <ArrowRight />
              </Link>
            </Button>
          }
        />
      </div>
    </div>
  );
}
