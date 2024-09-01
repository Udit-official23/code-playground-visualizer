// src/lib/utils/benchmarks.ts

/**
 * Small, framework-agnostic benchmarking helpers.
 *
 * These utilities are intentionally generic so they can be used by:
 * - The playground performance panel
 * - Future CLI scripts
 * - Unit tests or demo notebooks
 *
 * They do not depend on Node-only APIs, so they are safe in both
 * browser and server environments.
 */

/** Single measurement for a specific input size. */
export interface BenchmarkPoint {
  /** Abstract input size, e.g. n for an array of length n. */
  inputSize: number;
  /** How many iterations were executed for this size. */
  iterations: number;
  /** Total duration for all iterations in milliseconds. */
  durationMs: number;
}

/** Aggregated result over a series of benchmark points. */
export interface BenchmarkResult {
  /** Human-readable label for the benchmark (e.g. algorithm id). */
  label: string;
  /** Individual measurements for each input size. */
  points: BenchmarkPoint[];
  /** Total iterations across all points. */
  totalIterations: number;
  /** Total time spent across all points. */
  totalDurationMs: number;
  /** Minimum average duration per iteration among points. */
  minAvgDurationMs: number;
  /** Maximum average duration per iteration among points. */
  maxAvgDurationMs: number;
}

/** Tuning knobs for the benchmark runner. */
export interface BenchmarkOptions {
  /**
   * How many warm-up iterations to run before measuring.
   * Warm-up iterations are not included in the result.
   */
  warmupIterations?: number;
  /**
   * Minimum total duration per input size.
   * The runner will keep increasing the iterations count until
   * this threshold is exceeded or maxIterations is reached.
   */
  minDurationMs?: number;
  /**
   * Maximum iterations per input size. Acts as a safety guard.
   */
  maxIterations?: number;
}

/**
 * Internal: portable high-resolution timer.
 * Falls back to Date.now() when performance.now() is unavailable.
 */
function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

/**
 * Benchmarks a synchronous function across multiple input sizes.
 *
 * @param label   Human-readable label identifying the benchmark.
 * @param fn      Pure (or at least deterministic) function to measure.
 * @param makeInput Function that produces an input object for a given size.
 * @param inputSizes List of abstract sizes (e.g. [10, 100, 1000]).
 * @param options Optional tuning knobs.
 */
export function runBenchmarkOverInputSizes<TInput>(
  label: string,
  fn: (input: TInput) => unknown,
  makeInput: (size: number) => TInput,
  inputSizes: number[],
  options: BenchmarkOptions = {}
): BenchmarkResult {
  const warmupIterations = options.warmupIterations ?? 3;
  const minDurationMs = options.minDurationMs ?? 8; // small but non-trivial
  const maxIterations = options.maxIterations ?? 1_000;

  const points: BenchmarkPoint[] = [];

  for (const size of inputSizes) {
    const input = makeInput(size);

    // Warm-up phase: run a few times without recording timing.
    for (let i = 0; i < warmupIterations; i++) {
      fn(input);
    }

    // Measurement phase.
    let iterations = 0;
    let start = nowMs();
    let elapsed = 0;

    while (elapsed < minDurationMs && iterations < maxIterations) {
      fn(input);
      iterations += 1;
      elapsed = nowMs() - start;
    }

    if (iterations === 0) {
      // Extremely fast function or minDurationMs == 0.
      iterations = 1;
      start = nowMs();
      fn(input);
      elapsed = nowMs() - start;
    }

    points.push({
      inputSize: size,
      iterations,
      durationMs: elapsed,
    });
  }

  // Aggregate statistics.
  let totalIterations = 0;
  let totalDurationMs = 0;
  let minAvg = Number.POSITIVE_INFINITY;
  let maxAvg = 0;

  for (const p of points) {
    totalIterations += p.iterations;
    totalDurationMs += p.durationMs;

    const avg = p.durationMs / p.iterations;
    if (avg < minAvg) minAvg = avg;
    if (avg > maxAvg) maxAvg = avg;
  }

  if (!isFinite(minAvg)) {
    minAvg = 0;
  }

  return {
    label,
    points,
    totalIterations,
    totalDurationMs,
    minAvgDurationMs: minAvg,
    maxAvgDurationMs: maxAvg,
  };
}

/**
 * Convenience helper: benchmark a function for powers of two
 * (e.g. 2^3, 2^4, ..., 2^k).
 */
export function benchmarkPowersOfTwo<TInput>(
  label: string,
  fn: (input: TInput) => unknown,
  makeInput: (size: number) => TInput,
  options: {
    /** Minimum exponent (inclusive). Default: 3 → size 8. */
    minExponent?: number;
    /** Maximum exponent (inclusive). Default: 12 → size 4096. */
    maxExponent?: number;
    runnerOptions?: BenchmarkOptions;
  } = {}
): BenchmarkResult {
  const minExp = options.minExponent ?? 3;
  const maxExp = options.maxExponent ?? 12;

  const inputSizes: number[] = [];
  for (let e = minExp; e <= maxExp; e++) {
    inputSizes.push(2 ** e);
  }

  return runBenchmarkOverInputSizes(label, fn, makeInput, inputSizes, options.runnerOptions);
}
