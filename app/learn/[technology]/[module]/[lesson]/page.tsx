import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/composite/empty-state";

export const metadata = {
  title: "Lesson",
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ technology: string; module: string; lesson: string }>;
}) {
  const { technology, module: moduleSlug, lesson } = await params;

  return (
    <div className="container-site py-16">
      <EmptyState
        icon={BookOpen}
        title={`${technology} / ${moduleSlug} / ${lesson}`}
        description="This route hosts the full lesson experience — MDX content, embedded playground, and the validated challenge. It goes live with the Phase 2 content engine."
      />
    </div>
  );
}
