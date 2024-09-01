// src/app/roadmap/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RoadmapItem = {
  label: string;
  status: "done" | "in-progress" | "planned";
  description: string;
  bullets?: string[];
};

type RoadmapPhase = {
  id: string;
  title: string;
  timeframe: string;
  items: RoadmapItem[];
};

const phases: RoadmapPhase[] = [
  {
    id: "mvp",
    title: "Phase 1 — Core Playground & Library",
    timeframe: "Completed",
    items: [
      {
        label: "Interactive Playground",
        status: "done",
        description:
          "Monaco-based editor with language tabs, execution, stdout/stderr, trace, visualizer, performance, and history panels.",
      },
      {
        label: "Algorithm Library",
        status: "done",
        description:
          "Filterable catalog of common algorithms, with metadata (category, difficulty, complexity, tags, recommended inputs) and deep links into the playground.",
      },
      {
        label: "Local Persistence",
        status: "done",
        description:
          "LocalStorage-backed hooks for saved playgrounds, run history, and editor settings. No database required for initial deployments.",
      },
      {
        label: "Static Documentation",
        status: "done",
        description:
          "Developer docs, architecture overview, and about page describing how the system is structured.",
      },
    ],
  },
  {
    id: "visualization",
    title: "Phase 2 — Rich Visualizations & Traces",
    timeframe: "In Progress",
    items: [
      {
        label: "Array Visualizer",
        status: "done",
        description:
          "Bar-based visualizer driven by TraceStep snapshots for sorting algorithms such as Bubble Sort.",
      },
      {
        label: "Timeline + Step Navigator",
        status: "done",
        description:
          "Timeline component for stepping through trace steps, with an active-step-aware list of trace entries.",
      },
      {
        label: "Graph Visualizer Demo",
        status: "in-progress",
        description:
          "GraphVisualizer with BFS-style demo steps and controls. Future work: connect directly to algorithm traces for graph algorithms.",
      },
      {
        label: "Tree & Matrix Visualizers",
        status: "planned",
        description:
          "Extend the trace model and visualizer components to support tree traversals (DFS/ BFS) and dynamic programming table visualizations.",
      },
    ],
  },
  {
    id: "platform",
    title: "Phase 3 — Platform & Integrations",
    timeframe: "Planned",
    items: [
      {
        label: "User Accounts (Optional)",
        status: "planned",
        description:
          "Pluggable auth layer to allow per-user saved playgrounds, assignments, and progress tracking, backed by a lightweight database.",
      },
      {
        label: "Assignment / Classroom Mode",
        status: "planned",
        description:
          "Instructor dashboard for creating curated tasks, tracking submissions, and optionally exporting results.",
      },
      {
        label: "External Integrations",
        status: "planned",
        description:
          "Webhooks and REST endpoints for integrating with LMS platforms, documentation portals, or AI assistants.",
      },
      {
        label: "Multi-Tenant Hosting",
        status: "planned",
        description:
          "Namespaced workspaces for different organizations or cohorts, with per-tenant settings and algorithm packs.",
      },
    ],
  },
];

function statusBadge(status: RoadmapItem["status"]) {
  switch (status) {
    case "done":
      return {
        label: "Done",
        className:
          "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40",
      };
    case "in-progress":
      return {
        label: "In Progress",
        className:
          "bg-amber-500/10 text-amber-300 border border-amber-500/40",
      };
    case "planned":
    default:
      return {
        label: "Planned",
        className:
          "bg-slate-500/10 text-slate-300 border border-slate-500/40",
      };
  }
}

export default function RoadmapPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Roadmap
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Product Roadmap
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            A high-level view of where the Code Playground &amp; Algorithm
            Visualizer is today and how it can evolve. Use this as a guide for
            future development or to communicate plans to stakeholders.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Playground
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="sm" variant="secondary">
              Developer Docs
            </Button>
          </Link>
          <Link href="/status">
            <Button size="sm" variant="ghost">
              Status &amp; Health
            </Button>
          </Link>
        </div>
      </section>

      {/* Phases */}
      <section className="space-y-4">
        {phases.map((phase) => (
          <Card
            key={phase.id}
            className="border-slate-800 bg-slate-950/80"
          >
            <CardHeader>
              <CardTitle className="flex flex-col justify-between gap-1 text-xs text-slate-200 md:flex-row md:items-center">
                <span>{phase.title}</span>
                <span className="text-[11px] text-slate-400">
                  {phase.timeframe}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[11px] text-slate-200">
              <div className="grid gap-3 md:grid-cols-2">
                {phase.items.map((item) => {
                  const badge = statusBadge(item.status);
                  return (
                    <div
                      key={item.label}
                      className="space-y-1 rounded-md border border-slate-800 bg-slate-950 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-slate-100">
                          {item.label}
                        </p>
                        <span
                          className={
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                            badge.className
                          }
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {item.description}
                      </p>
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="mt-1 space-y-1 text-[11px] text-slate-300">
                          {item.bullets.map((b) => (
                            <li key={b}>• {b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Adapting the Roadmap
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              The roadmap is intentionally flexible. Depending on your needs,
              you might prioritize visualizers and teaching tools, or focus on
              integrating with existing platforms and identity providers. Treat
              these phases as a starting point for your own plan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/changelog">
              <Button size="sm" variant="secondary">
                View Changelog
              </Button>
            </Link>
            <Link href="/about">
              <Button size="sm" variant="ghost">
                About the Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
