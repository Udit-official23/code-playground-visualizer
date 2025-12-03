// src/hooks/useBenchmark.ts
"use-client"
import { useCallback, useEffect, useState } from "react";
import type { BenchmarkSummary } from "@/lib/performance";
import type { Language } from "@/lib/types";

export interface UseBenchmarkOptions {
  algorithmId?: string;
  language: Language;
  iterations?: number;
  inputSize?: number;
  /** If true, run automatically on mount / whenever options change. */
  autoRun?: boolean;
}

export interface UseBenchmarkState {
  loading: boolean;
  error: string | null;
  summary: BenchmarkSummary | null;
  /**
   * Triggers a new benchmark run with the current options.
   */
  run: () => Promise<void>;
}

export function useBenchmark(
  options: UseBenchmarkOptions
): UseBenchmarkState {
  const {
    algorithmId = "bubble-sort",
    language,
    iterations = 8,
    inputSize = 512,
    autoRun = false,
  } = options;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<BenchmarkSummary | null>(
    null
  );

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithmId,
          language,
          iterations,
          inputSize,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Benchmark request failed with status ${res.status}. ${text}`
        );
      }

      const json = (await res.json()) as {
        ok: boolean;
        summary?: BenchmarkSummary;
        meta?: unknown;
      };

      if (!json.ok || !json.summary) {
        throw new Error("Benchmark response did not include summary");
      }

      setSummary(json.summary);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : String(err);
      setError(message);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [algorithmId, language, iterations, inputSize]);

  useEffect(() => {
    if (autoRun) {
      run().catch(() => {
        // error already captured in state
      });
    }
  }, [autoRun, run]);

  return {
    loading,
    error,
    summary,
    run,
  };
}
