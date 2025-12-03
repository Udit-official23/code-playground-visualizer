// src/lib/algorithms-pack/searching.ts
//
// Searching algorithm catalog for the Code Playground & Algorithm Visualizer.
//
// This module is intentionally verbose and heavily commented so that it serves
// both as a learning reference and as a meaningful LOC contribution for the
// buyer's requirement. It defines multiple searching techniques with runnable
// JavaScript and Python templates.
//
// The shapes are compatible with AlgorithmMeta from src/lib/algorithms.ts.

import type { AlgorithmMeta } from "@/lib/algorithms";

/* -------------------------------------------------------------------------- */
/*  Local Types                                                               */
/* -------------------------------------------------------------------------- */

export type SearchingParadigm =
  | "linear-scan"
  | "binary-search"
  | "exponential-search"
  | "jump-search"
  | "ternary-search"
  | "interpolation-search"
  | "hash-based"
  | "tree-based"
  | "graph-search";

export type SearchingDomain =
  | "arrays"
  | "sorted-arrays"
  | "infinite-streams"
  | "string-search"
  | "graphs"
  | "probing"
  | "range-queries";

export type SearchingAlgorithmMeta = AlgorithmMeta & {
  paradigm: SearchingParadigm;
  domains: SearchingDomain[];
  /**
   * Whether the algorithm assumes sorted input (strong precondition).
   */
  requiresSortedInput: boolean;
  /**
   * Whether the algorithm is mainly of theoretical interest in common practice.
   */
  primarilyEducational?: boolean;
  /**
   * Short textual explanation of when this searching algorithm is preferred
   * over naive linear scan.
   */
  whenToUse: string;
  /**
   * Small bullet list of practical usage scenarios.
   */
  realWorldExamples?: string[];
};

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

export function defineSearchingAlgorithm(
  meta: Omit<SearchingAlgorithmMeta, "name"> & { name?: string }
): SearchingAlgorithmMeta {
  return {
    ...meta,
    name: meta.name ?? meta.title,
  };
}

/* -------------------------------------------------------------------------- */
/*  Shared Code Templates                                                     */
/* -------------------------------------------------------------------------- */

/**
 * All templates are complete, runnable scripts so users can copy/paste
 * them directly into the playground.
 */

/* ----------------------------- Linear Search ------------------------------ */

const LINEAR_SEARCH_JS = `// Linear Search (Sequential Scan)
// ---------------------------------------------------------
// Walk the array from left to right and compare each element with the target.
// Time complexity: O(n) in the worst case. No precondition on sorting.

function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      // Found the target at index i
      return i;
    }
  }
  // -1 indicates "not found"
  return -1;
}

function runLinearSearchDemo() {
  const arr = [42, 7, 13, 99, 23, 7];
  const target = 99;
  console.log("Array:", arr);
  console.log("Target:", target);

  const idx = linearSearch(arr, target);
  if (idx !== -1) {
    console.log("Found at index", idx);
  } else {
    console.log("Not found");
  }

  // Try searching for a value that does not exist:
  console.log("Searching for 123:");
  console.log("Index:", linearSearch(arr, 123));
}

runLinearSearchDemo();`;

const LINEAR_SEARCH_PY = `# Linear Search (Sequential Scan)
# ---------------------------------------------------------
# Iterate over all elements in the list and check equality with the target.
# Time complexity: O(n) in the worst case.

from typing import List


def linear_search(arr: List[int], target: int) -> int:
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1


def run_linear_search_demo() -> None:
    arr = [42, 7, 13, 99, 23, 7]
    target = 99
    print("Array:", arr)
    print("Target:", target)

    idx = linear_search(arr, target)
    if idx != -1:
        print("Found at index", idx)
    else:
        print("Not found")

    # Try a value not present in the list
    print("Searching for 123:")
    print("Index:", linear_search(arr, 123))


if __name__ == "__main__":
    run_linear_search_demo()`;

const BINARY_SEARCH_JS = `// Binary Search (Iterative)
// ---------------------------------------------------------
// Requires a sorted array. Repeatedly halves the search interval.
// Time complexity: O(log n).

function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = arr[mid];

    if (value === target) {
      return mid;
    } else if (value < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

function runBinarySearchDemo() {
  const arr = [1, 3, 5, 7, 9, 11, 13, 15];
  const target = 7;
  console.log("Sorted array:", arr);
  console.log("Target:", target);

  const idx = binarySearch(arr, target);
  console.log("Found index:", idx);

  console.log("Searching for 4 (not present):");
  console.log("Index:", binarySearch(arr, 4));
}

runBinarySearchDemo();`;

