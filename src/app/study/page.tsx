"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  interviewSessionPlans,
  expandSessionPlan,
  type InterviewSessionPlan,
  type SessionFocus,
} from "@/lib/interviewSheets";

type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";
type FocusFilter = "all" | SessionFocus;

const levelLabels: Record<LevelFilter, string> = {
  all: "All levels",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const focusLabels: { [key in SessionFocus]: string } = {
  fundamentals: "Fundamentals",
  "data-structures": "Data Structures",
  "problem-solving": "Problem Solving",
  "contest-prep": "Contest Prep",
  "interview-dry-run": "Interview Dry Run",
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;
  return `${hours}h ${rest}m`;
}

function formatLevel(level: "beginner" | "intermediate" | "advanced"): string {
  switch (level) {
    case "beginner":
      return "Beginner Friendly";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced Practice";
    default:
      return level;
  }
}

export default function StudyPage() {
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [focusFilter, setFocusFilter] = useState<FocusFilter>("all");

  const filteredPlans = interviewSessionPlans.filter((plan) => {
    if (levelFilter !== "all" && plan.recommendedLevel !== levelFilter) {
      return false;
    }
    if (focusFilter !== "all" && plan.focus !== focusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <header className="space-y-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Study &amp; Interview Planner
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Guided Practice Sessions
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            Use these curated sessions to practice algorithms inside the
            Playground. Each plan combines warmups, core questions, and stretch
            problems, with a checklist for your debrief.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
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
        </div>
      </header>

      {/* Filters */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Level
            </p>
            <div className="flex flex-wrap gap-1">
              {(["all", "beginner", "intermediate", "advanced"] as LevelFilter[]).map(
                (lvl) => (
                  <Button
                    key={lvl}
                    size="sm"
                    variant={levelFilter === lvl ? "primary" : "ghost"}
                    onClick={() => setLevelFilter(lvl)}
                    className="text-[11px]"
                  >
                    {levelLabels[lvl]}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Focus
            </p>
            <div className="flex flex-wrap gap-1">
              {(["all", "fundamentals", "data-structures", "problem-solving", "contest-prep", "interview-dry-run"] as FocusFilter[]).map(
                (focus) => (
                  <Button
                    key={focus}
                    size="sm"
                    variant={focusFilter === focus ? "primary" : "ghost"}
                    onClick={() => setFocusFilter(focus)}
                    className="text-[11px]"
                  >
                    {focus === "all" ? "All focuses" : focusLabels[focus]}
                  </Button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Summary
            </p>
            <p className="text-[11px] text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-100">
                {filteredPlans.length}
              </span>{" "}
              session{filteredPlans.length === 1 ? "" : "s"} out of{" "}
              <span className="font-semibold text-slate-100">
                {interviewSessionPlans.length}
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Plans grid */}
      <section className="grid gap-3 md:grid-cols-2">
        {filteredPlans.map((plan: InterviewSessionPlan) => {
          const expanded = expandSessionPlan(plan.id);
          const warmupCount = expanded.warmup.length;
          const coreCount = expanded.core.length;
          const stretchCount = expanded.stretch.length;
          const totalQuestions = warmupCount + coreCount + stretchCount;

          return (
            <Card
              key={plan.id}
              className="border-slate-800 bg-slate-950/70 transition-colors hover:border-emerald-500/60 hover:bg-slate-950/90"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm text-slate-100">
                      {plan.title}
                    </CardTitle>
                    <p className="text-[11px] text-slate-400">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[10px]">
                    <span className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-emerald-300">
                      {focusLabels[plan.focus]}
                    </span>
                    <span className="rounded bg-slate-900 px-2 py-0.5 text-slate-300">
                      {formatLevel(plan.recommendedLevel)}
                    </span>
                    <span className="text-slate-500">
                      {formatDuration(plan.targetDurationMinutes)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-[11px] text-slate-200">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-slate-300">
                    Warmup:{" "}
                    <span className="font-semibold text-emerald-300">
                      {warmupCount}
                    </span>
                  </span>
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-slate-300">
                    Core:{" "}
                    <span className="font-semibold text-emerald-300">
                      {coreCount}
                    </span>
                  </span>
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-slate-300">
                    Stretch:{" "}
                    <span className="font-semibold text-emerald-300">
                      {stretchCount}
                    </span>
                  </span>
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-slate-300">
                    Total Qs:{" "}
                    <span className="font-semibold text-emerald-300">
                      {totalQuestions}
                    </span>
                  </span>
                </div>

                <div>
                  <p className="mb-1 text-[10px] text-slate-400">
                    Debrief checklist
                  </p>
                  <ul className="space-y-1 text-[10px] text-slate-300">
                    {plan.debriefChecklist.slice(0, 3).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                    {plan.debriefChecklist.length > 3 && (
                      <li className="text-slate-500">
                        +{plan.debriefChecklist.length - 3} more reflection
                        point
                        {plan.debriefChecklist.length - 3 === 1 ? "" : "s"}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[10px] text-slate-500">
                    Tip: open the Playground in another tab and use this plan as
                    your checklist while you code.
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-[11px]"
                    onClick={() => {
                      // Placeholder for future guided-mode integration.
                      // For now this just hints that the session is conceptual.
                      console.log("Start session:", plan.id);
                    }}
                  >
                    Start Session (manual)
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredPlans.length === 0 && (
          <p className="text-[12px] text-slate-400">
            No sessions match the current filters. Try resetting the level or
            focus filters above.
          </p>
        )}
      </section>
    </div>
  );
}
