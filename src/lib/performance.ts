// src/lib/performance.ts

/**
 * Basic metadata describing what we are benchmarking.
 */
export interface BenchmarkConfig {
  /** Identifier for the algorithm or routine being measured. */
  algorithmId: string;
  /** Human-readable language label (e.g. "javascript", "python", "wasm"). */
  language: string;
  /** Number of iterations to run. Higher = smoother average but slower. */
  iterations: number;
}

/**
 * A single benchmark sample corresponding to one execution of the target.
 */
export interface BenchmarkSample {
  /** 1-based index of the run. */
  iteration: number;
  /** Duration in milliseconds for this iteration. */
  durationMs: number;
}

/**
 * Summary of all iterations, including aggregates that are useful for charts.
 */
export interface BenchmarkSummary {
  /** Identifier for the algorithm (copied from the config). */
  algorithmId: string;
  /** Language label (copied from the config). */
  language: string;
  /** All raw samples, useful for charts or histograms. */
  samples: BenchmarkSample[];
  /** Average duration across all iterations. */
  averageMs: number;
  /** Minimum single-run duration. */
  minMs: number;
  /** Maximum single-run duration. */
  maxMs: number;
}

/**
 * Helper to compute aggregate statistics from a list of durations.
 */
function summarizeDurations(
  durations: number[]
): { average: number; min: number; max: number } {
  if (durations.length === 0) {
    return { average: 0, min: 0, max: 0 };
  }

  let sum = 0;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const d of durations) {
    sum += d;
    if (d < min) min = d;
    if (d > max) max = d;
  }

  return {
    average: sum / durations.length,
    min,
    max,
  };
}

/**
 * Runs a synchronous function multiple times and returns a BenchmarkSummary.
 *
 * The function may be any deterministic or non-deterministic routine; this utility
 * simply measures wall-clock duration using Date.now().
 *
 * NOTE: This is intentionally simple and synchronous. It is not meant to be
 * micro-benchmark-grade accurate, but rather useful for visual comparisons,
 * teaching, and relative performance insights.
 */
export function benchmarkSyncFunction(
  config: BenchmarkConfig,
  fn: () => void
): BenchmarkSummary {
  const samples: BenchmarkSample[] = [];
  const durations: number[] = [];

  const iterations =
    config.iterations > 0 ? Math.floor(config.iterations) : 1;

  for (let i = 1; i <= iterations; i++) {
    const start = Date.now();
    fn();
    const end = Date.now();
    const durationMs = end - start;

    samples.push({
      iteration: i,
      durationMs,
    });

    durations.push(durationMs);
  }

  const { average, min, max } = summarizeDurations(durations);

  return {
    algorithmId: config.algorithmId,
    language: config.language,
    samples,
    averageMs: average,
    minMs: min,
    maxMs: max,
  };
}
