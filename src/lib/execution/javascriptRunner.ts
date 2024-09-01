// src/lib/execution/javascriptRunner.ts
import vm from "node:vm";
import type { ExecutionResult, TraceStep } from "../types";

const MAX_EXECUTION_MS = 1000;

function formatValue(value: unknown): string {
  try {
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const DEFAULT_TRACE_INPUT = [5, 1, 4, 2, 8];

const DEFAULT_BINARY_SEARCH_INPUT = [1, 3, 5, 7, 9, 11];
const DEFAULT_BINARY_TARGET = 7;

const DEFAULT_BFS_GRAPH: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3],
  2: [0, 3],
  3: [1, 2, 4],
  4: [3],
};
const DEFAULT_BFS_START = 0;

// ---------- Bubble Sort Trace ----------

function generateBubbleSortTrace(input: number[]): TraceStep[] {
  const arr = [...input];
  const trace: TraceStep[] = [];
  let step = 1;
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      trace.push({
        step: step++,
        description: `Compare arr[${j}] = ${arr[j]} and arr[${
          j + 1
        }] = ${arr[j + 1]}`,
        currentLine: 4, // approximate line number for comparison
        frames: [],
        stdout: "",
        arraySnapshot: [...arr],
        highlightedIndices: [j, j + 1],
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Swap step
        trace.push({
          step: step++,
          description: `Swap indices ${j} and ${j + 1}`,
          currentLine: 6, // approximate line number for swap
          frames: [],
          stdout: "",
          arraySnapshot: [...arr],
          highlightedIndices: [j, j + 1],
        });
      }
    }

    // End of outer loop iteration
    trace.push({
      step: step++,
      description: `End of outer loop iteration i = ${i}`,
      currentLine: 2,
      frames: [],
      stdout: "",
      arraySnapshot: [...arr],
      highlightedIndices: [],
    });
  }

  trace.push({
    step: step++,
    description: "Array fully sorted.",
    currentLine: 0,
    frames: [],
    stdout: "",
    arraySnapshot: [...arr],
    highlightedIndices: [],
  });

  return trace;
}

// ---------- Binary Search Trace ----------

function generateBinarySearchTrace(
  arrInput: number[],
  target: number
): TraceStep[] {
  const arr = [...arrInput];
  const trace: TraceStep[] = [];
  let step = 1;

  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midVal = arr[mid];

    trace.push({
      step: step++,
      description: `lo = ${lo}, hi = ${hi}, mid = ${mid}, arr[mid] = ${midVal}`,
      currentLine: 5, // approximate line where mid is calculated
      frames: [],
      stdout: "",
      arraySnapshot: [...arr],
      highlightedIndices: [lo, mid, hi],
    });

    if (midVal === target) {
      trace.push({
        step: step++,
        description: `Found target ${target} at index ${mid}.`,
        currentLine: 9, // return mid
        frames: [],
        stdout: "",
        arraySnapshot: [...arr],
        highlightedIndices: [mid],
      });
      return trace;
    }

    if (midVal < target) {
      trace.push({
        step: step++,
        description: `arr[mid] < target → move lo to mid + 1 (${mid + 1}).`,
        currentLine: 11,
        frames: [],
        stdout: "",
        arraySnapshot: [...arr],
        highlightedIndices: [mid],
      });
      lo = mid + 1;
    } else {
      trace.push({
        step: step++,
        description: `arr[mid] > target → move hi to mid - 1 (${mid - 1}).`,
        currentLine: 13,
        frames: [],
        stdout: "",
        arraySnapshot: [...arr],
        highlightedIndices: [mid],
      });
      hi = mid - 1;
    }
  }

  trace.push({
    step: step++,
    description: `Target ${target} not found. Returning -1.`,
    currentLine: 17, // return -1
    frames: [],
    stdout: "",
    arraySnapshot: [...arr],
    highlightedIndices: [],
  });

  return trace;
}

// ---------- BFS Trace (Queue Visualized) ----------

