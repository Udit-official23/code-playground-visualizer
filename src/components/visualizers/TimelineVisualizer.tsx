// src/components/visualizers/TimelineVisualizer.tsx
"use client";

import type { TraceStep } from "@/lib/types";

export interface TimelineVisualizerProps {
  /** Full sequence of trace steps for the current run. */
  steps: TraceStep[];
  /** Currently active step number (not index), or null if none selected. */
  activeStep: number | null;
  /**
   * Called when the user clicks a step marker. The argument is the step.step
   * value, not an array index.
   */
  onStepChange: (stepNumber: number) => void;
}

/**
 * A lightweight horizontal timeline that shows one dot per trace step.
 * The active step is highlighted; hovering shows a tooltip with the step
 * number and a short description.
 */
export function TimelineVisualizer({
  steps,
  activeStep,
  onStepChange,
}: TimelineVisualizerProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-800 bg-slate-950/60 px-3 py-2 text-[11px] text-slate-500">
        No trace data for this run. Run a supported algorithm (for example,
        Bubble Sort) to see a step-by-step timeline.
      </div>
    );
  }

  const total = steps.length;
  const effectiveActiveStep =
    activeStep !== null && activeStep !== undefined
      ? activeStep
      : steps[steps.length - 1]?.step ?? null;

  const activeIndex =
    effectiveActiveStep == null
      ? -1
      : steps.findIndex((s) => s.step === effectiveActiveStep);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>
          Trace timeline •{" "}
          <span className="font-semibold text-slate-100">
            {total} step{total === 1 ? "" : "s"}
          </span>
        </span>
        {effectiveActiveStep != null && activeIndex >= 0 && (
          <span>
            Active step:{" "}
            <span className="font-mono text-emerald-300">
              {effectiveActiveStep}
            </span>{" "}
            / {total}
          </span>
        )}
      </div>

      <div className="relative mt-1 h-9 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-1">
        {/* Base line */}
        <div className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-linear-to-r from-slate-700 via-slate-600 to-slate-700" />

        {/* Step markers */}
        <div className="relative flex h-full items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.step === effectiveActiveStep;
            const isFirst = index === 0;
            const isLast = index === total - 1;

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => onStepChange(step.step)}
                className="group relative flex flex-col items-center focus:outline-none"
              >
                <div
                  className={
                    "h-3 w-3 rounded-full border transition-colors " +
                    (isActive
                      ? "border-emerald-400 bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.4)]"
                      : "border-slate-500 bg-slate-800 group-hover:border-emerald-300 group-hover:bg-emerald-500/60")
                  }
                />
                {/* Labels for first/last or active step */}
                {(isFirst || isLast || isActive) && (
                  <span
                    className={
                      "mt-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] " +
                      (isActive
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "bg-slate-900/80 text-slate-300")
                    }
                  >
                    {isFirst
                      ? "Start"
                      : isLast
                      ? "End"
                      : `Step ${step.step}`}
                  </span>
                )}

                {/* Hover tooltip */}
                <div className="pointer-events-none absolute inset-x-auto bottom-6 z-10 hidden w-40 -translate-x-1/2 rounded border border-slate-800 bg-slate-950/95 p-2 text-left text-[9px] text-slate-200 shadow-lg group-hover:block">
                  <p className="mb-0.5 font-semibold text-emerald-300">
                    Step {step.step} • Line {step.currentLine}
                  </p>
                  <p className="line-clamp-3 text-[9px] text-slate-300">
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
