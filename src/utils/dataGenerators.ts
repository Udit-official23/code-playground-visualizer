// src/lib/utils/dataGenerators.ts

/**
 * Deterministic, reusable data generators to support:
 * - Algorithm benchmarks
 * - Playground sample inputs
 * - Demo / documentation examples
 *
 * These helpers avoid random global state and are safe for both
 * client and server usage.
 */

export interface RandomOptions {
  /** Seed value for deterministic pseudo-random generation. */
  seed?: number;
}

/**
 * Simple pseudo-random number generator (Linear Congruential Generator).
 * This is not cryptographically secure but is perfectly fine for demos
 * and benchmarks where reproducibility matters more than security.
 */
export class LCG {
  private state: number;

  constructor(seed: number = Date.now()) {
    this.state = seed >>> 0;
  }

  /** Returns a float in [0, 1). */
  next(): number {
    // Constants from Numerical Recipes.
    this.state = (1664525 * this.state + 1013904223) >>> 0;
    return this.state / 0xffffffff;
  }

  /** Returns an integer in [min, max] inclusive. */
  nextInt(min: number, max: number): number {
    const r = this.next();
    return Math.floor(min + r * (max - min + 1));
  }
}

/**
 * Generates an array of random integers within a given inclusive range.
 */
export function generateRandomIntArray(
  length: number,
  min: number,
  max: number,
  options: RandomOptions = {}
): number[] {
  const rng = new LCG(options.seed);
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(rng.nextInt(min, max));
  }
  return result;
}

/**
 * Generates an array that is already sorted in ascending order.
 */
export function generateSortedArray(length: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    result.push(i);
  }
  return result;
}

/**
 * Generates an array sorted in descending order.
 * Useful for testing worst-case scenarios in some algorithms.
 */
export function generateReverseSortedArray(length: number): number[] {
  const result: number[] = [];
  for (let i = length - 1; i >= 0; i--) {
    result.push(i);
  }
  return result;
}

/**
 * Generates an array that is 'almost' sorted: a sorted array with a small
 * number of random swaps applied.
 */
export function generateNearlySortedArray(
  length: number,
  swapCount: number,
  options: RandomOptions = {}
): number[] {
  const arr = generateSortedArray(length);
  const rng = new LCG(options.seed);

  const actualSwaps = Math.min(swapCount, Math.floor(length / 2));
  for (let i = 0; i < actualSwaps; i++) {
    const a = rng.nextInt(0, length - 1);
    const b = rng.nextInt(0, length - 1);
    const tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;
  }

  return arr;
}

/**
 * Grid helper types and generators.
 */

export type GridCell<T> = {
  row: number;
  col: number;
  value: T;
};

export type Grid<T> = T[][];

/**
 * Generates a 2D grid with the given dimensions and a callback
 * that computes each cell's value.
 */
export function generateGrid<T>(
  rows: number,
  cols: number,
  fn: (cell: GridCell<null>) => T
): Grid<T> {
  const grid: Grid<T> = [];
  for (let r = 0; r < rows; r++) {
    const row: T[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(fn({ row: r, col: c, value: null }));
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Generates a binary grid of '0' and '1' characters representing
 * water and land respectively, useful for graph/DFS problems.
 */
export function generateIslandGrid(
  rows: number,
  cols: number,
  landProbability: number = 0.4,
  options: RandomOptions = {}
): Grid<string> {
  const rng = new LCG(options.seed);
  return generateGrid(rows, cols, ({}) => (rng.next() < landProbability ? "1" : "0"));
}

/**
 * Simple adjacency-list graph type.
 */
export type AdjacencyList = Record<string, string[]>;

/**
 * Generates an undirected simple graph with `nodeCount` labeled
 * nodes (0..nodeCount-1) and edges added with the given probability.
 *
 * This is essentially an Erdős–Rényi G(n, p) random graph, used here
 * only for testing and visualization.
 */
export function generateRandomGraph(
  nodeCount: number,
  edgeProbability: number = 0.2,
  options: RandomOptions = {}
): AdjacencyList {
  const rng = new LCG(options.seed);
  const graph: AdjacencyList = {};

  for (let i = 0; i < nodeCount; i++) {
    graph[String(i)] = [];
  }

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (rng.next() < edgeProbability) {
        graph[String(i)].push(String(j));
        graph[String(j)].push(String(i));
      }
    }
  }

  return graph;
}

/**
 * Generates a simple binary tree represented as an array,
 * where index 0 is the root, index 1 is the left child, index 2 is the right child, etc.
 *
 * This representation is convenient for heap / tree visualizations.
 */
export function generateCompleteBinaryTreeValues(
  nodeCount: number
): number[] {
  const values: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    values.push(i + 1);
  }
  return values;
}