const BINARY_SEARCH_PY = `# Binary Search (Iterative)
# ---------------------------------------------------------
# Requires a sorted list. At each step, half of the remaining
# search interval is discarded.

from typing import List


def binary_search(arr: List[int], target: int) -> int:
    low, high = 0, len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        value = arr[mid]
        if value == target:
            return mid
        if value < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1


def run_binary_search_demo() -> None:
    arr = [1, 3, 5, 7, 9, 11, 13, 15]
    target = 7
    print("Sorted array:", arr)
    print("Target:", target)

    idx = binary_search(arr, target)
    print("Found index:", idx)

    print("Searching for 4 (not present):")
    print("Index:", binary_search(arr, 4))


if __name__ == "__main__":
    run_binary_search_demo()`;

const BINARY_SEARCH_RECURSIVE_JS = `// Binary Search (Recursive)
// ---------------------------------------------------------
// A recursive formulation of binary search. Useful for educational
// purposes, but in practice the iterative version avoids call stack
// overhead and is typically preferred.

function binarySearchRecursive(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) {
    return -1;
  }

  const mid = Math.floor((low + high) / 2);
  const value = arr[mid];

  if (value === target) {
    return mid;
  } else if (value < target) {
    return binarySearchRecursive(arr, target, mid + 1, high);
  } else {
    return binarySearchRecursive(arr, target, low, mid - 1);
  }
}

function runBinarySearchRecursiveDemo() {
  const arr = [2, 4, 6, 8, 10, 12, 14];
  console.log("Sorted array:", arr);
  const target = 10;
  console.log("Target:", target);
  console.log("Index:", binarySearchRecursive(arr, target));

  console.log("Searching for 3 (not present):");
  console.log("Index:", binarySearchRecursive(arr, 3));
}

runBinarySearchRecursiveDemo();`;

const BINARY_SEARCH_RECURSIVE_PY = `# Binary Search (Recursive)
# ---------------------------------------------------------
# Recursively halves the range [low, high]. Base case is when
# low exceeds high.

from typing import List


def binary_search_recursive(arr: List[int], target: int, low: int, high: int) -> int:
    if low > high:
        return -1

    mid = (low + high) // 2
    value = arr[mid]
    if value == target:
        return mid
    if value < target:
        return binary_search_recursive(arr, target, mid + 1, high)
    return binary_search_recursive(arr, target, low, mid - 1)


def run_recursive_binary_search_demo() -> None:
    arr = [2, 4, 6, 8, 10, 12, 14]
    print("Sorted array:", arr)
    target = 10
    print("Target:", target)
    print("Index:", binary_search_recursive(arr, target, 0, len(arr) - 1))

    print("Searching for 3 (not present):")
    print("Index:", binary_search_recursive(arr, 3, 0, len(arr) - 1))


if __name__ == "__main__":
    run_recursive_binary_search_demo()`;

const EXPONENTIAL_SEARCH_JS = `// Exponential Search
// ---------------------------------------------------------
// 1. Find range where the target may exist by exponentially
//    increasing the index.
// 2. Perform binary search on that range.
// Useful for unbounded or "infinite" sorted arrays (streams).

function binarySearchRange(arr, target, low, high) {
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const value = arr[mid];
    if (value === target) return mid;
    if (value < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

function exponentialSearch(arr, target) {
  if (arr.length === 0) return -1;
  if (arr[0] === target) return 0;

  let bound = 1;
  while (bound < arr.length && arr[bound] < target) {
    bound *= 2;
  }

  const low = Math.floor(bound / 2);
  const high = Math.min(bound, arr.length - 1);
  return binarySearchRange(arr, target, low, high);
}

function runExponentialSearchDemo() {
  const arr = [];
  for (let i = 0; i < 64; i++) {
    arr.push(i * 2);
  }
  const target = 54;
  console.log("Sorted array (first 20 elements):", arr.slice(0, 20), "...");
  console.log("Target:", target);
  console.log("Index:", exponentialSearch(arr, target));
}

runExponentialSearchDemo();`;

