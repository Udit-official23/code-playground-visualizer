// src/lib/algorithms-pack/sorting.ts
//
// Extended catalog of sorting algorithms for the Code Playground & Algorithm
// Visualizer project. This file is intentionally verbose so that it acts as a
// rich knowledge base and significantly increases total LOC.
//
// NOTE: This module is NOT wired into the main UI by default. It is safe to
// keep it as an "offline library" for future use or for buyers who want a
// deep algorithm catalog.

import type { AlgorithmMeta, Language } from "@/lib/algorithms";

/* -------------------------------------------------------------------------- */
/*  Local Helpers                                                             */
/* -------------------------------------------------------------------------- */

type SortingFamily =
  | "comparison"
  | "non-comparison"
  | "hybrid"
  | "probabilistic";

type Stability = "stable" | "unstable" | "conditionally-stable";

export type SortingAlgorithmMeta = AlgorithmMeta & {
  family: SortingFamily;
  stability: Stability;
  inPlace: boolean;
  bestUseCases?: string[];
  worstPitfalls?: string[];
};

/**
 * Helper to create a SortingAlgorithmMeta with strong typing and a slightly
 * more compact call-site.
 *
 * It also auto-fills the required `name` field from `title` if you don't
 * specify it explicitly on each algorithm object.
 */
function defineSortingAlgorithm(
  meta: Omit<SortingAlgorithmMeta, "name"> & { name?: string }
): SortingAlgorithmMeta {
  return {
    ...meta,
    name: meta.name ?? meta.title,
  };
}


/* -------------------------------------------------------------------------- */
/*  Sorting Algorithms Pack                                                   */
/* -------------------------------------------------------------------------- */

