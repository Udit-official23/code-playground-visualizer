// src/app/docs/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Section = {
  id: string;
  title: string;
  description: string;
};

const sections: Section[] = [
  {
    id: "overview",
    title: "High-Level Overview",
    description:
      "How the app is structured across pages, components, hooks, and backend API routes.",
  },
  {
    id: "execution-engine",
    title: "Execution Engine",
    description:
      "How JavaScript code is executed safely using Node's vm module and how traces are produced.",
  },
  {
    id: "playground-flow",
    title: "Playground Flow",
    description:
      "What happens from the moment the user hits “Run Code” until results appear in the UI.",
  },
  {
    id: "algorithm-catalog",
    title: "Algorithm Catalog",
    description:
      "How algorithms, metadata, and code templates are modeled and wired into the UI.",
  },
  {
    id: "visualizers",
    title: "Visualizers & Traces",
    description:
      "How trace steps map to visual components like the array bar chart visualizer.",
  },
  {
    id: "local-persistence",
    title: "Local Persistence",
    description:
      "Where and how run history, saved playgrounds, and settings are stored on the client.",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Documentation
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Developer Documentation &amp; Architecture
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            This page describes how the Code Playground &amp; Algorithm
            Visualizer is put together. It is intended for engineers who want to
            understand or extend the codebase, and for buyers who want to
            quickly evaluate how the project is organized.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Jump to Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="secondary">
              Browse Algorithm Library
            </Button>
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
          >
            <Button size="sm" variant="ghost">
              Next.js Docs
            </Button>
          </a>
        </div>
      </section>

      {/* Quick navigation */}
      <section>
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Sections
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-[12px] text-slate-200 md:grid-cols-3">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="group rounded border border-slate-800 bg-slate-950 p-3 transition-colors hover:border-emerald-500/60 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 group-hover:text-emerald-300">
                    {sec.title}
                  </span>
                  <span className="text-[10px] text-slate-600 group-hover:text-emerald-400">
                    ↗
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {sec.description}
                </p>
              </a>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 1. Overview */}
      <section id="overview" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              1. High-Level Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[12px] text-slate-200">
            <p className="text-slate-300">
              The project is built as a Next.js 14 App Router application using
              TypeScript. It is divided into:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • <span className="font-mono text-emerald-300">app/</span> —
                Route segments for pages like{" "}
                <span className="font-mono">/playground</span>,{" "}
                <span className="font-mono">/library</span>,{" "}
                <span className="font-mono">/algorithms/[id]</span>,{" "}
                <span className="font-mono">/about</span>, and{" "}
                <span className="font-mono">/docs</span>.
              </li>
              <li>
                • <span className="font-mono text-emerald-300">components/</span>{" "}
                — Reusable UI primitives (buttons, cards, tabs) and visualizers.
              </li>
              <li>
                • <span className="font-mono text-emerald-300">lib/</span> —
                Shared logic: algorithm metadata, execution engine, and shared
                types.
              </li>
              <li>
                • <span className="font-mono text-emerald-300">hooks/</span> —
                Custom hooks for local persistence (playgrounds, history,
                settings).
              </li>
              <li>
                • <span className="font-mono text-emerald-300">app/api/</span> —
                Serverless API routes for code execution and benchmarking.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              This separation keeps UI concerns, data modeling, and execution
              logic clearly separated while remaining small enough for a single
              engineer to maintain.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 2. Execution Engine */}
      <section id="execution-engine" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              2. Execution Engine (JavaScript)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[12px] text-slate-200">
            <p className="text-slate-300">
              JavaScript code is executed on the server using Node&apos;s{" "}
              <span className="font-mono text-emerald-300">vm</span> module
              inside the{" "}
              <span className="font-mono text-emerald-300">
                runJavascript
              </span>{" "}
              helper. The engine:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • Creates a restricted sandbox that exposes only a scoped{" "}
                <span className="font-mono">console</span> object.
              </li>
              <li>
                • Captures <span className="font-mono">console.log</span>,
                <span className="font-mono">console.error</span>, and{" "}
                <span className="font-mono">console.warn</span> output into
                arrays.
              </li>
              <li>
                • Wraps user code in a{" "}
                <span className="font-mono">vm.Script</span> and executes it
                with a timeout to avoid long-running scripts.
              </li>
              <li>
                • Returns a typed{" "}
                <span className="font-mono">ExecutionResult</span> with{" "}
                <span className="font-mono">stdout</span>,{" "}
                <span className="font-mono">stderr</span>,{" "}
                <span className="font-mono">durationMs</span>, and an optional
                trace.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              For selected algorithms (such as Bubble Sort, Binary Search, and
              BFS), synthetic traces are generated independently of user code.
              This ensures visualizations remain deterministic and safe even if
              the user submits invalid code.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Playground Flow */}
      <section id="playground-flow" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              3. Playground Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[12px] text-slate-200">
            <p className="text-slate-300">
              The playground page orchestrates language selection, editor state,
              API calls, and result rendering. A typical run looks like this:
            </p>
            <ol className="ml-4 list-decimal space-y-1 text-[11px] text-slate-300">
              <li>
                The user selects a language tab (e.g. JavaScript) and optionally
                loads code from the library or a saved playground.
              </li>
              <li>
                When the user clicks{" "}
                <span className="font-mono">Run Code</span>, the component
                sends the current code, language, and optional algorithm id to{" "}
                <span className="font-mono">/api/execute</span>.
              </li>
              <li>
                The API route uses the appropriate runner (currently
                JavaScript-specific) to execute code and build an{" "}
                <span className="font-mono">ExecutionResult</span>.
              </li>
              <li>
                The playground updates its local state with the result and
                appends an entry to the run history.
              </li>
              <li>
                The right-hand panel updates its tabs (stdout, trace,
                visualizer, performance, history) to reflect the new run.
              </li>
            </ol>
            <p className="text-[11px] text-slate-400">
              This flow is intentionally kept simple so that more languages or
              remote execution backends can be added later without rewriting the
              UI.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 4. Algorithm Catalog */}
      <section id="algorithm-catalog" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              4. Algorithm Catalog &amp; Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[12px] text-slate-200">
            <p className="text-slate-300">
              Algorithms are defined in{" "}
              <span className="font-mono text-emerald-300">
                lib/algorithms.ts
              </span>{" "}
              using a typed <span className="font-mono">AlgorithmMeta</span>{" "}
              model. Each entry includes:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • Identity: <span className="font-mono">id</span>,{" "}
                <span className="font-mono">title</span>,{" "}
                <span className="font-mono">category</span>,{" "}
                <span className="font-mono">difficulty</span>.
              </li>
              <li>
                • Complexity:{" "}
                <span className="font-mono">timeComplexity</span>,{" "}
                <span className="font-mono">spaceComplexity</span>, and a
                structured{" "}
                <span className="font-mono">complexity</span> object for the
                detail page.
              </li>
              <li>
                • Language availability:{" "}
                <span className="font-mono">languages: Language[]</span>.
              </li>
              <li>
                • Content:{" "}
                <span className="font-mono">shortDescription</span>, optional{" "}
                <span className="font-mono">description</span>,{" "}
                <span className="font-mono">tags</span>, and{" "}
                <span className="font-mono">recommendedInput</span>.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The Library page filters this catalog by category, difficulty,
              language, and text search. The Algorithm Details page uses the
              same metadata to render a richer explanation and link into the
              playground.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 5. Visualizers */}
      <section id="visualizers" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              5. Visualizers &amp; Trace Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[12px] text-slate-200">
            <p className="text-slate-300">
              Visualizations are driven by a generic{" "}
              <span className="font-mono text-emerald-300">TraceStep</span>{" "}
              type defined in shared types. A trace consists of ordered steps
              with fields like:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>• <span className="font-mono">step</span> — step index.</li>
              <li>• <span className="font-mono">description</span> — human-readable explanation.</li>
              <li>• <span className="font-mono">currentLine</span> — approximate source line.</li>
              <li>• <span className="font-mono">arraySnapshot</span> — snapshot of an array/queue state.</li>
              <li>• <span className="font-mono">highlightedIndices</span> — indices to highlight.</li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The current implementation includes an{" "}
              <span className="font-mono">ArrayVisualizer</span> that draws bars
              based on <span className="font-mono">arraySnapshot</span> and
              highlights active indices. Additional visualizers (graph, tree,
              matrix) can be added without changing the underlying trace model.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 6. Local Persistence */}
      <section id="local-persistence" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              6. Local Persistence &amp; Client Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[12px] text-slate-200">
            <p className="text-slate-300">
              The project does not require a database. Instead, it uses
              client-side storage to persist user-specific data:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • <span className="font-mono">useLocalPlaygrounds</span> — saves
                named playgrounds (title, language, code, algorithm id) in{" "}
                <span className="font-mono">localStorage</span>.
              </li>
              <li>
                • <span className="font-mono">useRunHistory</span> — tracks past
                executions with code snapshots and durations.
              </li>
              <li>
                • <span className="font-mono">usePlaygroundSettings</span> —
                persists editor preferences like font size, theme, minimap, and
                word wrap.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              This approach keeps the project lightweight and easy to deploy,
              while still supporting useful quality-of-life features. If a
              future version adds user accounts, these hooks can be adapted to
              synchronize with a backend API.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer / CTA */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              For Contributors &amp; Buyers
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              With this overview, new developers can quickly get oriented and
              begin extending the project. Buyers can treat this as a technical
              summary of how the system is structured and where to plug in
              additional features.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/playground">
              <Button size="sm" variant="primary">
                Try the Playground
              </Button>
            </Link>
            <Link href="/about">
              <Button size="sm" variant="ghost">
                Read About the Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
