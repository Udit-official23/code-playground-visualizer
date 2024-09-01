// src/app/architecture/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Section = {
  id: string;
  title: string;
  description: string;
};

type FlowStep = {
  id: number;
  title: string;
  body: string;
};

type ModuleGroup = {
  id: string;
  title: string;
  description: string;
  files: {
    path: string;
    role: string;
  }[];
};

const overviewSections: Section[] = [
  {
    id: "stack",
    title: "Tech Stack & Runtime",
    description:
      "The project is built on Next.js (App Router) with TypeScript, using client/server components for a clear separation between UI and execution logic. The playground and visualizers are client-side, while the execution engine and benchmarks run in API routes on the server.",
  },
  {
    id: "languages",
    title: "Language Support",
    description:
      "The playground currently ships with first-class support for JavaScript and Python. Execution, tracing, and benchmarking are primarily wired for JavaScript, but the types and abstractions make it straightforward to add additional languages or execution backends.",
  },
  {
    id: "pedagogy",
    title: "Teaching & Visualization Focus",
    description:
      "Beyond simply running code, the app is designed as a teaching tool. It surfaces traces, array snapshots, visual timelines, and performance metrics, so learners can see how algorithms behave instead of treating them as black boxes.",
  },
];

const executionFlow: FlowStep[] = [
  {
    id: 1,
    title: "User edits code in the Monaco-based playground",
    body: "The Interactive Playground uses Monaco Editor with configurable font-size, minimap, word-wrap, and theme. Language tabs switch between JavaScript and Python, and keyboard shortcuts (Ctrl+Enter, Ctrl+S, Alt+L) make the editor feel like a normal IDE.",
  },
  {
    id: 2,
    title: "Client sends a request to the execution API",
    body: "When the user clicks Run Code (or presses Ctrl+Enter), the playground calls an API route responsible for executing the user code. The request includes the language, optional algorithm id, and the raw code payload. The API chooses an execution strategy based on the language.",
  },
  {
    id: 3,
    title: "Server executes code in a restricted context",
    body: "For JavaScript, the server uses Node's vm module to run code inside a sandbox with a custom console implementation. All console.log / console.error calls are captured into stdout / stderr buffers. A tight timeout is applied to protect the server from infinite loops or long-running scripts.",
  },
  {
    id: 4,
    title: "Execution produces stdout, stderr, and optional trace",
    body: "The execution helpers return a structured ExecutionResult containing stdout, stderr, duration, and a trace array. For user code that matches known algorithms, the trace array is populated with synthetic or semi-real steps that can be visualized as timelines or array animations.",
  },
  {
    id: 5,
    title: "Client updates UI: output, trace, visualizer, history",
    body: "The playground writes the result into React state and fans it out to multiple views: a stdout panel, a trace list, an ArrayVisualizer, and a run history feed. History is persisted locally so learners can restore previous runs and compare versions of an algorithm.",
  },
];

