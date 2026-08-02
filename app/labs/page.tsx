import { FlaskConical } from "lucide-react";

import { PageHeader } from "@/components/composite/page-header";
import { EmptyState } from "@/components/composite/empty-state";

export const metadata = {
  title: "Labs",
  description: "Hands-on challenges with instant validation across every technology.",
};

export default function LabsPage() {
  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Challenges"
        title="Labs"
        description="Solve hands-on challenges and get validated instantly. Every lab earns XP toward your level."
      />
      <div className="mt-12">
        <EmptyState
          icon={FlaskConical}
          title="No labs published yet"
          description="Lab challenges ship with each lesson in Phase 4 — the validation engine is being built right now."
        />
      </div>
    </div>
  );
}
