import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CircleCheckBig,
  FlaskConical,
  Target,
  Terminal,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/composite/empty-state";
import { TechIcon } from "@/components/composite/tech-icon";
import { learningPaths } from "@/config/learning-paths";
import { technologySeeds } from "@/config/technologies";

const philosophySteps = [
  "Read",
  "Understand",
  "See Example",
  "Experiment",
  "Solve Challenge",
  "Pass Validation",
  "Complete Module",
];

const reasons = [
  {
    icon: BookOpen,
    title: "Learn by reading",
    description: "Concise, focused lessons that teach the why, not just the what.",
  },
  {
    icon: Terminal,
    title: "Learn by doing",
    description: "A real playground in every lesson. Tinker until it clicks.",
  },
  {
    icon: FlaskConical,
    title: "Prove it with labs",
    description: "Challenges with a validation engine that grades your code instantly.",
  },
  {
    icon: Trophy,
    title: "Track your growth",
    description: "XP, levels, streaks and badges keep momentum visible.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_55%)]"
        />
        <div className="container-site relative flex flex-col items-center gap-6 py-24 text-center sm:py-32">
          <Badge variant="secondary" className="gap-1.5">
            <SparkleIcon />
            The Full Stack Developer Laboratory
          </Badge>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-balance sm:text-6xl">
            Read. Understand.
            <br />
            <span className="text-primary">Experiment. Build.</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg text-pretty">
            CODIQ is an interactive developer laboratory. Learn a technology by reading, seeing
            examples, experimenting in a live playground, and passing real validation — until you
            can read the official docs on your own.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/paths">
                Start Learning
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/technologies">Browse Technologies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Philosophy pipeline */}
      <section className="bg-muted/30 border-y">
        <div className="container-site flex flex-col items-center gap-6 py-12">
          <p className="text-muted-foreground text-sm font-medium tracking-widest uppercase">
            How you progress
          </p>
          <ol className="flex flex-wrap items-center justify-center gap-2">
            {philosophySteps.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                <span className="bg-card rounded-lg border px-3 py-1.5 text-sm font-medium">
                  {step}
                </span>
                {index < philosophySteps.length - 1 && (
                  <ArrowRight className="text-muted-foreground size-4" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Learning paths */}
      <section className="container-site py-20">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Learning Paths</h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Guided curricula that take you from zero to independently reading official
              documentation.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/paths">
              All paths <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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
                  <CardContent className="text-muted-foreground text-sm">
                    {path.technologies.length} technologies · {path.estimatedHours}h estimated
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular technologies */}
      <section className="bg-muted/30 border-y">
        <div className="container-site py-20">
          <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Popular Technologies</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Every technology ships with lessons, a playground, and validated challenges.
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/technologies">
                All technologies <ArrowRight />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technologySeeds.slice(0, 8).map((tech) => {
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
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Continue learning */}
      <section className="container-site py-20">
        <h2 className="mb-6 text-3xl font-bold tracking-tight">Continue Learning</h2>
        <EmptyState
          icon={Target}
          title="Your journey starts here"
          description="Complete your first lesson to start tracking progress, earning XP, and building streaks. Progress is stored locally in your browser."
          action={
            <Button asChild>
              <Link href="/technologies">
                Start your first lesson <ArrowRight />
              </Link>
            </Button>
          }
        />
      </section>

      {/* Why CODIQ */}
      <section className="bg-muted/30 border-y">
        <div className="container-site py-20">
          <h2 className="text-3xl font-bold tracking-tight">Why CODIQ</h2>
          <p className="text-muted-foreground mt-2 mb-10 max-w-xl">
            Built like a product you would pay for, priced at free, and designed to make you
            independent.
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <Card key={reason.title}>
                <CardHeader>
                  <reason.icon className="text-primary size-5" />
                  <CardTitle className="text-base">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-20">
        <div className="glow-primary from-primary/15 to-chart-2/10 flex flex-col items-center gap-4 rounded-2xl border bg-gradient-to-br px-6 py-16 text-center">
          <CircleCheckBig className="text-primary size-10" />
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-balance">
            Become the developer who reads docs — not tutorials.
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Start the Frontend Developer path and write your first line of validated code today.
          </p>
          <Button size="lg" asChild>
            <Link href="/paths/frontend-developer">
              Begin the Frontend Path <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function SparkleIcon() {
  return (
    <span aria-hidden className="text-primary">
      ◆
    </span>
  );
}
