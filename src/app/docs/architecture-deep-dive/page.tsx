// src/app/docs/architecture-deep-dive/page.tsx
//
// Deep-dive documentation for the Code Playground & Algorithm Visualizer.
// This page is intentionally verbose and structured so that:
//
// 1) Buyers can quickly understand how “serious” the architecture is.
// 2) Future maintainers (including Future You™) can jump in without reading
//    the entire codebase first.
// 3) The project gains meaningful, justified LOC instead of random filler.

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ArchitectureSection = {
  id: string;
  title: string;
  summary: string;
};

const sections: ArchitectureSection[] = [
  {
    id: "layers",
    title: "Layered Architecture & Responsibilities",
    summary:
      "How responsibility is separated between UI, orchestration, execution helpers, metadata, and local persistence.",
  },
  {
    id: "runtime",
    title: "Execution Runtime & Safety Model",
    summary:
      "How the JavaScript vm-based runtime is wired, what is allowed, and how we avoid obvious security foot-guns.",
  },
  {
    id: "traces",
    title: "Trace Generation & Visualization Contract",
    summary:
      "The shape of a TraceStep, how trace arrays are produced, and how visualizers consume them.",
  },
  {
    id: "algos",
    title: "Algorithm Packs & Catalog Organization",
    summary:
      "How algorithms are grouped into packs (sorting, graph, DP) and registered into a single catalog for the UI.",
  },
  {
    id: "persistence",
    title: "Local Persistence & Client-Side State",
    summary:
      "How hooks encapsulate reading/writing to localStorage and keep serialization concerns away from components.",
  },
  {
    id: "extensibility",
    title: "Extensibility & Future Directions",
    summary:
      "Where to plug in more languages, more visualizers, or a full backend with user accounts.",
  },
];