function generateBfsTrace(
  graph: Record<number, number[]>,
  start: number
): TraceStep[] {
  const trace: TraceStep[] = [];
  let step = 1;

  const visited = new Set<number>();
  const queue: number[] = [];

  visited.add(start);
  queue.push(start);

  // Initial queue state
  trace.push({
    step: step++,
    description: `Start BFS from node ${start}. Enqueue ${start}.`,
    currentLine: 1,
    frames: [],
    stdout: "",
    arraySnapshot: [...queue],
    highlightedIndices: [0],
  });

  while (queue.length > 0) {
    // Dequeue step
    trace.push({
      step: step++,
      description: `Dequeue node ${queue[0]} from queue.`,
      currentLine: 5,
      frames: [],
      stdout: "",
      arraySnapshot: [...queue],
      highlightedIndices: [0],
    });

    const node = queue.shift() as number; // safe because length > 0

    trace.push({
      step: step++,
      description: `Visit node ${node}.`,
      currentLine: 6,
      frames: [],
      stdout: "",
      arraySnapshot: [node],
      highlightedIndices: [0],
    });

    const neighbors = graph[node] ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        trace.push({
          step: step++,
          description: `Discover neighbor ${neighbor} of node ${node}. Enqueue ${neighbor}.`,
          currentLine: 8,
          frames: [],
          stdout: "",
          arraySnapshot: [...queue],
          highlightedIndices: [queue.length - 1],
        });
      }
    }

    trace.push({
      step: step++,
      description: `Queue after processing node ${node}: [${queue.join(", ")}].`,
      currentLine: 10,
      frames: [],
      stdout: "",
      arraySnapshot: [...queue],
      highlightedIndices: [],
    });
  }

  trace.push({
    step: step++,
    description: "BFS complete. Queue is empty and all reachable nodes visited.",
    currentLine: 12,
    frames: [],
    stdout: "",
    arraySnapshot: [],
    highlightedIndices: [],
  });

  return trace;
}

// ---------- Runner ----------

export async function runJavascript(
  code: string,
  algoId?: string
): Promise<ExecutionResult> {
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];

  const sandbox: Record<string, unknown> = {
    console: {
      log: (...args: unknown[]) => {
        stdoutLines.push(args.map(formatValue).join(" "));
      },
      error: (...args: unknown[]) => {
        stderrLines.push(args.map(formatValue).join(" "));
      },
      warn: (...args: unknown[]) => {
        stderrLines.push(args.map(formatValue).join(" "));
      },
    },
  };

  // Minimal globals – intentionally restricted:
  sandbox.global = sandbox;

  const context = vm.createContext(sandbox);

  const script = new vm.Script(code, {
    filename: "user-code.js",
  });

  const start = Date.now();

  try {
    script.runInContext(context, {
      timeout: MAX_EXECUTION_MS,
    });

    const durationMs = Date.now() - start;

    let trace: TraceStep[] = [];

    // Generate detailed traces for specific algorithms
    if (algoId === "bubble-sort") {
      trace = generateBubbleSortTrace(DEFAULT_TRACE_INPUT);
    } else if (algoId === "binary-search") {
      trace = generateBinarySearchTrace(
        DEFAULT_BINARY_SEARCH_INPUT,
        DEFAULT_BINARY_TARGET
      );
    } else if (algoId === "bfs") {
      trace = generateBfsTrace(DEFAULT_BFS_GRAPH, DEFAULT_BFS_START);
    }

    const result: ExecutionResult = {
      success: true,
      stdout: stdoutLines.join("\n"),
      stderr: stderrLines.join("\n"),
      durationMs,
      trace,
    };

    return result;
  } catch (error) {
    const durationMs = Date.now() - start;

    const errMessage =
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);

    const result: ExecutionResult = {
      success: false,
      stdout: stdoutLines.join("\n"),
      stderr: stderrLines.concat(errMessage).join("\n"),
      durationMs,
      trace: [],
    };

    return result;
  }
}
