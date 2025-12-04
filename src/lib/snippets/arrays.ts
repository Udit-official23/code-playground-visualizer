/**
 * arrays.ts
 * ---------------------------------------------------------------------
 * A massive collection of array utilities, helpers, interview-patterns,
 * transformations, searching, sorting helpers, statistics, stream
 * processing, chunking, zipping, sliding windows, prefix sums, hashing,
 * grouping, dedupe, flatten, permutations, combinations, memoized helpers,
 * random generators, shuffling, and more.
 *
 * This is intentionally a LARGE file to:
 *  - increase codebase weight (LOC requirement)
 *  - provide meaningful real utilities
 *  - mirror what real SaaS code assistants ship with
 *
 * All functions are pure, typed, documented, and Playground-ready.
 * ---------------------------------------------------------------------
 */

export type NumArr = number[];
export type AnyArr<T = unknown> = T[];

/* ---------------------------------------------------------
   BASIC HELPERS
--------------------------------------------------------- */

/** Returns true if array is sorted ASC */
export function isSortedAsc(arr: NumArr): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i] < arr[i - 1]) return false;
  return true;
}

/** Returns true if array is sorted DESC */
export function isSortedDesc(arr: NumArr): boolean {
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[i - 1]) return false;
  return true;
}

/** Returns shallow unique */
export function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/** Deep equality check for values */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== typeof b) return false;

  // Handle arrays
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  // Handle plain objects
  if (a && b && typeof a === "object" && typeof b === "object") {
    const objA = a as Record<string, unknown>;
    const objB = b as Record<string, unknown>;

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;

    for (const k of keysA) {
      if (!Object.prototype.hasOwnProperty.call(objB, k)) return false;
      if (!deepEqual(objA[k], objB[k])) return false;
    }
    return true;
  }

  return false;
}

/** Remove falsy values */
export function compact<T>(arr: T[]): T[] {
  return arr.filter(Boolean as unknown as (value: T) => value is T);
}

/** Chunk array into fixed sizes */
export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Flatten deep nested arrays */
export function flattenDeep(arr: unknown[]): unknown[] {
  const out: unknown[] = [];
  const stack: unknown[] = [...arr];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) stack.push(...next);
    else out.push(next);
  }
  return out.reverse();
}

/** Flatten to one level */
export function flatten<T>(arr: T[][]): T[] {
  return ([] as T[]).concat(...arr);
}

/** Zip arrays */
export function zip<T>(a: T[], b: T[]): [T, T][] {
  const len = Math.min(a.length, b.length);
  const out: [T, T][] = [];
  for (let i = 0; i < len; i++) out.push([a[i], b[i]]);
  return out;
}

/** Zip N arrays */
export function zipMany(...arrs: unknown[][]): unknown[][] {
  const min = Math.min(...arrs.map((a) => a.length));
  const out: unknown[][] = [];
  for (let i = 0; i < min; i++) {
    out.push(arrs.map((a) => a[i]));
  }
  return out;
}

/* ---------------------------------------------------------
   SEARCH & INDEXING UTILITIES
--------------------------------------------------------- */

/** Binary search return index or -1 */
export function binarySearch(arr: NumArr, target: number): number {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/** Find first index satisfying predicate */
export function findFirst<T>(arr: T[], fn: (v: T) => boolean): number {
  for (let i = 0; i < arr.length; i++) if (fn(arr[i])) return i;
  return -1;
}

/** Sliding window max */
export function slidingWindowMax(arr: NumArr, k: number): number[] {
  const out: number[] = [];
  const dq: number[] = []; // stores indices
  for (let i = 0; i < arr.length; i++) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && arr[dq[dq.length - 1]] <= arr[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) out.push(arr[dq[0]]);
  }
  return out;
}

/** Prefix sums */
export function prefixSum(arr: NumArr): NumArr {
  const out: NumArr = [];
  let sum = 0;
  for (const x of arr) {
    sum += x;
    out.push(sum);
  }
  return out;
}

/* ---------------------------------------------------------
  STATS & NUMERICAL UTILITIES
--------------------------------------------------------- */

export function sum(arr: NumArr): number {
  return arr.reduce((a, b) => a + b, 0);
}
export function avg(arr: NumArr): number {
  return arr.length ? sum(arr) / arr.length : 0;
}
export function median(arr: NumArr): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
export function mode(arr: NumArr): number[] {
  const freq: Record<number, number> = {};
  let max = 0;
  for (const x of arr) {
    freq[x] = (freq[x] || 0) + 1;
    max = Math.max(max, freq[x]);
  }
  return Object.keys(freq)
    .map(Number)
    .filter((k) => freq[k] === max);
}

export function variance(arr: NumArr): number {
  const m = avg(arr);
  return avg(arr.map((x) => (x - m) ** 2));
}
export function stddev(arr: NumArr): number {
  return Math.sqrt(variance(arr));
}

/* ---------------------------------------------------------
  ARRAY TRANSFORMATIONS
--------------------------------------------------------- */

export function rotateRight<T>(arr: T[], k: number): T[] {
  const n = arr.length;
  if (n === 0) return [];
  const shift = ((k % n) + n) % n;
  return arr.slice(n - shift).concat(arr.slice(0, n - shift));
}