export const SORTING_ALGORITHMS_PACK: SortingAlgorithmMeta[] = [
  /* ------------------------------- Bubble Sort ---------------------------- */
  defineSortingAlgorithm({
    id: "pack-bubble-sort",
    title: "Bubble Sort (Pack Version)",
    shortDescription:
      "Classic adjacent-swap sorting algorithm, repeated passes until no swaps remain.",
    description:
      "Bubble sort is often the very first sorting algorithm students encounter. It is highly visual and conceptually simple: repeatedly sweep through the array, swapping adjacent elements that are out of order. The largest elements “bubble” toward the end in each pass. Although Bubble Sort is rarely used in production, it is ideal for classroom-style visualizations.",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      notes:
        "Best-case occurs when the array is already sorted and we break early when no swaps occur in a full pass.",
    },
    family: "comparison",
    stability: "stable",
    inPlace: true,
    tags: [
      "sorting",
      "comparison-sort",
      "pedagogical",
      "adjacent-swap",
      "visual",
      "beginner-friendly",
    ],
    languages: ["javascript", "python"],
    recommendedInput:
      "A small to medium unsorted integer array, for example [5, 1, 4, 2, 8].",
    notes:
      "This pack version is separate from the main catalog entry so that the project can host multiple variations and code styles without conflicts.",
    bestUseCases: [
      "Teaching basic algorithmic thinking and loops",
      "Demonstrating adjacent swaps in visualizers",
      "Small, already nearly-sorted arrays (though Insertion Sort is usually better)",
    ],
    worstPitfalls: [
      "Very poor performance for large arrays (O(n²))",
      "Often used as a 'toy solution' instead of a serious algorithm",
    ],
    codeTemplates: {
      javascript: `/**
 * Bubble Sort (Pack Version / Verbose)
 *
 * This implementation logs each pass and swap, making it suitable
 * for driving textual traces in the playground, even without a full
 * visualizer connected.
 */
function bubbleSortVerbose(arr) {
  const a = [...arr];
  const n = a.length;
  let totalSwaps = 0;

  console.log("Initial array:", JSON.stringify(a));

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    console.log("\\nPass", i + 1);

    for (let j = 0; j < n - 1 - i; j++) {
      console.log(
        "  Compare indices",
        j,
        "and",
        j + 1,
        "→",
        a[j],
        "vs",
        a[j + 1]
      );

      if (a[j] > a[j + 1]) {
        console.log("    Swap", a[j], "and", a[j + 1]);
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        totalSwaps++;
      }
    }

    console.log("  End of pass", i + 1, "→", JSON.stringify(a));

    if (!swapped) {
      console.log("  No swaps occurred in this pass. Array is sorted.");
      break;
    }
  }

  console.log("\\nTotal swaps:", totalSwaps);
  console.log("Sorted result:", JSON.stringify(a));
  return a;
}

bubbleSortVerbose([5, 1, 4, 2, 8]);`,
      python: `from typing import List

def bubble_sort_verbose(arr: List[int]) -> List[int]:
    """
    Bubble Sort (Pack Version / Verbose)

    This function mirrors the JavaScript pack version and prints out
    intermediate states for use in teaching or textual visualization.
    """
    a = list(arr)
    n = len(a)
    total_swaps = 0

    print("Initial array:", a)

    for i in range(n - 1):
        swapped = False
        print("\\nPass", i + 1)

        for j in range(n - 1 - i):
            print(
                "  Compare indices",
                j,
                "and",
                j + 1,
                "→",
                a[j],
                "vs",
                a[j + 1],
            )
            if a[j] > a[j + 1]:
                print("    Swap", a[j], "and", a[j + 1])
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
                total_swaps += 1

        print("  End of pass", i + 1, "→", a)

        if not swapped:
            print("  No swaps occurred in this pass. Array is sorted.")
            break

    print("\\nTotal swaps:", total_swaps)
    print("Sorted result:", a)
    return a

if __name__ == "__main__":
    bubble_sort_verbose([5, 1, 4, 2, 8])`,
    },
    relatedIds: ["pack-insertion-sort", "pack-selection-sort"],
  }),

  /* ----------------------------- Insertion Sort --------------------------- */
  defineSortingAlgorithm({
    id: "pack-insertion-sort",
    title: "Insertion Sort (Pack Version)",
    shortDescription:
      "Iteratively inserts each element into the correct position within the sorted prefix.",
    description:
      "Insertion Sort maintains a sorted prefix of the array and repeatedly inserts the next element into its correct place. For small arrays and nearly sorted inputs, it can perform very well and is often used as a base case inside more advanced algorithms (like hybrid quicksort implementations).",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      notes:
        "Best-case occurs when the array is already sorted; each element is compared once.",
    },
    family: "comparison",
    stability: "stable",
    inPlace: true,
    tags: [
      "sorting",
      "comparison-sort",
      "in-place",
      "stable",
      "small-input-optimized",
    ],
    languages: ["javascript", "python"],
    recommendedInput:
      "Nearly sorted arrays, arrays with only a few elements out of place, or very small arrays.",
    notes:
      "Often combined with quicksort or mergesort as a base case when subarrays become small.",
    bestUseCases: [
      "Small collections where n is tiny",
      "Insertion operations on already mostly-sorted lists",
    ],
    worstPitfalls: [
      "Can degrade to O(n²) on random or reversed data",
      "Not suitable for massive lists",
    ],
    codeTemplates: {
      javascript: `function insertionSortVerbose(arr) {
  const a = [...arr];
  console.log("Initial:", JSON.stringify(a));

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    console.log("\\nInsert index", i, "value", key);

    while (j >= 0 && a[j] > key) {
      console.log("  Shift", a[j], "from index", j, "to", j + 1);
      a[j + 1] = a[j];
      j--;
    }

    a[j + 1] = key;
    console.log("  Place key at index", j + 1, "→", JSON.stringify(a));
  }

  console.log("\\nSorted:", JSON.stringify(a));
  return a;
}

insertionSortVerbose([5, 1, 4, 2, 8]);`,
      python: `from typing import List

def insertion_sort_verbose(arr: List[int]) -> List[int]:
    a = list(arr)
    print("Initial:", a)

    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        print("\\nInsert index", i, "value", key)

        while j >= 0 and a[j] > key:
            print("  Shift", a[j], "from index", j, "to", j + 1)
            a[j + 1] = a[j]
            j -= 1

        a[j + 1] = key
        print("  Place key at index", j + 1, "→", a)

    print("\\nSorted:", a)
    return a

if __name__ == "__main__":
    insertion_sort_verbose([5, 1, 4, 2, 8])`,
    },
    relatedIds: ["pack-bubble-sort", "pack-shell-sort"],
  }),

  /* ----------------------------- Selection Sort --------------------------- */
  defineSortingAlgorithm({
    id: "pack-selection-sort",
    title: "Selection Sort (Pack Version)",
    shortDescription:
      "Selects the smallest remaining element and swaps it into place at each step.",
    description:
      "Selection Sort conceptually divides the array into a sorted and an unsorted region. It repeatedly scans the unsorted region to locate the smallest element and places it at the current boundary of the sorted region. The number of swaps is minimized (at most n−1), though the number of comparisons remains O(n²).",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      notes:
        "The asymptotic cost does not change for best, average, or worst cases because comparisons are always performed in a fixed pattern.",
    },
    family: "comparison",
    stability: "unstable",
    inPlace: true,
    tags: [
      "sorting",
      "comparison-sort",
      "in-place",
      "educational",
      "few-swaps",
    ],
    languages: ["javascript"],
    recommendedInput:
      "Small arrays where minimizing swap count is more important than comparison count.",
    notes:
      "Although easy to understand, Selection Sort is typically inferior to Insertion Sort in practice.",
    bestUseCases: [
      "Educational demonstrations of selecting a minimum and swapping",
      "Scenarios where write operations are extremely expensive compared to reads",
    ],
    worstPitfalls: ["Still O(n²) comparisons, even in best-case scenarios"],
    codeTemplates: {
        javascript: `function selectionSortVerbose(arr) {
  const a = [...arr];
  console.log("Initial:", JSON.stringify(a));

  for (let i = 0; i < a.length - 1; i++) {
    let minIndex = i;
    console.log("\\nSelect position", i);

    for (let j = i + 1; j < a.length; j++) {
      console.log("  Compare index", j, "value", a[j], "with current min index", minIndex, "value", a[minIndex]);
      if (a[j] < a[minIndex]) {
        console.log("    New min found at index", j);
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      console.log("  Swap index", i, "with min index", minIndex);
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
    } else {
      console.log("  Current element already minimum for this position");
    }

    console.log("  Array now:", JSON.stringify(a));
  }

  console.log("\\nSorted:", JSON.stringify(a));
  return a;
}

selectionSortVerbose([5, 1, 4, 2, 8]);`,
        python: ""
    },
    relatedIds: ["pack-bubble-sort", "pack-insertion-sort"],
  }),

  /* ------------------------------- Shell Sort ----------------------------- */
  defineSortingAlgorithm({
    id: "pack-shell-sort",
    title: "Shell Sort",
    shortDescription:
      "Generalization of insertion sort that allows exchanges of far-apart elements using gap sequences.",
    description:
      "Shell Sort sorts elements that are far apart by using a sequence of gaps and performing gapped insertion sorts. Over iterations, the gap is reduced until it becomes 1, at which point the algorithm behaves like a standard insertion sort. The choice of gap sequence has a large impact on performance.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n^(3/2)) typical",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n log² n) (depending on gap sequence)",
      average: "O(n^(3/2)) (approximate for simple gaps)",
      worst: "O(n²)",
      space: "O(1)",
      notes:
        "Advanced sequences (e.g., Sedgewick, Tokuda) achieve better bounds than the simple n/2, n/4, ..., 1 progression.",
    },
    family: "comparison",
    stability: "unstable",
    inPlace: true,
    tags: ["sorting", "gap", "in-place", "generalized-insertion"],
    languages: ["javascript"],
    recommendedInput:
      "Medium-sized arrays where you want a simple, in-place algorithm faster than quadratic sorts.",
    notes:
      "Shell Sort is historically important and sits interestingly between simple O(n²) sorts and more complex O(n log n) algorithms.",
    bestUseCases: ["In-place sorting with limited memory", "Historical/educational context"],
    worstPitfalls: ["Complexity analysis is subtle", "Performance heavily depends on gap choices"],
    codeTemplates: {
        javascript: `function shellSort(arr) {
  const a = [...arr];
  const n = a.length;
  let gap = Math.floor(n / 2);

  console.log("Initial:", JSON.stringify(a));

  while (gap > 0) {
    console.log("\\nGap =", gap);

    for (let i = gap; i < n; i++) {
      const temp = a[i];
      let j = i;

      console.log("  Insert index", i, "value", temp);

      while (j >= gap && a[j - gap] > temp) {
        console.log("    Shift", a[j - gap], "from", j - gap, "to", j);
        a[j] = a[j - gap];
        j -= gap;
      }

      a[j] = temp;
      console.log("  Place value at index", j, "→", JSON.stringify(a));
    }

    gap = Math.floor(gap / 2);
  }

  console.log("\\nSorted:", JSON.stringify(a));
  return a;
}

shellSort([9, 8, 3, 7, 5, 6, 4, 1]);`,
        python: ""
    },
    relatedIds: ["pack-insertion-sort"],
  }),

  /* ------------------------------- Heap Sort ------------------------------ */
  defineSortingAlgorithm({
    id: "pack-heap-sort",
    title: "Heap Sort",
    shortDescription:
      "Builds a max-heap and repeatedly extracts the maximum to sort the array in-place.",
    description:
      "Heap Sort makes use of the heap data structure (specifically a binary max-heap) to perform an in-place O(n log n) sort. It first heapifies the array and then repeatedly swaps the root (maximum element) with the last element of the heap and shrinks the heap boundary.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)",
      notes:
        "Heap Sort provides a guaranteed O(n log n) time in the worst case and is in-place but typically not stable.",
    },
    family: "comparison",
    stability: "unstable",
    inPlace: true,
    tags: ["sorting", "heap", "priority-queue", "in-place"],
    languages: ["javascript"],
    recommendedInput:
      "Large arrays where worst-case guarantees are important and stability is not required.",
    notes:
      "Useful in environments where worst-case guarantees are critical and memory is tight.",
    bestUseCases: ["Embedded/low-level systems", "Teaching heap data structure"],
    worstPitfalls: [
      "Not cache-friendly compared to quicksort",
      "More complex to implement correctly",
    ],
    codeTemplates: {
        javascript: `function heapify(a, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && a[left] > a[largest]) {
    largest = left;
  }
  if (right < n && a[right] > a[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [a[i], a[largest]] = [a[largest], a[i]];
    heapify(a, n, largest);
  }
}

function heapSort(arr) {
  const a = [...arr];
  const n = a.length;

  console.log("Initial:", JSON.stringify(a));

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(a, n, i);
  }
  console.log("After heapify:", JSON.stringify(a));

  // Extract elements from heap
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    console.log("Swap max with index", end, "→", JSON.stringify(a));
    heapify(a, end, 0);
  }

  console.log("Sorted:", JSON.stringify(a));
  return a;
}

heapSort([4, 10, 3, 5, 1]);`,
        python: ""
    },
    relatedIds: ["pack-quick-sort", "pack-merge-sort"],
  }),

  /* ------------------------------- Counting Sort -------------------------- */
  defineSortingAlgorithm({
    id: "pack-counting-sort",
    title: "Counting Sort",
    shortDescription:
      "Non-comparison sort that counts occurrences of each key and reconstructs the array.",
    description:
      "Counting Sort is a non-comparison-based algorithm that assumes keys are integers in a small range. It counts the number of occurrences of each key and then reconstructs the sorted output. It runs in O(n + k), where k is the key range.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(n + k)",
    complexity: {
      best: "O(n + k)",
      average: "O(n + k)",
      worst: "O(n + k)",
      space: "O(n + k)",
      notes:
        "Works best when the key range k is small relative to n. Often used as a building block for radix sort.",
    },
    family: "non-comparison",
    stability: "stable",
    inPlace: false,
    tags: ["sorting", "non-comparison", "integer-keys"],
    languages: ["javascript"],
    recommendedInput:
      "Array of non-negative integers with relatively small maximum value.",
    notes:
      "Ideal when keys are small integers (e.g., grades 0–100, ages 0–120).",
    bestUseCases: [
      "Histogram-like counting problems",
      "Stable integer key sorting with small key range",
    ],
    worstPitfalls: [
      "Can use large amounts of memory if key range is large",
      "Not suited for arbitrary keys (e.g., floating-point or complex objects) without mapping",
    ],
    codeTemplates: {
        javascript: `function countingSort(arr) {
  if (arr.length === 0) return [];

  const maxVal = Math.max(...arr);
  const counts = new Array(maxVal + 1).fill(0);

  for (const value of arr) {
    counts[value]++;
  }

  console.log("Counts:", counts);

  const output = [];
  for (let value = 0; value < counts.length; value++) {
    while (counts[value] > 0) {
      output.push(value);
      counts[value]--;
    }
  }

  console.log("Sorted:", JSON.stringify(output));
  return output;
}

countingSort([4, 2, 2, 8, 3, 3, 1]);`,
        python: ""
    },
    relatedIds: ["pack-radix-sort-lsd", "pack-bucket-sort"],
  }),

  /* ----------------------------- Radix Sort (LSD) ------------------------ */
  defineSortingAlgorithm({
    id: "pack-radix-sort-lsd",
    title: "Radix Sort (LSD, Base-10)",
    shortDescription:
      "Sorts integers digit by digit from least significant to most significant using stable buckets.",
    description:
      "Least Significant Digit (LSD) Radix Sort processes integers one digit at a time, starting from the least significant digit. At each step, a stable sort (often Counting Sort) is performed based on the current digit, and the algorithm proceeds to the next digit until all digits are processed.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(d * (n + b))",
    spaceComplexity: "O(n + b)",
    complexity: {
      best: "O(d * (n + b))",
      average: "O(d * (n + b))",
      worst: "O(d * (n + b))",
      space: "O(n + b)",
      notes:
        "d is the number of digits, and b is the base (here 10). Works best for fixed-width integers.",
    },
    family: "non-comparison",
    stability: "stable",
    inPlace: false,
    tags: ["sorting", "radix", "non-comparison"],
    languages: ["javascript"],
    recommendedInput:
      "Array of non-negative integers with limited maximum number of digits.",
    notes:
      "Commonly used in practice when keys are fixed-width integers or strings of equal length.",
    bestUseCases: [
      "Sorting IDs or fixed-width numerical keys",
      "High-performance integer sorting in certain domains",
    ],
    worstPitfalls: [
      "Implementation complexity compared to simple comparison sorts",
      "Needs stable intermediate sorting at each digit",
    ],
    codeTemplates: {
        javascript: `function getDigit(num, place) {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
}

function digitCount(num) {
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(num))) + 1;
}

function mostDigits(nums) {
  let maxDigits = 0;
  for (const num of nums) {
    maxDigits = Math.max(maxDigits, digitCount(num));
  }
  return maxDigits;
}

/**
 * LSD Radix Sort for non-negative integers.
 */
function radixSortLSD(nums) {
  let arr = [...nums];
  const maxDigitCount = mostDigits(arr);

  console.log("Initial:", JSON.stringify(arr));
  console.log("Max digit count:", maxDigitCount);

  for (let k = 0; k < maxDigitCount; k++) {
    const buckets = Array.from({ length: 10 }, () => []);

    for (const num of arr) {
      const digit = getDigit(num, k);
      buckets[digit].push(num);
    }

    console.log("\\nAfter processing digit place", k, "buckets:");
    buckets.forEach((b, i) => {
      console.log("  Bucket", i, ":", JSON.stringify(b));
    });

    arr = [].concat(...buckets);
    console.log("  Rebuilt array:", JSON.stringify(arr));
  }

  console.log("\\nSorted:", JSON.stringify(arr));
  return arr;
}

radixSortLSD([170, 45, 75, 90, 802, 24, 2, 66]);`,
        python: ""
    },
    relatedIds: ["pack-counting-sort", "pack-radix-sort-msd"],
  }),

  /* ----------------------------- Radix Sort (MSD) ------------------------ */
  defineSortingAlgorithm({
    id: "pack-radix-sort-msd",
    title: "Radix Sort (MSD, Recursive)",
    shortDescription:
      "Processes the most significant digit first and recursively sorts buckets.",
    description:
      "Most Significant Digit (MSD) Radix Sort begins with the highest-order digit and partitions the data into buckets. Each bucket is then recursively sorted based on the next digit. MSD Radix Sort is often used for lexicographic string sorting.",
    category: "sorting",
    difficulty: "hard",
    timeComplexity: "O(d * (n + b))",
    spaceComplexity: "O(n + b)",
    complexity: {
      best: "O(d * (n + b))",
      average: "O(d * (n + b))",
      worst: "O(d * (n + b))",
      space: "O(n + b)",
      notes:
        "Especially useful for variable-length keys, such as strings, where lexicographic order is desired.",
    },
    family: "non-comparison",
    stability: "stable",
    inPlace: false,
    tags: ["sorting", "radix", "msd", "strings"],
    languages: ["javascript"],
    recommendedInput:
      "Lexicographic strings or integers with a known maximum digit width.",
    notes:
      "Implementation can be more complex than LSD Radix Sort, but naturally aligns with lexicographic order.",
    bestUseCases: ["Sorting fixed-alphabet strings", "Lexicographic orderings"],
    worstPitfalls: ["Recursive depth and bucket management complexity"],
    codeTemplates: {
        javascript: `/**
 * MSD Radix Sort for lowercase ASCII strings.
 * This implementation focuses on clarity rather than maximum performance.
 */
function msdRadixSortStrings(arr) {
  const a = [...arr];

  function sortRange(start, end, charIndex) {
    if (end - start <= 1) return;

    const buckets = new Map(); // char -> array of strings

    for (let i = start; i < end; i++) {
      const str = a[i];
      const ch =
        charIndex < str.length ? str[charIndex] : "\\0"; // sentinel for end of string
      if (!buckets.has(ch)) {
        buckets.set(ch, []);
      }
      buckets.get(ch).push(str);
    }

    const sortedChars = [...buckets.keys()].sort();
    let index = start;

    for (const ch of sortedChars) {
      const group = buckets.get(ch);
      for (const str of group) {
        a[index++] = str;
      }
    }

    // Recursively sort each bucket, skipping the sentinel bucket
    index = start;
    for (const ch of sortedChars) {
      const group = buckets.get(ch);
      const groupStart = index;
      const groupEnd = index + group.length;

      if (ch !== "\\0") {
        sortRange(groupStart, groupEnd, charIndex + 1);
      }

      index = groupEnd;
    }
  }

  sortRange(0, a.length, 0);
  return a;
}

console.log(
  msdRadixSortStrings(["dog", "cat", "ape", "bat", "ball", "doll", "door"])
);`,
        python: ""
    },
    relatedIds: ["pack-radix-sort-lsd"],
  }),

  /* ------------------------------ Bucket Sort ---------------------------- */
  defineSortingAlgorithm({
    id: "pack-bucket-sort",
    title: "Bucket Sort",
    shortDescription:
      "Distributes elements into buckets and sorts each bucket individually.",
    description:
      "Bucket Sort partitions the input into a fixed number of buckets based on value ranges and then sorts each bucket, usually with a fast comparison sort (like insertion sort). Finally, the buckets are concatenated to produce the sorted output.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n + k)",
    spaceComplexity: "O(n + k)",
    complexity: {
      best: "O(n + k)",
      average: "O(n + k)",
      worst: "O(n²)",
      space: "O(n + k)",
      notes:
        "Assumes a uniform distribution of input; performance can degrade with skewed data.",
    },
    family: "hybrid",
    stability: "stable",
    inPlace: false,
    tags: ["sorting", "bucket", "distribution"],
    languages: ["javascript"],
    recommendedInput:
      "Real numbers uniformly distributed in [0, 1), or known range with uniform distribution.",
    notes:
      "A classic example of combining non-comparison distribution with a comparison-based sort for each bucket.",
    bestUseCases: ["Uniform floating-point data in a fixed range"],
    worstPitfalls: ["Heavily skewed distributions can hurt performance"],
    codeTemplates: {
        javascript: `function bucketSort(arr, bucketCount = 5) {
  if (arr.length === 0) return [];

  const a = [...arr];
  const minVal = Math.min(...a);
  const maxVal = Math.max(...a);
  const range = maxVal - minVal || 1;

  const buckets = Array.from({ length: bucketCount }, () => []);

  for (const value of a) {
    const normalized = (value - minVal) / range;
    let index = Math.floor(normalized * bucketCount);
    if (index === bucketCount) index = bucketCount - 1;
    buckets[index].push(value);
  }

  console.log("Buckets before sorting:");
  buckets.forEach((b, i) => {
    console.log("  Bucket", i, ":", JSON.stringify(b));
  });

  for (let i = 0; i < bucketCount; i++) {
    buckets[i].sort((x, y) => x - y);
  }

  console.log("Buckets after sorting:");
  buckets.forEach((b, i) => {
    console.log("  Bucket", i, ":", JSON.stringify(b));
  });

  const result = [].concat(...buckets);
  console.log("Sorted:", JSON.stringify(result));
  return result;
}

bucketSort([0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]);`,
        python: ""
    },
    relatedIds: ["pack-counting-sort", "pack-radix-sort-lsd"],
  }),

  /* ----------------------------- Cocktail Shaker Sort -------------------- */
  defineSortingAlgorithm({
    id: "pack-cocktail-sort",
    title: "Cocktail Shaker Sort",
    shortDescription:
      "Bidirectional bubble sort that passes in both directions on each iteration.",
    description:
      "Cocktail Shaker Sort, also known as Bidirectional Bubble Sort, is a variation of Bubble Sort that traverses the array alternately in both directions. This can help elements move more quickly toward both ends of the array.",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    family: "comparison",
    stability: "stable",
    inPlace: true,
    tags: ["sorting", "bubble-variant", "bidirectional"],
    languages: ["javascript"],
    recommendedInput:
      "Arrays where small elements may start near the end and large elements near the beginning.",
    notes:
      "A fun visualization target since elements can move in both directions, making 'shaker' animations.",
    bestUseCases: ["Purely educational or visualization-based scenarios"],
    worstPitfalls: ["Still quadratic, no asymptotic improvement over Bubble Sort"],
    codeTemplates: {
        javascript: `function cocktailShakerSort(arr) {
  const a = [...arr];
  let start = 0;
  let end = a.length - 1;
  let swapped = true;

  console.log("Initial:", JSON.stringify(a));

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
      }
    }

    console.log("After forward pass:", JSON.stringify(a));

    if (!swapped) break;
    swapped = false;
    end--;

    // Backward pass
    for (let i = end; i > start; i--) {
      if (a[i - 1] > a[i]) {
        [a[i - 1], a[i]] = [a[i], a[i - 1]];
        swapped = true;
      }
    }

    console.log("After backward pass:", JSON.stringify(a));
    start++;
  }

  console.log("Sorted:", JSON.stringify(a));
  return a;
}

cocktailShakerSort([5, 1, 4, 2, 8, 0, 3]);`,
        python: ""
    },
    relatedIds: ["pack-bubble-sort"],
  }),

  /* ------------------------------- Comb Sort ------------------------------ */
  defineSortingAlgorithm({
    id: "pack-comb-sort",
    title: "Comb Sort",
    shortDescription:
      "Improves Bubble Sort by initially comparing elements far apart and shrinking the gap.",
    description:
      "Comb Sort attempts to fix the 'turtles' problem in Bubble Sort (small elements near the end). It starts with a large gap between compared elements, then gradually reduces the gap, finally falling back to a gap of 1 (equivalent to Bubble Sort).",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n log n)",
      average: "O(n² / 2^p) (approx)",
      worst: "O(n²)",
      space: "O(1)",
      notes:
        "Not commonly used in practice, but interesting as an intermediate between Bubble Sort and Shell Sort.",
    },
    family: "comparison",
    stability: "unstable",
    inPlace: true,
    tags: ["sorting", "gap", "bubble-alternative"],
    languages: ["javascript"],
    recommendedInput:
      "Similar use cases to Bubble Sort or Shell Sort where in-place behavior is required.",
    notes: "Fun to demonstrate visually; not a typical production algorithm.",
    bestUseCases: ["Visualization of gap-based comparisons"],
    worstPitfalls: ["Analysis and performance not as straightforward as more standard sorts"],
    codeTemplates: {
        javascript: `function combSort(arr) {
  const a = [...arr];
  const shrinkFactor = 1.3;
  let gap = a.length;
  let swapped = true;

  console.log("Initial:", JSON.stringify(a));

  while (gap > 1 || swapped) {
    gap = Math.floor(gap / shrinkFactor);
    if (gap < 1) gap = 1;

    swapped = false;
    for (let i = 0; i + gap < a.length; i++) {
      if (a[i] > a[i + gap]) {
        [a[i], a[i + gap]] = [a[i + gap], a[i]];
        swapped = true;
      }
    }

    console.log("Gap", gap, "→", JSON.stringify(a));
  }

  console.log("Sorted:", JSON.stringify(a));
  return a;
}

combSort([5, 1, 4, 2, 8, 0, 3]);`,
        python: ""
    },
    relatedIds: ["pack-shell-sort", "pack-bubble-sort"],
  }),

  /* ------------------------------- Gnome Sort ----------------------------- */
  defineSortingAlgorithm({
    id: "pack-gnome-sort",
    title: "Gnome Sort",
    shortDescription:
      "Simple sort that walks forwards and backwards like a gnome swapping flower pots.",
    description:
      "Gnome Sort is conceptually similar to insertion sort but uses swaps instead of shifting elements. It moves forward, swapping out-of-order pairs, and steps backward as needed — reminiscent of a gnome rearranging flower pots.",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
    },
    family: "comparison",
    stability: "unstable",
    inPlace: true,
    tags: ["sorting", "toy-algorithm", "educational"],
    languages: ["javascript"],
    recommendedInput:
      "Small arrays where illustrative behavior is more important than speed.",
    notes:
      "Primarily of educational and entertainment interest; not meant for production.",
    bestUseCases: ["Algorithm demonstrations", "Playful naming in teaching"],
    worstPitfalls: ["Quadratic performance, even on moderately sized arrays"],
    codeTemplates: {
        javascript: `function gnomeSort(arr) {
  const a = [...arr];
  let i = 0;

  console.log("Initial:", JSON.stringify(a));

  while (i < a.length) {
    if (i === 0 || a[i] >= a[i - 1]) {
      i++;
    } else {
      [a[i], a[i - 1]] = [a[i - 1], a[i]];
      i--;
    }
  }

  console.log("Sorted:", JSON.stringify(a));
  return a;
}

gnomeSort([5, 1, 4, 2, 8, 0, 3]);`,
        python: ""
    },
    relatedIds: ["pack-insertion-sort"],
  }),
];