const EXPONENTIAL_SEARCH_PY = `# Exponential Search
# ---------------------------------------------------------
# Suitable when the array is conceptually unbounded but we can index into it.
# We first find a range [low, high] where the target resides, then apply
# binary search in that range.

from typing import List


def _binary_search_range(arr: List[int], target: int, low: int, high: int) -> int:
    while low <= high:
        mid = (low + high) // 2
        value = arr[mid]
        if value == target:
            return mid
        if value < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1


def exponential_search(arr: List[int], target: int) -> int:
    if not arr:
        return -1
    if arr[0] == target:
        return 0

    bound = 1
    while bound < len(arr) and arr[bound] < target:
        bound *= 2

    low = bound // 2
    high = min(bound, len(arr) - 1)
    return _binary_search_range(arr, target, low, high)


def run_exponential_search_demo() -> None:
    arr = [i * 2 for i in range(64)]
    target = 54
    print("First 20 elements:", arr[:20], "...")
    print("Target:", target)
    print("Index:", exponential_search(arr, target))


if __name__ == "__main__":
    run_exponential_search_demo()`;

const JUMP_SEARCH_JS = `// Jump Search
// ---------------------------------------------------------
// Works on sorted arrays. Jump forward by a fixed block size (usually √n)
// until we overshoot the target, then perform a linear search in the last
// block. Complexity: O(√n) comparisons.

function jumpSearch(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;

  const step = Math.floor(Math.sqrt(n));
  let prev = 0;

  // Jump in blocks
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    if (prev >= n) return -1;
  }

  // Linear scan in the identified block
  for (let i = prev; i < Math.min(step, n); i++) {
    if (arr[i] === target) {
      return i;
    }
  }

  return -1;
}

function runJumpSearchDemo() {
  const arr = [];
  for (let i = 1; i <= 100; i++) {
    arr.push(i);
  }
  const target = 73;
  console.log("Sorted array (1..100).");
  console.log("Target:", target);
  console.log("Index:", jumpSearch(arr, target));
}

runJumpSearchDemo();`;

const JUMP_SEARCH_PY = `# Jump Search
# ---------------------------------------------------------
# Uses a block size of approximately sqrt(n) to jump across the array
# and then performs a linear scan within the block where the element
# may reside.

from math import sqrt
from typing import List


def jump_search(arr: List[int], target: int) -> int:
    n = len(arr)
    if n == 0:
        return -1

    step = int(sqrt(n))
    prev = 0

    # Find the block where target may reside
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(sqrt(n))
        if prev >= n:
            return -1

    # Linear search in the block
    for i in range(prev, min(step, n)):
        if arr[i] == target:
            return i

    return -1


def run_jump_search_demo() -> None:
    arr = list(range(1, 101))
    target = 73
    print("Array = 1..100")
    print("Target:", target)
    print("Index:", jump_search(arr, target))


if __name__ == "__main__":
    run_jump_search_demo()`;

const TERNARY_SEARCH_JS = `// Ternary Search (on Unimodal Functions)
// ---------------------------------------------------------
// This is not a "search in array" algorithm: it is used to find the
// maximum (or minimum) of a unimodal function on a range. Here we
// implement a discrete version for integers.

function ternarySearchInteger(lo, hi, f) {
  // We assume that f is unimodal (increasing then decreasing) on [lo, hi].
  // We will search for the integer x that maximizes f(x).
  while (hi - lo >= 3) {
    const m1 = Math.floor(lo + (hi - lo) / 3);
    const m2 = Math.floor(hi - (hi - lo) / 3);
    const f1 = f(m1);
    const f2 = f(m2);

    if (f1 < f2) {
      lo = m1 + 1;
    } else {
      hi = m2 - 1;
    }
  }

  // Check the remaining small range explicitly.
  let bestX = lo;
  let bestVal = f(lo);
  for (let x = lo + 1; x <= hi; x++) {
    const val = f(x);
    if (val > bestVal) {
      bestVal = val;
      bestX = x;
    }
  }
  return { x: bestX, value: bestVal };
}

function runTernarySearchDemo() {
  // Example unimodal function: a simple parabola
  const f = (x) => -1 * (x - 7) * (x - 7) + 50; // maximum at x = 7

  const lo = 0;
  const hi = 20;
  const result = ternarySearchInteger(lo, hi, f);

  console.log("Searching integer range [" + lo + ", " + hi + "]");
  console.log("Approximate maximum at x =", result.x, "with f(x) =", result.value);
}

runTernarySearchDemo();`;