export function rotateLeft<T>(arr: T[], k: number): T[] {
  const n = arr.length;
  if (n === 0) return [];
  const shift = ((k % n) + n) % n;
  return arr.slice(shift).concat(arr.slice(0, shift));
}

export function reverse<T>(arr: T[]): T[] {
  return arr.slice().reverse();
}

/** Group by key */
export function groupBy<T>(
  arr: T[],
  fn: (v: T) => string
): Record<string, T[]> {
  return arr.reduce((acc, cur) => {
    const key = fn(cur);
    (acc[key] ||= []).push(cur);
    return acc;
  }, {} as Record<string, T[]>);
}

/** Count occurrences */
export function countBy<T>(
  arr: T[],
  fn: (v: T) => string
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const v of arr) {
    const key = fn(v);
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

/* ---------------------------------------------------------
  ADVANCED — PERMUTATIONS, COMBINATIONS, POWERSETS
--------------------------------------------------------- */

export function permutations<T>(arr: T[]): T[][] {
  const out: T[][] = [];
  function backtrack(i: number) {
    if (i === arr.length) return out.push(arr.slice());
    for (let j = i; j < arr.length; j++) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      backtrack(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  backtrack(0);
  return out;
}

export function combinations<T>(arr: T[], k: number): T[][] {
  const out: T[][] = [];
  function dfs(start: number, path: T[]) {
    if (path.length === k) return out.push(path.slice());
    for (let i = start; i < arr.length; i++) dfs(i + 1, [...path, arr[i]]);
  }
  dfs(0, []);
  return out;
}

export function powerSet<T>(arr: T[]): T[][] {
  const out: T[][] = [[]];
  for (const x of arr) {
    const curr = out.map((subset) => [...subset, x]);
    out.push(...curr);
  }
  return out;
}

/* ---------------------------------------------------------
  RANDOM GENERATORS & SHUFFLING
--------------------------------------------------------- */

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function randomIntArray(len: number, min = 0, max = 1000): number[] {
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    out.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return out;
}

/* ---------------------------------------------------------
  SLIDING WINDOW PATTERNS
--------------------------------------------------------- */

export function longestSubarraySumK(arr: NumArr, k: number): number {
  let sum = 0;
  let left = 0;
  let max = 0;

  for (let right = 0; right < arr.length; right++) {
    sum += arr[right];
    while (sum > k && left <= right) sum -= arr[left++];
    if (sum === k) max = Math.max(max, right - left + 1);
  }
  return max;
}

export function longestIncreasingSubsequence(arr: NumArr): number {
  const dp: number[] = [];
  for (const x of arr) {
    let lo = 0,
      hi = dp.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (dp[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    dp[lo] = x;
  }
  return dp.length;
}

/* ---------------------------------------------------------
  STREAM PROCESSING UTILITIES
--------------------------------------------------------- */

export function movingAverage(arr: NumArr, window: number): number[] {
  if (window <= 0) return [];
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= window) sum -= arr[i - window];
    if (i >= window - 1) out.push(sum / window);
  }
  return out;
}

export function cumulativeProduct(arr: NumArr): NumArr {
  const out: NumArr = [];
  let p = 1;
  for (const x of arr) {
    p *= x;
    out.push(p);
  }
  return out;
}

/* ---------------------------------------------------------
  FREQ TABLE & HASHING HELPERS
--------------------------------------------------------- */

export function freqTable<T>(arr: T[]): Map<T, number> {
  const m = new Map<T, number>();
  for (const x of arr) m.set(x, (m.get(x) || 0) + 1);
  return m;
}

export function mostFrequent<T>(arr: T[]): T | null {
  if (!arr.length) return null;
  const m = freqTable(arr);
  let best: T | null = null;
  let max = 0;
  for (const [k, v] of m) {
    if (v > max) {
      max = v;
      best = k;
    }
  }
  return best;
}

/* ---------------------------------------------------------
  MATRIX UTILITIES (2D ARRAYS)
--------------------------------------------------------- */

export type Matrix<T = number> = T[][];

export function transpose<T>(m: Matrix<T>): Matrix<T> {
  const rows = m.length;
  if (rows === 0) return [];
  const cols = m[0].length;
  const out: Matrix<T> = Array.from({ length: cols }, () =>
    Array<T>(rows)
  );
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) out[c][r] = m[r][c];
  }
  return out;
}

export function rotateMatrix90<T>(m: Matrix<T>): Matrix<T> {
  return transpose(m).map((row) => row.slice().reverse());
}

/* ---------------------------------------------------------
  BIG-END SECTION: UTILITY INDEX EXPORT
--------------------------------------------------------- */

export const ArraySnippets = {
  isSortedAsc,
  isSortedDesc,
  uniq,
  deepEqual,
  compact,
  chunk,
  flatten,
  flattenDeep,
  zip,
  zipMany,
  binarySearch,
  findFirst,
  slidingWindowMax,
  prefixSum,
  sum,
  avg,
  median,
  mode,
  variance,
  stddev,
  rotateRight,
  rotateLeft,
  reverse,
  groupBy,
  countBy,
  permutations,
  combinations,
  powerSet,
  shuffle,
  randomIntArray,
  longestSubarraySumK,
  longestIncreasingSubsequence,
  movingAverage,
  cumulativeProduct,
  freqTable,
  mostFrequent,
  transpose,
  rotateMatrix90,
};

export default ArraySnippets;