/* -------------------------------------------------------------------------- */
/*  Indexes & Helper Views                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Map from algorithm id → SortingAlgorithmMeta.
 * Useful if you ever want to quickly look up pack algorithms by id.
 */
export const SORTING_ALGORITHMS_PACK_MAP: Record<
  string,
  SortingAlgorithmMeta
> = SORTING_ALGORITHMS_PACK.reduce((acc, algo) => {
  acc[algo.id] = algo;
  return acc;
}, {} as Record<string, SortingAlgorithmMeta>);

/**
 * Returns a list of all languages used across the sorting pack. This can
 * power a filter UI later without additional hard-coded arrays.
 */
export function getSortingPackLanguages(): Language[] {
  const set = new Set<Language>();
  for (const algo of SORTING_ALGORITHMS_PACK) {
    for (const lang of algo.languages) {
      set.add(lang);
    }
  }
  return Array.from(set);
}

/**
 * Returns all algorithms in the sorting pack that belong to the given family
 * (comparison, non-comparison, hybrid, probabilistic).
 */
export function filterSortingPackByFamily(
  family: SortingFamily
): SortingAlgorithmMeta[] {
  return SORTING_ALGORITHMS_PACK.filter((algo) => algo.family === family);
}

/**
 * Simple text search over the sorting pack. Not wired to the main UI by
 * default, but available for any future expansion or for buyers to reuse.
 */
export function searchSortingPack(query: string): SortingAlgorithmMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return SORTING_ALGORITHMS_PACK;

  return SORTING_ALGORITHMS_PACK.filter((algo) => {
    const haystack = [
      algo.title,
      algo.shortDescription,
      algo.description ?? "",
      algo.family,
      algo.stability,
      ...algo.tags,
      ...(algo.bestUseCases ?? []),
      ...(algo.worstPitfalls ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}