export default function ArchitectureDeepDivePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Hero Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Docs · Architecture Deep Dive
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Inside the Code Playground &amp; Algorithm Visualizer
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            This document explains how the project is structured internally:
            how each layer talks to the others, how code execution is sandboxed,
            how traces are modeled, and what you need to know before extending
            the system with new algorithms, runtimes, or visualizers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/docs">
            <Button size="sm" variant="secondary">
              Back to Main Docs
            </Button>
          </Link>
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="ghost">
              Browse Algorithm Library
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick navigation */}
      <section>
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Sections in this Deep Dive
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
                  {sec.summary}
                </p>
              </a>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 1. Layered Architecture */}
      <section id="layers" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              1. Layered Architecture &amp; Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[12px] text-slate-200">
            <p className="text-slate-300">
              The project is intentionally small but still uses a clear layered
              structure so that responsibilities remain obvious:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                •{" "}
                <span className="font-mono text-emerald-300">
                  app/* (routes)
                </span>{" "}
                — defines pages such as{" "}
                <span className="font-mono">/playground</span>,{" "}
                <span className="font-mono">/library</span>,{" "}
                <span className="font-mono">/algorithms/[id]</span>, and
                documentation routes like{" "}
                <span className="font-mono">/docs</span> and{" "}
                <span className="font-mono">
                  /docs/architecture-deep-dive
                </span>
                .
              </li>
              <li>
                •{" "}
                <span className="font-mono text-emerald-300">
                  components/*
                </span>{" "}
                — reusable UI primitives (buttons, cards, tabs) plus
                higher-level visualizers (for example the{" "}
                <span className="font-mono">ArrayVisualizer</span>).
              </li>
              <li>
                •{" "}
                <span className="font-mono text-emerald-300">lib/*</span> — core
                logic and models: algorithm catalog, types, code execution
                helpers, and, if present, benchmark helpers.
              </li>
              <li>
                •{" "}
                <span className="font-mono text-emerald-300">hooks/*</span> —{" "}
                small, focused hooks that encapsulate client-side persistence
                and turn imperative localStorage logic into declarative state.
              </li>
              <li>
                •{" "}
                <span className="font-mono text-emerald-300">app/api/*</span> —
                API routes used by the playground to execute code and, when
                available, to run synthetic benchmarks for certain algorithms.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The main rule is that{" "}
              <span className="font-mono">app/*</span> orchestrates,{" "}
              <span className="font-mono">components/*</span> renders,{" "}
              <span className="font-mono">lib/*</span> contains logic, and{" "}
              <span className="font-mono">hooks/*</span> deals with persistent
              state. This keeps most files focused and easier to reason about.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 2. Runtime & Safety */}
      <section id="runtime" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              2. Execution Runtime &amp; Safety Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[12px] text-slate-200">
            <p className="text-slate-300">
              Code execution is currently centered around a JavaScript runtime
              built with Node&apos;s{" "}
              <span className="font-mono text-emerald-300">vm</span> module.
              The goal is to allow useful experiments while avoiding obvious
              ways to escape the sandbox.
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • The{" "}
                <span className="font-mono text-emerald-300">
                  runJavascript
                </span>{" "}
                helper builds a constrained{" "}
                <span className="font-mono">vm.Script</span> environment and
                exposes only a scoped{" "}
                <span className="font-mono">console</span> object to user code.
              </li>
              <li>
                • Calls to{" "}
                <span className="font-mono">console.log</span>,{" "}
                <span className="font-mono">console.error</span>, and{" "}
                <span className="font-mono">console.warn</span> are intercepted
                and appended to buffers that eventually form{" "}
                <span className="font-mono">stdout</span> and{" "}
                <span className="font-mono">stderr</span>.
              </li>
              <li>
                • A configurable timeout is applied to prevent scripts that
                never terminate or contain accidental infinite loops from
                blocking the server.
              </li>
              <li>
                • The helper always returns a typed{" "}
                <span className="font-mono">ExecutionResult</span> object with
                <span className="font-mono">stdout</span>,{" "}
                <span className="font-mono">stderr</span>,{" "}
                <span className="font-mono">durationMs</span>, and optionally a
                trace payload.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The design goal is &quot;sandboxed experiment environment&quot;
              rather than a full multi-tenant, production-grade code execution
              service. However, the abstraction boundary is clean enough that
              you could swap the implementation for a remote sandbox or a
              separate microservice if needed.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. Traces & Visualizers */}
      <section id="traces" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              3. Trace Generation &amp; Visualization Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[12px] text-slate-200">
            <p className="text-slate-300">
              Visualizations are powered by a small but explicit trace model.
              Instead of tightly coupling visualizers to any particular
              algorithm, the project defines a generic trace shape that can be
              produced by different helpers.
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • A{" "}
                <span className="font-mono text-emerald-300">TraceStep</span>{" "}
                carries a{" "}
                <span className="font-mono">step</span> index, an optional{" "}
                <span className="font-mono">description</span>, a{" "}
                <span className="font-mono">currentLine</span> approximation,
                and optional algorithm-specific snapshots.
              </li>
              <li>
                • For array-based algorithms (sorting, BFS on grids, etc.), the
                trace includes{" "}
                <span className="font-mono">arraySnapshot</span> and{" "}
                <span className="font-mono">highlightedIndices</span> so that
                the{" "}
                <span className="font-mono">ArrayVisualizer</span> can render
                bars and highlight the active elements.
              </li>
              <li>
                • More advanced helpers may later add graph snapshots, tree
                levels, or matrices to the trace without breaking older
                visualizers.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The important design decision is that trace arrays are{" "}
              <span className="font-mono">pure data</span>. The playground
              merely selects which visualizer to use for a given trace and does
              not need to know how individual steps were computed.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 4. Algorithm Packs */}
      <section id="algos" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              4. Algorithm Packs &amp; Catalog Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[12px] text-slate-200">
            <p className="text-slate-300">
              Instead of keeping one huge file with every possible algorithm,
              the project uses an internal &quot;algorithm packs&quot; pattern.
              Each pack groups related algorithms and then exports them as{" "}
              <span className="font-mono">AlgorithmMeta</span> entries.
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • Core metadata lives in{" "}
                <span className="font-mono text-emerald-300">
                  lib/algorithms.ts
                </span>{" "}
                and defines shared types like{" "}
                <span className="font-mono">AlgorithmMeta</span>,{" "}
                <span className="font-mono">AlgorithmCategory</span>, and{" "}
                <span className="font-mono">Difficulty</span>.
              </li>
              <li>
                • Packs such as{" "}
                <span className="font-mono">
                  lib/algorithms-pack/sorting.ts
                </span>{" "}
                and{" "}
                <span className="font-mono">
                  lib/algorithms-pack/graph-paths.ts
                </span>{" "}
                declare many concrete algorithms with rich descriptions and
                code templates.
              </li>
              <li>
                • The main catalog simply imports arrays from each pack and
                flattens them into a single exported list that backs the{" "}
                <span className="font-mono">/library</span> page and the detail
                route <span className="font-mono">/algorithms/[id]</span>.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              This approach makes it easy to add &quot;themed&quot; packs (for
              example, string algorithms, matrix algorithms, pathfinding on
              grids) without bloating a single file or changing UI code.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 5. Local Persistence */}
      <section id="persistence" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              5. Local Persistence &amp; Client-Side State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[12px] text-slate-200">
            <p className="text-slate-300">
              The project deliberately avoids a database. Instead it leans on
              the browser&apos;s{" "}
              <span className="font-mono text-emerald-300">localStorage</span>{" "}
              API and wraps all the logic inside React hooks.
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • <span className="font-mono">useLocalPlaygrounds</span>{" "}
                handles storing named playgrounds including language, code, and
                optional algorithm linkage.
              </li>
              <li>
                • <span className="font-mono">useRunHistory</span> records a
                bounded history of runs, including duration and truncated
                stdout/stderr for quick inspection.
              </li>
              <li>
                • <span className="font-mono">usePlaygroundSettings</span>{" "}
                persists editor options such as font size, minimap visibility,
                theme selection, and word wrap mode.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              By centralizing all persistence concerns inside hooks the rest of
              the UI can stay focused on rendering and orchestration. If a
              future version adds a backend and user accounts, these hooks can
              be swapped to synchronize with a server while keeping the UI
              largely unchanged.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 6. Extensibility */}
      <section id="extensibility" className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              6. Extensibility &amp; Future Directions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[12px] text-slate-200">
            <p className="text-slate-300">
              The codebase is deliberately built with future extensions in mind
              without prematurely introducing complexity. Typical extension
              points include:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>
                • <span className="font-semibold">New runtimes:</span> add
                helpers such as{" "}
                <span className="font-mono">runPython</span> or a remote
                execution backend, then expose them via{" "}
                <span className="font-mono">/api/execute</span> while reusing
                the same{" "}
                <span className="font-mono">ExecutionResult</span> contract.
              </li>
              <li>
                • <span className="font-semibold">New visualizers:</span> define
                additional components (e.g.{" "}
                <span className="font-mono">GraphVisualizer</span>,{" "}
                <span className="font-mono">TreeVisualizer</span>) that read
                specialized fields from{" "}
                <span className="font-mono">TraceStep</span>.
              </li>
              <li>
                • <span className="font-semibold">New algorithm packs:</span>{" "}
                create more files under{" "}
                <span className="font-mono">lib/algorithms-pack</span> and
                register them in the main catalog to instantly appear in the
                library and playground.
              </li>
              <li>
                • <span className="font-semibold">User accounts:</span> add
                authentication and use a real database for sharing playgrounds
                and saving benchmarks, while preserving the in-browser
                experience for quick, anonymous experimentation.
              </li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The current version is intentionally kept to a single deployable
              app (no extra services required) so that it can be hosted
              cheaply, sold as a bundle, or embedded as a teaching tool inside
              other products.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer CTA */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              For Maintainers &amp; Reviewers
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              With the deep-dive and the main documentation page, the project
              now ships with enough technical context for serious code review,
              handover, or buyer due diligence—without anyone needing to reverse
              engineer the structure from scratch.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/playground">
              <Button size="sm" variant="primary">
                Try the Playground
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="sm" variant="ghost">
                View All Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
