import { notFound } from "next/navigation";

import { PageHeader } from "@/components/composite/page-header";
import { Playground } from "@/components/feature/playground/playground";
import { playgroundPresets } from "@/config/playgrounds";
import { getTechnology, technologies } from "@/lib/generated/content-registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((tech) => ({ slug: tech.slug }));
}

interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PlaygroundPageProps) {
  const { slug } = await params;
  const tech = getTechnology(slug);
  if (!tech) return {};
  return {
    title: `${tech.name} playground`,
    description: `Experiment with ${tech.name} in the interactive CODIQ playground.`,
  };
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { slug } = await params;
  const tech = getTechnology(slug);

  if (!tech) notFound();

  const preset = playgroundPresets[tech.slug];

  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Playground"
        title={`${tech.name} playground`}
        description="A hands-on workspace for experimenting with code in the browser."
      />
      {preset ? (
        <Playground preset={preset} title={`${tech.name} playground`} />
      ) : (
        <p className="text-muted-foreground mt-6 text-sm">
          No playground preset is configured for this technology yet.
        </p>
      )}
    </div>
  );
}
