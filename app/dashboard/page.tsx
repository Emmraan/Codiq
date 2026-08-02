import { LayoutDashboard } from "lucide-react";

import { PageHeader } from "@/components/composite/page-header";
import { EmptyState } from "@/components/composite/empty-state";

export const metadata = {
  title: "Dashboard",
  description: "Track your progress, XP, streaks and achievements.",
};

export default function DashboardPage() {
  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Your progress"
        title="Dashboard"
        description="Overall progress, technology completion, XP, badges and streaks. Progress is stored locally in your browser — no account needed."
      />
      <div className="mt-12">
        <EmptyState
          icon={LayoutDashboard}
          title="No progress yet"
          description="Complete your first lesson and your dashboard will light up with progress rings, XP and streaks."
        />
      </div>
    </div>
  );
}
