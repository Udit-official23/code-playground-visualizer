// src/app/api/benchmark/route.ts
import { NextRequest, NextResponse } from "next/server";
import { performance } from "node:perf_hooks";

type SupportedLanguage = "javascript" | "python";

export type BenchmarkPoint = {
  inputSize: number;
  durationMs: number;
};

export type BenchmarkResult = {
  algorithmId: string;
  language: SupportedLanguage;
  createdAt: string;
  points: BenchmarkPoint[];
  notes?: string;
};

type BenchmarkRequestBody = {
  algorithmId: string;
  language: SupportedLanguage;
};

type BenchmarkResponseBody =
  | {
      ok: true;
      result: BenchmarkResult;
    }
  | {
      ok: false;
      error: string;
      details?: unknown;
    };

function jsonError(
  message: string,
  status = 400,
  details?: unknown
): NextResponse<BenchmarkResponseBody> {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      details,
    },
    { status }
  );
}

// Simple in-file bubble sort implementation for benchmarking.
function bubbleSort(arr: number[]): void {
  const n = arr.length;
  let swapped: boolean;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}

async function benchmarkBubbleSort(
  sizes: number[],
  iterationsPerSize: number
): Promise<BenchmarkPoint[]> {
  const points: BenchmarkPoint[] = [];

  for (const size of sizes) {
    const samples: number[] = [];

    for (let run = 0; run < iterationsPerSize; run++) {
      const arr: number[] = Array.from({ length: size }, () =>
        Math.floor(Math.random() * size * 10)
      );

      const start = performance.now();
      bubbleSort(arr);
      const end = performance.now();

      samples.push(end - start);
    }

    const average =
      samples.reduce((sum, value) => sum + value, 0) / samples.length;

    points.push({
      inputSize: size,
      durationMs: average,
    });
  }

  return points;
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<BenchmarkResponseBody>> {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (typeof body !== "object" || body === null) {
    return jsonError("Request body must be a JSON object.", 400);
  }

  const { algorithmId, language } = body as Partial<BenchmarkRequestBody>;

  if (!algorithmId || typeof algorithmId !== "string") {
    return jsonError(
      "Field 'algorithmId' is required and must be a string.",
      400
    );
  }

  if (language !== "javascript" && language !== "python") {
    return jsonError(
      "Field 'language' must be either 'javascript' or 'python'.",
      400
    );
  }

  // Currently we only implement real benchmarks for Bubble Sort in JavaScript.
  if (!(language === "javascript" && algorithmId === "bubble-sort")) {
    const result: BenchmarkResult = {
      algorithmId,
      language,
      createdAt: new Date().toISOString(),
      points: [],
      notes:
        "Benchmarks are only implemented for bubble-sort in JavaScript. " +
        "Other algorithms/languages currently return an empty dataset.",
    };

    return NextResponse.json(
      {
        ok: true,
        result,
      },
      { status: 200 }
    );
  }

  // Run real benchmarks.
  const sizes = [32, 64, 128, 256, 512, 1024];
  const iterationsPerSize = 5;

  try {
    const points = await benchmarkBubbleSort(sizes, iterationsPerSize);

    const result: BenchmarkResult = {
      algorithmId,
      language,
      createdAt: new Date().toISOString(),
      points,
      notes:
        "Simple in-process benchmark using a naive bubble sort implementation.",
    };

    return NextResponse.json(
      {
        ok: true,
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error while running benchmark.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
        details: { algorithmId, language },
      },
      { status: 500 }
    );
  }
}
