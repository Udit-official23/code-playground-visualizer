// src/lib/types.ts

export type Language = "javascript" | "python";

export interface Playground {
  id: string;
  title: string;
  description?: string;
  language: Language;
  code: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ExecutionRequest {
  code: string;
  language: Language;
  stdin?: string;
  /**
   * Optional algorithm id coming from the Algorithm Library,
   * e.g. "bubble-sort", "merge-sort", etc.
   */
  algoId?: string;
}


export interface TraceVariable {
  name: string;
  value: string;
}

export interface TraceFrame {
  id: string;
  line: number;
  functionName: string;
  locals: TraceVariable[];
}

export interface TraceStep {
  step: number;
  description: string;
  currentLine: number;
  frames: TraceFrame[];
  stdout: string;

  // Optional array visualization data:
  arraySnapshot?: number[];
  highlightedIndices?: number[];
}


export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr?: string;
  durationMs: number;
  trace: TraceStep[];
}

export interface BenchmarkPoint {
  inputSize: number;
  durationMs: number;
}

export interface BenchmarkResult {
  algoId: string;
  language: Language;
  points: BenchmarkPoint[];
}
