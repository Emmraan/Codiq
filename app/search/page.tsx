import { Search as SearchIcon } from "lucide-react";

import { PageHeader } from "@/components/composite/page-header";
import { EmptyState } from "@/components/composite/empty-state";

export const metadata = {
  title: "Search",
  description: "Instant search across lessons, concepts, technologies and challenges.",
};

export default function SearchPage() {
  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="Find anything"
        title="Search"
        description="Instant full-text search across lessons, concepts, technologies, challenges and interview questions."
      />
      <div className="mt-12">
        <EmptyState
          icon={SearchIcon}
          title="Search index is being built"
          description="The search index is generated at build time and ships in Phase 6. Try ⌘K for quick navigation in the meantime."
        />
      </div>
    </div>
  );
}
