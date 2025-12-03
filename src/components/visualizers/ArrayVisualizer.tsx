"use client";

import * as React from "react";
import clsx from "clsx";
import type { TraceStep } from "@/lib/types";

interface ArrayVisualizerProps {
  steps: TraceStep[];
}

export function ArrayVisualizer({ steps }: ArrayVisualizerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const hasArrayData = steps.some((s) => s.arraySnapshot && s.arraySnapshot.length > 0);

  React.useEffect(() => {
    if (!isPlaying) return;
    if (!steps.length) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          // Stop at the last step
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, 600);

    return () => clearInterval(id);
  }, [isPlaying, steps.length]);

  React.useEffect(() => {
    // reset index when stepping through a new trace array
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [steps]);

  if (!steps.length || !hasArrayData) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-[11px] text-slate-500">
        <p className="max-w-xs">
          No array visualization data available yet. Once the execution engine
          starts emitting <span className="text-emerald-300">arraySnapshot</span>{" "}
          and <span className="text-emerald-300">highlightedIndices</span> per trace step,
          they will be visualized here.
        </p>
      </div>
    );
  }

  const step = steps[Math.min(currentIndex, steps.length - 1)];
  const arr = step.arraySnapshot ?? [];
  const highlighted = new Set(step.highlightedIndices ?? []);

  const maxVal = arr.length ? Math.max(...arr.map((v) => Math.abs(v))) : 1;
  const normalized = arr.map((v) =>
    maxVal === 0 ? 1 : 20 + (Math.abs(v) / maxVal) * 80
  );

  const goToStart = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setIsPlaying(false);
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, steps.length - 1));
    setIsPlaying(false);
  };

  const goToEnd = () => {
    setCurrentIndex(steps.length - 1);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!steps.length) return;
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Array */}
      <div className="flex-1 overflow-auto rounded-md border border-slate-800 bg-slate-950/70 p-3">
        <div className="flex h-full items-center justify-center">
          <div className="flex max-w-full gap-1 overflow-x-auto">
            {arr.map((value, index) => (
              <div
                key={index}
                className={clsx(
                  "flex flex-col items-center justify-end rounded-md bg-slate-900 px-1.5",
                  highlighted.has(index) &&
                    "bg-emerald-500/20 border border-emerald-400/60"
                )}
                style={{ minWidth: "32px" }}
              >
                <div
                  className={clsx(
                    "flex w-full items-end justify-center rounded-sm bg-linear-to-t from-slate-800 to-slate-600",
                    highlighted.has(index) &&
                      "from-emerald-700 to-emerald-400"
                  )}
                  style={{ height: `${normalized[index]}px` }}
                />
                <span className="mt-1 text-[10px] font-mono text-slate-100">
                  {value}
                </span>
                <span className="text-[9px] text-slate-500">[{index}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step details + controls */}
      <div className="mt-2 flex items-center justify-between gap-2 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-1.5">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
            Step {step.step}/{steps.length}
          </span>
          <span className="text-slate-500">Line {step.currentLine}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToStart}
            className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-slate-800"
          >
            ⏮
          </button>
          <button
            type="button"
            onClick={goPrev}
            className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-slate-800"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className={clsx(
              "rounded px-2 py-0.5 text-[10px] font-medium",
              isPlaying
                ? "bg-rose-600 text-slate-50 hover:bg-rose-700"
                : "bg-emerald-600 text-slate-50 hover:bg-emerald-700"
            )}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-slate-800"
          >
            ▶
          </button>
          <button
            type="button"
            onClick={goToEnd}
            className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-slate-800"
          >
            ⏭
          </button>
        </div>
      </div>

      <div className="mt-1 rounded-md bg-slate-950/60 px-2 py-1 text-[10px] text-slate-400">
        {step.description || "No description for this step yet."}
      </div>
    </div>
  );
}
