// src/components/playground/PerformancePanel.tsx
"use client";

import React from "react";
import type { Language } from "@/lib/types";
import { useBenchmark } from "@/hooks/useBenchmark";
import { Button } from "@/components/ui/button";

interface PerformancePanelProps {
  /** Current editor language. */
  language: Language;
  /** Optional algorithm id, defaults to "bubble-sort". */
  algorithmId?: string;
}

export const PerformancePanel: React.FC<PerformancePanelProps> = ({
  language,
  algorithmId = "bubble-sort",
}) => {
  const { loading, error, summary, run } = useBenchmark({
    language,
    algorithmId,
    iterations: 8,
    inputSize: 512,
    autoRun: false,
  });

  const hasSummary = !!summary;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
            Benchmark
          </p>
          <p className="text-[10px] text-slate-500">
            Measure average runtime of a built-in algorithm implementation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={loading}
            onClick={() => {
              void run();
            }}
          >
            {loading ? "Running…" : "Run Benchmark"}
          </Button>
        </div>
      </div>

      {!hasSummary && !loading && !error && (
        <p className="text-[11px] text-slate-500">
          No benchmark run yet. Click{" "}
          <span className="font-semibold text-slate-300">
            Run Benchmark
          </span>{" "}
          to measure a JavaScript Bubble Sort over a random input array.
        </p>
      )}

      {error && (
        <div className="rounded border border-rose-700/60 bg-rose-950/40 p-2 text-[11px] text-rose-200">
          <p className="font-semibold">Error</p>
          <p className="mt-1 wrap-break-word">{error}</p>
        </div>
      )}

      {hasSummary && summary && (
        <div className="flex flex-1 flex-col gap-3 overflow-auto rounded border border-slate-800 bg-slate-950/70 p-2">
          <div className="grid gap-2 sm:grid-cols-3">
            <MetricChip
              label="Average"
              value={`${summary.averageMs.toFixed(2)} ms`}
            />
            <MetricChip
              label="Fastest"
              value={`${summary.minMs.toFixed(2)} ms`}
            />
            <MetricChip
              label="Slowest"
              value={`${summary.maxMs.toFixed(2)} ms`}
            />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Raw Samples
            </p>
            <div className="max-h-40 overflow-auto rounded border border-slate-800 bg-slate-950/80">
              <table className="min-w-full border-collapse text-[10px]">
                <thead className="bg-slate-950/80">
                  <tr>
                    <th className="border-b border-slate-800 px-2 py-1 text-left font-medium text-slate-400">
                      Iteration
                    </th>
                    <th className="border-b border-slate-800 px-2 py-1 text-left font-medium text-slate-400">
                      Duration (ms)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {summary.samples.map((sample) => (
                    <tr
                      key={sample.iteration}
                      className="odd:bg-slate-950 even:bg-slate-950/70"
                    >
                      <td className="border-b border-slate-900 px-2 py-1 text-slate-300">
                        #{sample.iteration}
                      </td>
                      <td className="border-b border-slate-900 px-2 py-1 text-slate-200">
                        {sample.durationMs.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Notes
            </p>
            <p className="text-[10px] text-slate-500">
              This panel currently benchmarks a fixed JavaScript Bubble Sort
              implementation on the server using <code>vm</code>. It is meant
              for educational and relative comparisons, not low-level
              micro-optimization.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface MetricChipProps {
  label: string;
  value: string;
}

const MetricChip: React.FC<MetricChipProps> = ({ label, value }) => {
  return (
    <div className="flex flex-col rounded border border-slate-800 bg-slate-950 px-2 py-1.5">
      <span className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-[11px] font-semibold text-emerald-300">
        {value}
      </span>
    </div>
  );
};