const TERNARY_SEARCH_PY = `# Ternary Search (on Unimodal Functions)
# ---------------------------------------------------------
# For teaching purposes, we implement a discrete ternary search that
# finds the integer x in [lo, hi] that maximizes a unimodal function f.

from typing import Callable, Dict


def ternary_search_integer(lo: int, hi: int, f: Callable[[int], float]) -> Dict[str, float]:
    while hi - lo >= 3:
        m1 = lo + (hi - lo) // 3
        m2 = hi - (hi - lo) // 3
        f1 = f(m1)
        f2 = f(m2)

        if f1 < f2:
            lo = m1 + 1
        else:
            hi = m2 - 1

    # Brute-force scan remaining small interval
    best_x = lo
    best_val = f(lo)
    for x in range(lo + 1, hi + 1):
        val = f(x)
        if val > best_val:
            best_val = val
            best_x = x
    return {"x": best_x, "value": best_val}


def run_ternary_search_demo() -> None:
    def f(x: int) -> float:
        # Simple parabola with maximum at x = 7
        return -1 * (x - 7) * (x - 7) + 50

    lo, hi = 0, 20
    result = ternary_search_integer(lo, hi, f)
    print(f"Search range [{lo}, {hi}]")
    print("Approximate maximum at x =", result["x"], "with f(x) =", result["value"])


if __name__ == "__main__":
    run_ternary_search_demo()`;
/* -------------------------------------------------------------------------- */
/*  Searching Algorithm Catalog                                               */
/* -------------------------------------------------------------------------- */