const modules: ModuleGroup[] = [
  {
    id: "playground",
    title: "Playground & UI Shell",
    description:
      "These components are responsible for the main user experience: editing, running, saving, restoring, and navigating between analysis views.",
    files: [
      {
        path: "src/app/playground/page.tsx",
        role: "Top-level playground page. Hosts Monaco, language tabs, execution insights (stdout/trace/visualizer/performance/history), and editor settings.",
      },
      {
        path: "src/components/visualizers/ArrayVisualizer.tsx",
        role: "Array-based visualizer for algorithm traces. Shows highlighted indices, transitions, and simple animations.",
      },
      {
        path: "src/components/ui/button.tsx",
        role: "Shared button component used across the playground, library, and docs. Variants and sizes keep the UI consistent.",
      },
      {
        path: "src/components/ui/card.tsx",
        role: "Card layout primitive, used in the playground, library, shortcuts, and architecture pages.",
      },
      {
        path: "src/hooks/usePlaygroundHotkeys.ts",
        role: "Installs keyboard shortcuts for running code, saving, toggling language, focusing tabs, and navigating core routes.",
      },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms, Metadata & Templates",
    description:
      "Algorithm metadata and language-specific templates live in reusable, strongly-typed modules. Pages like the Library and Algorithm Details consume these definitions.",
    files: [
      {
        path: "src/lib/types.ts",
        role: "Core shared types, including Language, TraceStep, ExecutionResult, and algorithm-related enums.",
      },
      {
        path: "src/lib/algorithms.ts",
        role: "Definitions for the algorithms shown in the Library, including id, category, difficulty, tags, and complexity metadata.",
      },
      {
        path: "src/lib/algorithmCode.ts",
        role: "Language-specific starter code for algorithms such as Bubble Sort, Merge Sort, BFS/DFS, Dijkstra, Topological Sort, and 0/1 Knapsack.",
      },
      {
        path: "src/app/library/page.tsx",
        role: "Algorithm Library grid with search, filter-by-category, difficulty, and language. Each card can be opened directly in the playground.",
      },
      {
        path: "src/app/algorithms/[id]/page.tsx",
        role: "Algorithm details page that surfaces metadata, complexity, notes, and links to open the algorithm in the playground.",
      },
    ],
  },
  {
    id: "execution",
    title: "Execution Engine & Tracing",
    description:
      "This layer translates user code and algorithm ids into safe server-side execution and structured traces.",
    files: [
      {
        path: "src/lib/execution/javascriptRunner.ts",
        role: "Primary execution helper for JavaScript. Uses Node's vm context, custom console bindings, and a runtime timeout to produce ExecutionResult objects.",
      },
      {
        path: "src/app/api/execute/route.ts",
        role: "API route that receives playground execution requests, delegates to the appropriate runner (JavaScript, Python, etc.), and returns results to the client.",
      },
      {
        path: "src/lib/execution/traceGenerators.ts",
        role: "Trace-generation utilities for known algorithms (for example Bubble Sort, Binary Search), emitting high-level steps with array snapshots and highlighted indices.",
      },
      {
        path: "src/app/api/trace/route.ts",
        role: "Optional route for pure trace generation. Can be used to recompute or preview traces without executing arbitrary user code.",
      },
    ],
  },
  {
    id: "performance",
    title: "Performance & Benchmarks",
    description:
      "A small but extensible performance layer measures runtime characteristics of built-in algorithm implementations.",
    files: [
      {
        path: "src/lib/performance.ts",
        role: "Exports BenchmarkConfig, BenchmarkSample, BenchmarkSummary, and benchmarkSyncFunction for measuring wall-clock durations of synchronous functions.",
      },
      {
        path: "src/app/api/benchmark/route.ts",
        role: "POST endpoint that benchmarks a Bubble Sort implementation with synthetic random data, returning a BenchmarkSummary and metadata.",
      },
      {
        path: "src/hooks/useBenchmark.ts",
        role: "Client-side hook that calls /api/benchmark, tracks loading/error state, and exposes a BenchmarkSummary for visualization.",
      },
      {
        path: "src/components/playground/PerformancePanel.tsx",
        role: "Right-hand panel for the Performance tab, rendering metrics, raw samples, and explanatory notes.",
      },
    ],
  },
  {
    id: "state",
    title: "Local State, History & Persistence",
    description:
      "The playground keeps a lightweight local persistence layer for saved playgrounds and run history, avoiding any database dependency.",
    files: [
      {
        path: "src/lib/localStorage.ts",
        role: "Helpers for reading/writing structured JSON into window.localStorage with basic guards.",
      },
      {
        path: "src/lib/playgroundsStorage.ts",
        role: "Implements CRUD for saved playgrounds: create, update, list, and delete. Used by the playground Saved Playgrounds section.",
      },
      {
        path: "src/lib/runHistory.ts",
        role: "Maintains a bounded list of recent runs (e.g., last 50), including timestamps, success status, language, algorithm id, and stdout/stderr previews.",
      },
    ],
  },
];

const nonGoals: Section[] = [
  {
    id: "untrusted",
    title: "Unrestricted untrusted execution",
    description:
      "The project intentionally avoids acting as a fully sandboxed, multi-tenant untrusted code runner. It is designed as a single-tenant/educational environment where the host controls the deployment and constraints.",
  },
  {
    id: "production-ide",
    title: "Full-blown cloud IDE",
    description:
      "The aim is not to replace VS Code or JetBrains IDEs in the browser. Instead, it focuses on small self-contained programs and algorithms where visual traces and performance comparisons are more valuable than full project tooling.",
  },
  {
    id: "language-farm",
    title: "Dozens of languages at once",
    description:
      "The abstractions make it possible to add more languages, but the initial scope is JavaScript and Python, tuned for teaching data structures and algorithms. Adding more languages would require additional runners and security review.",
  },
];

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Internals
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Architecture &amp; Internal Design
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            This page documents how the Code Playground &amp; Algorithm
            Visualizer is structured under the hood: how the playground talks to
            the execution engine, where traces and benchmarks come from, and how
            the modules are organized so the project can be extended or
            maintained over time.
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
              Open Algorithm Library
            </Button>
          </Link>
          <Link href="/shortcuts">
            <Button size="sm" variant="ghost">
              Keyboard Shortcuts
            </Button>
          </Link>
        </div>
      </section>

      {/* High-level overview */}
      <section className="grid gap-4 md:grid-cols-3">
        {overviewSections.map((section) => (
          <Card
            key={section.id}
            className="border-slate-800 bg-slate-950/80"
          >
            <CardHeader>
              <CardTitle className="text-xs text-slate-200">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] text-slate-400">
                {section.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Request → Execution → Visualization flow */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Request → Execution → Visualization Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {executionFlow.map((step) => (
              <div
                key={step.id}
                className="flex gap-3 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-emerald-500/60 bg-emerald-500/10 text-center text-[11px] font-semibold text-emerald-300">
                  {step.id}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-100">
                    {step.title}
                  </p>
                  <p className="text-[11px] text-slate-400">{step.body}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Modules & files */}
      <section className="space-y-4">
        {modules.map((group) => (
          <Card
            key={group.id}
            className="border-slate-800 bg-slate-950/80"
          >
            <CardHeader>
              <CardTitle className="text-xs text-slate-200">
                {group.title}
              </CardTitle>
              <p className="mt-1 text-[11px] text-slate-400">
                {group.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-md border border-slate-800 bg-slate-950/80">
                <table className="min-w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-300">
                      <th className="border-b border-slate-800 px-3 py-1.5 text-left font-medium">
                        File
                      </th>
                      <th className="border-b border-slate-800 px-3 py-1.5 text-left font-medium">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.files.map((file) => (
                      <tr
                        key={file.path}
                        className="border-b border-slate-900/60 odd:bg-slate-950 even:bg-slate-950/60"
                      >
                        <td className="px-3 py-1.5 align-top font-mono text-[10px] text-emerald-300">
                          {file.path}
                        </td>
                        <td className="px-3 py-1.5 align-top text-[11px] text-slate-400">
                          {file.role}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Non-goals / scope */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Non-goals &amp; Scope Boundaries
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {nonGoals.map((item) => (
              <div
                key={item.id}
                className="space-y-1 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <p className="text-[11px] font-semibold text-slate-100">
                  {item.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Extensibility
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              The structure above is intentionally modular: you can add new
              languages by introducing additional runners, plug in alternative
              tracing strategies, or replace the performance layer with a more
              advanced benchmarking engine without rewriting the playground UI.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/docs">
              <Button size="sm" variant="ghost">
                Read Developer Docs
              </Button>
            </Link>
            <Link href="/shortcuts">
              <Button size="sm" variant="secondary">
                Keyboard Shortcuts
              </Button>
            </Link>
            <Link href="/playground">
              <Button size="sm" variant="primary">
                Back to Playground
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
