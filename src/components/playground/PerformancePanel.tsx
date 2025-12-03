// src/components/playground/PerformancePanel.tsx
"use client";

import { useState } from "react";
import type { Language } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PerformancePanelProps = {
  language: Language;
  algorithmId?: string;
};

// Keep this flexible so we don't fight whatever /api/benchmark returns
type BenchmarkRun = {
  label?: string;
  inputSize?: number;
  iterations?: number;
  meanMs?: number;
  p95Ms?: number;
  minMs?: number;
  maxMs?: number;
};

type BenchmarkResultLike = {
  algoId?: string;
  language?: Language;
  runs?: BenchmarkRun[];
  cases?: BenchmarkRun[]; // fallback name if API uses `cases`
  createdAt?: string;
  notes?: string;
};

export function PerformancePanel({
  language,
  algorithmId,
}: PerformancePanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BenchmarkResultLike | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runs: BenchmarkRun[] =
    (result?.runs && Array.isArray(result.runs) && result.runs) ||
    (result?.cases && Array.isArray(result.cases) && result.cases) ||
    [];

  const handleRunBenchmark = async () => {
    if (!algorithmId) {
      setError(
        "Benchmarks are only available when a known algorithm is selected from the library."
      );
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algoId: algorithmId,
          language,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Benchmark failed", text);
        setError("Benchmark run failed. See console for details.");
        setResult(null);
        return;
      }

      const data = (await res.json()) as BenchmarkResultLike;
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Benchmark run failed due to a network or server error.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 text-[11px] text-slate-200">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-100">
            Performance Benchmarks
          </p>
          <p className="text-[10px] text-slate-500">
            Run synthetic benchmarks for the selected algorithm and language.
          </p>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleRunBenchmark}
          disabled={loading || !algorithmId}
          className="text-[11px]"
        >
          {loading ? "Running…" : "Run Benchmark"}
        </Button>
      </div>

      {!algorithmId && (
        <Card className="border-slate-800 bg-slate-950/70">
          <CardContent className="p-3 text-[11px] text-slate-400">
            <p>
              No algorithm selected. Open an algorithm from the{" "}
              <span className="font-semibold text-slate-200">Library</span> or
              from the{" "}
              <span className="font-semibold text-slate-200">
                Algorithm details
              </span>{" "}
              page to enable benchmarks.
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-rose-600/60 bg-rose-950/30">
          <CardContent className="p-3 text-[11px] text-rose-100">
            {error}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-slate-800 bg-slate-950/70">
          <CardContent className="space-y-3 p-3">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold text-slate-100">
                  Benchmark Summary
                </p>
                <p className="text-[10px] text-slate-500">
                  Algorithm:{" "}
                  <span className="font-mono text-emerald-300">
                    {result.algoId ?? algorithmId}
                  </span>{" "}
                  • Language:{" "}
                  <span className="font-mono text-emerald-300">
                    {(result.language ?? language).toUpperCase()}
                  </span>
                </p>
              </div>
              {result.createdAt && (
                <p className="text-[10px] text-slate-500">
                  Run at:{" "}
                  {new Date(result.createdAt).toLocaleString(undefined, {
                    hour12: false,
                  })}
                </p>
              )}
            </div>

            {runs.length === 0 && (
              <p className="text-[11px] text-slate-500">
                Benchmark completed, but no per-case timing data was returned.
              </p>
            )}

            {runs.length > 0 && (
              <div className="overflow-hidden rounded-md border border-slate-800">
                <table className="min-w-full border-collapse text-left text-[11px]">
                  <thead className="bg-slate-900/80 text-slate-300">
                    <tr>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Case
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Input size
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Iterations
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Mean (ms)
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1">
                        p95 (ms)
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Min / Max (ms)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? "bg-slate-950"
                            : "bg-slate-950/70 border-t border-slate-900"
                        }
                      >
                        <td className="px-2 py-1 text-slate-200">
                          {run.label ?? `Case ${idx + 1}`}
                        </td>
                        <td className="px-2 py-1 text-slate-300">
                          {run.inputSize ?? "—"}
                        </td>
                        <td className="px-2 py-1 text-slate-300">
                          {run.iterations ?? "—"}
                        </td>
                        <td className="px-2 py-1 text-emerald-300">
                          {run.meanMs != null
                            ? run.meanMs.toFixed(2)
                            : "—"}
                        </td>
                        <td className="px-2 py-1 text-amber-300">
                          {run.p95Ms != null ? run.p95Ms.toFixed(2) : "—"}
                        </td>
                        <td className="px-2 py-1 text-slate-300">
                          {run.minMs != null ? run.minMs.toFixed(2) : "—"} /{" "}
                          {run.maxMs != null ? run.maxMs.toFixed(2) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.notes && (
              <p className="text-[10px] text-slate-500">{result.notes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {!result && !error && algorithmId && (
        <p className="mt-1 text-[10px] text-slate-500">
          Click{" "}
          <span className="font-mono text-emerald-300">Run Benchmark</span> to
          generate timing data for this algorithm and language.
        </p>
      )}
    </div>
  );
}