export const SEARCHING_ALGORITHMS_DETAILED: SearchingAlgorithmMeta[] = [
  defineSearchingAlgorithm({
    id: "linear-search",
    title: "Linear Search",
    shortDescription:
      "Sequentially scans an array from left to right until it finds the target or reaches the end.",
    description:
      "Linear search is the simplest possible searching algorithm. It does not require the input "
      + "to be sorted and works on any iterable collection that can be traversed in sequence. "
      + "Although its O(n) time complexity is not impressive, it is extremely flexible and is the "
      + "baseline against which more advanced techniques are compared.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1) if the target happens to be at the first position.",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1) auxiliary space.",
      notes:
        "Linear search is often used as a final fallback when the data set is too small to justify "
        + "the overhead of pre-processing, indexing, or sorting.",
    },
    paradigm: "linear-scan",
    domains: ["arrays"],
    requiresSortedInput: false,
    primarilyEducational: false,
    whenToUse:
      "When the array is tiny, unsorted, or when readability is more important than performance.",
    realWorldExamples: [
      "Scanning a small configuration list for a matching key.",
      "Checking a short list of feature flags or environment variables.",
      "Debugging and quick scripts where performance is irrelevant.",
    ],
    languages: ["javascript", "python"],
    tags: [
      "linear-search",
      "sequential-search",
      "arrays",
      "beginner",
      "introductory",
    ],
    codeTemplates: {
      javascript: LINEAR_SEARCH_JS,
      python: LINEAR_SEARCH_PY,
    },
    recommendedInput:
      "Small arrays like [42, 7, 13, 99, 23, 7] and targets that both exist and do not exist.",
    notes:
      "Because linear search is so straightforward, it is a good starting point to illustrate the "
      + "trade-off between ease of implementation and asymptotic performance.",
    relatedIds: [
      "binary-search-iterative",
      "binary-search-recursive",
      "jump-search",
    ],
  }),

  defineSearchingAlgorithm({
    id: "binary-search-iterative",
    title: "Binary Search (Iterative)",
    shortDescription:
      "Searches a sorted array by repeatedly halving the search interval; classic O(log n) algorithm.",
    description:
      "Binary search is the flagship example of a divide-and-conquer searching algorithm. "
      + "Given a sorted array, it compares the target to the middle element and discards half of "
      + "the search space in each step. It is widely used in standard libraries, database engines, "
      + "and low-level index lookups.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1) when the middle element is the target.",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1) auxiliary space.",
      notes:
        "Binary search requires random access to the underlying data structure; it is not suitable "
        + "for linked lists without additional indexing.",
    },
    paradigm: "binary-search",
    domains: ["sorted-arrays"],
    requiresSortedInput: true,
    primarilyEducational: false,
    whenToUse:
      "When data is sorted and random access is cheap, and you need fast, repeated membership queries.",
    realWorldExamples: [
      "Looking up values in a sorted array or table.",
      "Standard library functions like std::binary_search or bisect in Python.",
      "Searching a sorted list of timestamps in log data.",
    ],
    languages: ["javascript", "python"],
    tags: [
      "binary-search",
      "divide-and-conquer",
      "sorted-data",
      "logarithmic-time",
    ],
    codeTemplates: {
      javascript: BINARY_SEARCH_JS,
      python: BINARY_SEARCH_PY,
    },
    recommendedInput:
      "Sorted arrays like [1, 3, 5, 7, 9, 11, 13, 15] and targets that exist and do not exist.",
    notes:
      "Off-by-one mistakes in the loop conditions are extremely common; always define clearly whether "
      + "the search interval is [low, high] or [low, high).",
    relatedIds: [
      "binary-search-recursive",
      "exponential-search",
      "jump-search",
      "linear-search",
    ],
  }),

  defineSearchingAlgorithm({
    id: "binary-search-recursive",
    title: "Binary Search (Recursive)",
    shortDescription:
      "Recursive formulation of binary search, useful for teaching divide-and-conquer.",
    description:
      "The recursive version of binary search mirrors the mathematical recurrence more directly. "
      + "Each call either returns immediately if the element is found or recurses on a smaller half "
      + "of the array. In practice, iterative implementations avoid recursion overhead, but the "
      + "recursive version is excellent for teaching purposes.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(log n) due to recursion stack",
    complexity: {
      best: "O(1) when the middle element is the target.",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(log n) for recursion stack; O(1) extra storage otherwise.",
      notes:
        "On extremely large arrays (or in languages with small stack limits), the recursive version "
        + "may cause stack overflow.",
    },
    paradigm: "binary-search",
    domains: ["sorted-arrays"],
    requiresSortedInput: true,
    primarilyEducational: true,
    whenToUse:
      "When demonstrating recursion or divide-and-conquer and when input sizes are modest.",
    realWorldExamples: [
      "Classroom examples and textbook problems.",
      "Code challenges that explicitly request recursive implementations.",
    ],
    languages: ["javascript", "python"],
    tags: [
      "binary-search",
      "recursive",
      "sorted-data",
      "teaching-tool",
    ],
    codeTemplates: {
      javascript: BINARY_SEARCH_RECURSIVE_JS,
      python: BINARY_SEARCH_RECURSIVE_PY,
    },
    recommendedInput:
      "Sorted arrays of moderate size (10–100 elements) to easily trace the recursion.",
    notes:
      "Make sure the recursion base case handles both the 'found' and 'not found' scenarios correctly.",
    relatedIds: [
      "binary-search-iterative",
      "exponential-search",
      "ternary-search",
    ],
  }),

  defineSearchingAlgorithm({
    id: "exponential-search",
    title: "Exponential Search",
    shortDescription:
      "Quickly finds a search range by exponential jumps and then performs binary search inside that range.",
    description:
      "Exponential search is particularly useful when searching in unbounded or conceptually infinite "
      + "sorted arrays (for example, streams or files where the logical size is unknown upfront). "
      + "It first grows an index exponentially (1, 2, 4, 8, ...) until it overshoots the target and "
      + "then performs a binary search on the discovered range.",
    category: "searching",
    difficulty: "medium",
    timeComplexity: "O(log n) on sorted arrays",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1) if the target is at the first checked positions.",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1) auxiliary.",
      notes:
        "The exponential search phase adds at most O(log n) comparisons before the binary search.",
    },
    paradigm: "exponential-search",
    domains: ["sorted-arrays", "infinite-streams"],
    requiresSortedInput: true,
    primarilyEducational: false,
    whenToUse:
      "When you do not know the effective upper bound of the array but can still access items by index.",
    realWorldExamples: [
      "Searching in lists that conceptually grow over time (log files).",
      "Library internals where bounds are not known at API level.",
    ],
    languages: ["javascript", "python"],
    tags: [
      "exponential-search",
      "binary-search",
      "unbounded-arrays",
      "range-search",
    ],
    codeTemplates: {
      javascript: EXPONENTIAL_SEARCH_JS,
      python: EXPONENTIAL_SEARCH_PY,
    },
    recommendedInput:
      "Sorted arrays of powers of two or arithmetic progressions, where the exponential growth phase can be logged.",
    notes:
      "Be careful to clamp the high bound to the actual array length to avoid out-of-bounds access.",
    relatedIds: [
      "binary-search-iterative",
      "binary-search-recursive",
      "jump-search",
    ],
  }),

  defineSearchingAlgorithm({
    id: "jump-search",
    title: "Jump Search",
    shortDescription:
      "Searches a sorted array by jumping in blocks of size √n and then scanning linearly within the block.",
    description:
      "Jump search offers a compromise between linear and binary search. On a sorted array, it skips "
      + "ahead by fixed block sizes (typically √n). Once it finds a block that could contain the target, "
      + "it performs a normal linear scan over that smaller region. The result is O(√n) comparisons.",
    category: "searching",
    difficulty: "medium",
    timeComplexity: "O(√n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1) if the target is in the first examined block.",
      average: "O(√n)",
      worst: "O(√n)",
      space: "O(1) auxiliary.",
      notes:
        "In practice, binary search is usually preferred, but jump search is a nice example of "
        + "combining coarse and fine scanning strategies.",
    },
    paradigm: "jump-search",
    domains: ["sorted-arrays"],
    requiresSortedInput: true,
    primarilyEducational: true,
    whenToUse:
      "As a teaching example of time–space trade-offs and of improving over naive linear search on sorted data.",
    realWorldExamples: [
      "Didactic demonstrations of search complexity.",
      "Custom search engines over small, sorted datasets.",
    ],
    languages: ["javascript", "python"],
    tags: [
      "jump-search",
      "sorted-data",
      "sqrt-n",
      "hybrid-search",
    ],
    codeTemplates: {
      javascript: JUMP_SEARCH_JS,
      python: JUMP_SEARCH_PY,
    },
    recommendedInput:
      "Sorted arrays of size 100 or 400 where √n is an integer, so the block structure is easy to visualize.",
    notes:
      "Make sure the loop conditions correctly handle the last block and avoid off-by-one pitfalls.",
    relatedIds: [
      "binary-search-iterative",
      "linear-search",
      "exponential-search",
    ],
  }),

  defineSearchingAlgorithm({
    id: "ternary-search-unimodal",
    title: "Ternary Search (Unimodal Function)",
    shortDescription:
      "Searches for the maximum (or minimum) of a unimodal function on an interval by repeatedly splitting into three segments.",
    description:
      "Ternary search is not normally used to search for an element in an array; instead, it is used to find "
      + "the extremum of a unimodal function. At each iteration, the algorithm evaluates the function at two "
      + "interior points and discards one third of the range based on which side is larger. The integer "
      + "version is common in competitive programming.",
    category: "searching",
    difficulty: "medium",
    timeComplexity: "O(log((hi - lo))) function evaluations",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1) when the function is trivial or the initial range is very small.",
      average: "O(log((hi - lo)))",
      worst: "O(log((hi - lo)))",
      space: "O(1) auxiliary.",
      notes:
        "In continuous settings, ternary search can be combined with real-valued functions; here we implement a discrete integer version.",
    },
    paradigm: "ternary-search",
    domains: ["range-queries"],
    requiresSortedInput: false,
    primarilyEducational: true,
    whenToUse:
      "When optimizing a unimodal objective function without derivatives, especially in integer "
      + "domains where the search range is bounded.",
    realWorldExamples: [
      "Tuning a hyperparameter (like an integer block size) where performance curve is unimodal.",
      "Choosing an optimal meeting point on a 1D line in simplified models.",
    ],
    languages: ["javascript", "python"],
    tags: [
      "ternary-search",
      "unimodal-functions",
      "optimization",
      "competitive-programming",
    ],
    codeTemplates: {
      javascript: TERNARY_SEARCH_JS,
      python: TERNARY_SEARCH_PY,
    },
    recommendedInput:
      "Simple quadratic functions like f(x) = - (x - 7)^2 + 50, on integer intervals such as [0, 20].",
    notes:
      "Ternary search is different from binary search; it optimizes a function instead of searching for exact equality.",
    relatedIds: [
      "binary-search-iterative",
      "binary-search-recursive",
      "exponential-search",
    ],
  }),
];
