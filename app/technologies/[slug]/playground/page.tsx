import { notFound } from "next/navigation";
import { FlaskConical } from "lucide-react";

import { EmptyState } from "@/components/composite/empty-state";
import { getTechnology, technologies } from "@/lib/generated/content-registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((tech) => ({ slug: tech.slug }));
}

export const metadata = {
  title: "Playground",
  description: "Interactive playground for hands-on experimentation.",
};

export default async function PlaygroundPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tech = getTechnology(slug);

  if (!tech) notFound();

  return (
    <div className="container-site py-16">
      <EmptyState
        icon={FlaskConical}
        title={`${tech.name} playground`}
        description="The Monaco-powered editor and live previews arrive in Phase 3. This workspace will let you experiment with code the moment it lands."
      />
    </div>
  );
}
