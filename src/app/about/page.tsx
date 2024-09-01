// src/app/about/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Persona = {
  title: string;
  description: string;
  bullets: string[];
};

const personas: Persona[] = [
  {
    title: "Students & Learners",
    description:
      "Use the playground to experiment with algorithms, debug small snippets, and build intuition for how code executes step by step.",
    bullets: [
      "Visualize how arrays change across sorting or search operations.",
      "Track stdout and stderr in one place, side by side.",
      "Save code experiments locally without needing an account.",
    ],
  },
  {
    title: "Educators & Instructors",
    description:
      "Embed the tool into your existing LMS, or run it standalone during live lectures and workshops.",
    bullets: [
      "Demonstrate algorithms interactively without switching between tools.",
      "Share preconfigured playgrounds with starter code and inputs.",
      "Collect screenshots or screen recordings instead of building custom tooling.",
    ],
  },
  {
    title: "Engineering Teams",
    description:
      "Use the project internally as a sandbox for onboarding, technical training, or experimentation.",
    bullets: [
      "Host a private code playground behind your own authentication and VPN.",
      "Capture team-specific examples and algorithm variants in the library.",
      "Extend the execution engine or benchmarks to match your stack.",
    ],
  },
];

const productPillars = [
  {
    title: "Interactive Playground",
    body:
      "A responsive, language-aware editor with execution controls, trace inspection, visualizers, performance benchmarks, and run history.",
  },
  {
    title: "Curated Algorithm Library",
    body:
      "A metadata-rich catalog of algorithms with categories, difficulty, complexity, code templates, and recommended inputs.",
  },
  {
    title: "Visualization-Ready Traces",
    body:
      "Traces are modeled as structured data (TraceStep) so they can drive multiple visualizers: arrays today, graphs and trees tomorrow.",
  },
  {
    title: "Local-First by Default",
    body:
      "Run history, saved playgrounds, and settings are stored in the browser, making the app easy to deploy without a database.",
  },
];

const values = [
  {
    title: "Clarity over Magic",
    body:
      "The app is designed to show exactly what is happening, rather than hiding behavior behind opaque animations or black-box code execution.",
  },
  {
    title: "Extendable by Design",
    body:
      "From the algorithm catalog to the trace model and execution engine, the codebase is structured so that new features and languages can be added incrementally.",
  },
  {
    title: "Safety & Isolation",
    body:
      "The JavaScript runner uses a restricted sandbox with a timeout. When deployed in sensitive environments, it can be moved into a dedicated, isolated service.",
  },
  {
    title: "Single-Engineer Friendly",
    body:
      "The project intentionally avoids unnecessary complexity, so a single engineer can understand, maintain, and extend it over time.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            About
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            About Code Playground &amp; Algorithm Visualizer
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            This project is a self-contained, production-ready code playground
            focused on algorithm exploration. It combines a multi-language
            editor with execution, tracing, and visualization features that are
            easy to embed into other products or teaching environments.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="secondary">
              Browse Algorithm Library
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="sm" variant="ghost">
              Developer Docs
            </Button>
          </Link>
          <Link href="/status">
            <Button size="sm" variant="ghost">
              System Status
            </Button>
          </Link>
        </div>
      </section>

      {/* Product pillars */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Product Pillars
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {productPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="space-y-1 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <p className="text-[11px] font-semibold text-slate-100">
                  {pillar.title}
                </p>
                <p className="text-[11px] text-slate-400">{pillar.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Who it's for */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Who This Project Is For
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {personas.map((persona) => (
              <div
                key={persona.title}
                className="space-y-2 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <p className="text-[11px] font-semibold text-slate-100">
                  {persona.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {persona.description}
                </p>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {persona.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Design values */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Design Principles &amp; Values
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="space-y-1 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <p className="text-[11px] font-semibold text-slate-100">
                  {value.title}
                </p>
                <p className="text-[11px] text-slate-400">{value.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Integration ideas */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Example Integration Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[11px] text-slate-300">
            <p>
              The codebase is intentionally framework-aligned with modern
              Next.js conventions so that it can be dropped into a variety of
              contexts:
            </p>
            <ul className="space-y-1">
              <li>
                • As a dedicated{" "}
                <span className="font-mono text-emerald-300">
                  /tools/playground
                </span>{" "}
                section in a documentation portal.
              </li>
              <li>
                • As a standalone practice environment for coding bootcamps and
                university courses.
              </li>
              <li>
                • As an internal-only sandbox attached to developer onboarding
                and training programs.
              </li>
              <li>
                • As a demo feature inside a larger AI / coding-assistant
                platform to visualize algorithm explanations.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              Because there is no hard dependency on external SaaS services, you
              remain in full control of where and how the project is hosted.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Explore the Codebase
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              Ready to dive deeper? Visit the Developer Docs and Architecture
              pages for a detailed explanation of the file structure,
              execution engine, and extension points, or jump straight into the
              playground to explore algorithms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/docs">
              <Button size="sm" variant="secondary">
                Developer Docs
              </Button>
            </Link>
            <Link href="/architecture">
              <Button size="sm" variant="ghost">
                Architecture
              </Button>
            </Link>
            <Link href="/playground">
              <Button size="sm" variant="primary">
                Start Coding
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
