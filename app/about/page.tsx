import Link from "next/link";
import { ArrowRight, GitFork, Heart, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/composite/page-header";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "About",
  description: "Why CODIQ exists and how it works.",
};

const philosophy = [
  {
    icon: Heart,
    title: "Built for independence",
    description:
      "The end goal is simple: after finishing a technology, you should be able to read the official documentation on your own. No tutorial dependency.",
  },
  {
    icon: Sparkles,
    title: "Progress that respects you",
    description:
      "No accounts, no tracking, no cloud. All progress is stored locally in your browser and belongs to you.",
  },
  {
    icon: GitFork,
    title: "Open source by default",
    description:
      "The entire platform is open source. Content is content — anyone can add a lesson, a technology, or a new validator.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-site py-16">
      <PageHeader
        eyebrow="About"
        title="A laboratory, not a tutorial site"
        description="CODIQ is an interactive Full Stack Developer Laboratory. You learn by reading, understanding, seeing examples, experimenting, and solving validated challenges — in your browser, at your own pace."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {philosophy.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="text-primary size-5" />
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">The learning loop</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Every module follows the same proven loop:{" "}
          <strong className="text-foreground">read</strong> the concept,{" "}
          <strong className="text-foreground">understand</strong> the reasoning, see a live{" "}
          <strong className="text-foreground">example</strong>,{" "}
          <strong className="text-foreground">experiment</strong> in a playground,{" "}
          <strong className="text-foreground">solve</strong> a challenge, pass{" "}
          <strong className="text-foreground">validation</strong>, and move to the next module.
        </p>

        <div className="mt-8">
          <Button asChild>
            <Link href="/paths">
              Start learning <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 border-t pt-8 text-center">
        <p className="text-muted-foreground text-sm">
          CODIQ is free, open source, and MIT licensed. Contribute on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
