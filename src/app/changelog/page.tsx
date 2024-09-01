// src/app/changelog/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ChangeItem = {
  type: "feature" | "improvement" | "fix" | "docs" | "internal";
  title: string;
  body: string;
};

type Release = {
  version: string;
  codename?: string;
  date: string;
  highlights: string;
  changes: ChangeItem[];
};

const releases: Release[] = [
  {
    version: "0.3.0",
    codename: "Performance & History",
    date: "2025-12-01",
    highlights:
      "Introduced performance benchmarks, run history, keyboard shortcuts, and deeper playground instrumentation.",
    changes: [
      {
        type: "feature",
        title: "Performance tab in Playground",
        body: "Added a dedicated Performance tab that can run server-side benchmarks for built-in algorithms and show average / fastest / slowest metrics along with raw samples.",
      },
      {
        type: "feature",
        title: "Run History",
        body: "The playground now keeps a local feed of the latest runs (up to 50) including success status, duration, language, algorithm id, and stdout/stderr previews.",
      },
      {
        type: "feature",
        title: "Keyboard shortcuts",
        body: "Introduced global hotkeys such as Ctrl+Enter to run code, Ctrl+S to save a playground, Alt+L to toggle language, and Alt+O / T / V / P / R to focus output, trace, visualizer, performance, or history.",
      },
      {
        type: "improvement",
        title: "Editor settings panel",
        body: "Monaco-based playground now exposes font size, word wrap, minimap visibility, and editor theme via a dedicated Editor Settings card.",
      },
      {
        type: "internal",
        title: "Benchmark API and hook",
        body: "Added /api/benchmark, a reusable performance.ts helper, and a useBenchmark hook to standardize benchmark calls from the client.",
      },
      {
        type: "docs",
        title: "Architecture & Shortcuts pages",
        body: "Documented internals on /architecture and added a dedicated /shortcuts page for power users.",
      },
    ],
  },
  {
    version: "0.2.0",
    codename: "Algorithms & Visualizer",
    date: "2025-11-15",
    highlights:
      "Expanded algorithm library, added array visualizer, and wired the playground to open algorithms with language-aware templates.",
    changes: [
      {
        type: "feature",
        title: "Algorithm Library",
        body: "Introduced a searchable, filterable Algorithm Library at /library, including metadata such as category, difficulty, complexity, tags, and recommended inputs.",
      },
      {
        type: "feature",
        title: "Algorithm details pages",
        body: "Added dynamic routes under /algorithms/[id] to show per-algorithm notes, complexity tables, and quick-open-in-playground actions.",
      },
      {
        type: "feature",
        title: "ArrayVisualizer",
        body: "Implemented a first visualizer for array-based algorithms. It can show highlighted indices, transitions, and step-by-step snapshots derived from trace data.",
      },
      {
        type: "improvement",
        title: "Stronger typing for algorithm metadata",
        body: "Centralized algorithm-related enums and types (Difficulty, AlgorithmCategory, Language) in shared lib files to reduce duplication.",
      },
      {
        type: "fix",
        title: "Library filter UX",
        body: "Fixed category/difficulty/language filters so they correctly update the result count and grid without full page refresh.",
      },
    ],
  },
  {
    version: "0.1.0",
    codename: "Initial Playground",
    date: "2025-11-01",
    highlights:
      "First public version of the Code Playground & Algorithm Visualizer with JavaScript execution and simple traces.",
    changes: [
      {
        type: "feature",
        title: "Interactive Playground",
        body: "Initial playground page with Monaco Editor, language tabs (JavaScript/Python), Run Code button, and basic stdout/stderr display.",
      },
      {
        type: "feature",
        title: "JavaScript execution engine",
        body: "Server-side JavaScript runner using Node vm with a restricted sandbox, capturing console.log/error/warn output and enforcing a timeout.",
      },
      {
        type: "feature",
        title: "Bubble Sort trace generator",
        body: "First trace generator emitting step descriptions and array snapshots for Bubble Sort to drive the visualizer.",
      },
      {
        type: "docs",
        title: "Overview & docs shell",
        body: "Added a simple /about and /docs layout to describe high-level goals, product positioning, and future plans.",
      },
      {
        type: "internal",
        title: "UI foundation components",
        body: "Set up shared UI primitives like Button, Card, Tabs, and basic theme variables used across the app.",
      },
    ],
  },
];

function badgeClass(type: ChangeItem["type"]): string {
  switch (type) {
    case "feature":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40";
    case "improvement":
      return "bg-sky-500/10 text-sky-300 border border-sky-500/40";
    case "fix":
      return "bg-amber-500/10 text-amber-300 border border-amber-500/40";
    case "docs":
      return "bg-indigo-500/10 text-indigo-300 border border-indigo-500/40";
    case "internal":
    default:
      return "bg-slate-500/10 text-slate-300 border border-slate-500/40";
  }
}

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Releases
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Changelog
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            A human-friendly log of what has changed in the Code Playground
            &amp; Algorithm Visualizer over time. Use this page to understand
            which features landed in each version and how the product is
            evolving.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Playground
            </Button>
          </Link>
          <Link href="/architecture">
            <Button size="sm" variant="secondary">
              Architecture Overview
            </Button>
          </Link>
          <Link href="/roadmap">
            <Button size="sm" variant="ghost">
              View Roadmap
            </Button>
          </Link>
        </div>
      </section>

      {/* Releases */}
      <section className="space-y-4">
        {releases.map((release) => (
          <Card
            key={release.version}
            className="border-slate-800 bg-slate-950/80"
          >
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-xs text-slate-200">
                    v{release.version}
                    {release.codename ? ` — ${release.codename}` : ""}
                  </CardTitle>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {release.date}
                  </p>
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] text-slate-300">
                  {release.highlights}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {release.changes.map((change, index) => (
                <div
                  key={`${release.version}-${index}-${change.title}`}
                  className="flex gap-3 rounded-md border border-slate-800 bg-slate-950 p-3"
                >
                  <span
                    className={
                      "mt-0.5 inline-flex h-5 shrink-0 items-center justify-center rounded-full px-2 text-[9px] font-semibold uppercase tracking-wide " +
                      badgeClass(change.type)
                    }
                  >
                    {change.type}
                  </span>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-100">
                      {change.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {change.body}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Stability &amp; Progress
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              The changelog focuses on user-visible improvements. Internal refactors,
              type-safety work, and CI changes are summarized under internal when
              relevant. Downstream users embedding this playground can upgrade
              safely by following the documented versions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/roadmap">
              <Button size="sm" variant="secondary">
                Next Planned Features
              </Button>
            </Link>
            <Link href="/architecture">
              <Button size="sm" variant="ghost">
                Read Internals
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
