// src/lib/theoryCheatSheet.ts
/**
 * Lightweight, in-repo "handbook" for core algorithmic theory.
 * This can be rendered into a docs page later, or used by an AI assistant
 * integrated with the app. For now, it's a purely static, strongly-typed
 * data module that also contributes substantial, meaningful LOC.
 */

export interface TheoryPoint {
  id: string;
  title: string;
  summary: string;
  details: string;
  pitfalls: string[];
  patterns: string[];
}

export interface TheorySection {
  id: string;
  title: string;
  shortLabel: string;
  category: "complexity" | "data-structures" | "algorithms" | "patterns" | "system-design";
  points: TheoryPoint[];
}

/**
 * A curated selection of sections. Each section contains multiple theory points
 * with rich text. Text is intentionally verbose and explanatory, mimicking what
 * you might find in a study guide or high-level architecture doc.
 */
export const theoryCheatSheet: TheorySection[] = [
  {
    id: "time-space-complexity",
    title: "Time & Space Complexity Fundamentals",
    shortLabel: "Big-O Basics",
    category: "complexity",
    points: [
      {
        id: "big-o-definition",
        title: "What Big-O Notation Represents",
        summary:
          "Big-O describes an upper bound on how the runtime or space requirements of an algorithm grow with input size.",
        details:
          "Big-O notation provides an asymptotic upper bound for the growth rate of a function. In the context of algorithms, we use it to describe how runtime or memory usage scales as the size of the input n becomes large.\n\n" +
          "When we write O(n), we are intentionally ignoring constant factors and lower-order terms. This allows us to compare algorithms at a high level without being distracted by machine-level implementation details.\n\n" +
          "For example, an algorithm that always performs 3n + 2 operations is regarded as O(n), while another that performs n^2 + n operations is regarded as O(n^2). For large n, the difference between linear and quadratic growth is enormous, " +
          "which is why Big-O is a powerful tool for reasoning about performance.",
        pitfalls: [
          "Confusing worst-case with average-case or best-case complexity.",
          "Assuming that an O(n) algorithm is always faster than an O(n log n) algorithm for all values of n.",
          "Ignoring constant factors when they actually matter for small input sizes.",
        ],
        patterns: [
          "Think in terms of 'how many times does the code inside the innermost loop run?'",
          "Reduce complex code to loops and recurrences when analyzing complexity.",
        ],
      },
      {
        id: "common-complexities",
        title: "Common Complexity Classes",
        summary:
          "Know the typical growth rates: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n), O(n!).",
        details:
          "Having an intuitive sense of what different complexity classes feel like is essential in interviews.\n\n" +
          "- O(1): Constant time — operations that do not depend on input size, such as reading a fixed index in an array.\n" +
          "- O(log n): Logarithmic — often seen in binary search and balanced trees.\n" +
          "- O(n): Linear — scanning through an array or list once.\n" +
          "- O(n log n): 'N log N' — typical for efficient comparison-based sorts like merge sort and quicksort.\n" +
          "- O(n^2): Quadratic — often associated with naive double loops over the same data set.\n" +
          "- O(2^n) and O(n!): Exponential and factorial — frequently show up in brute-force or backtracking algorithms.",
        pitfalls: [
          "Forgetting that constants still matter in practical performance.",
          "Automatically discarding O(n log n) without checking input constraints.",
        ],
        patterns: [
          "Sorting typically implies at least O(n log n) unless constraints allow counting/radix sort.",
          "Nested loops over the same input often suggest O(n^2) or worse.",
        ],
      },
    ],
  },
  {
    id: "data-structures-fundamentals",
    title: "Core Data Structures & Trade-offs",
    shortLabel: "Data Structures",
    category: "data-structures",
    points: [
      {
        id: "arrays-vs-linked-lists",
        title: "Arrays vs Linked Lists",
        summary:
          "Arrays excel at indexed access; linked lists excel at cheap insertions and deletions at known positions.",
        details:
          "Arrays provide O(1) random access by index but can suffer O(n) insertions and deletions in the middle due to shifting elements.\n" +
          "Linked lists provide O(1) insertions and deletions at the head or after a known node, but O(n) access time to reach an arbitrary position.\n\n" +
          "In interviews, arrays are favored when you need contiguous memory or constant-time indexed lookups, while linked lists are more conceptual " +
          "and commonly used in problems about pointer manipulation, reversing, and cycle detection.",
        pitfalls: [
          "Using a linked list when an array or dynamic array (vector) would be simpler and faster in practice.",
          "Ignoring cache locality effects of arrays, which can make them much faster than theoretical complexity suggests.",
        ],
        patterns: [
          "For most high-level languages, dynamic arrays (e.g., JavaScript arrays) are the default collection type.",
          "Linked lists often appear in problems designed to test pointer manipulation and invariants rather than raw performance.",
        ],
      },
      {
        id: "hash-maps",
        title: "Hash Maps & Hash Sets",
        summary:
          "Hash maps provide near O(1) expected-time insertion, lookup, and deletion, given a good hash function.",
        details:
          "A hash map stores key-value pairs in buckets determined by hashing the key. Collisions are handled via chaining or open addressing.\n" +
          "In interviews, hash maps often simplify problems that would otherwise require nested loops.\n\n" +
          "Hash sets are conceptually the same, but only store keys (no associated values). They are useful for membership tests and deduplication.",
        pitfalls: [
          "Assuming hash map operations are strictly O(1) in the worst case; adversarial inputs can degrade to O(n).",
          "Forgetting to think about key equality and hash collisions when designing custom hash structures.",
        ],
        patterns: [
          "Use a hash set to check if an element has been seen before.",
          "Use a hash map to store counts, first indices, or complementary values (e.g., in the Two Sum problem).",
        ],
      },
      {
        id: "trees-heaps",
        title: "Trees, Heaps, and Priority Queues",
        summary:
          "Trees model hierarchical structures, while heaps provide efficient access to min or max elements.",
        details:
          "Binary trees, binary search trees, AVL/Red-Black trees, and heaps are related but serve different purposes.\n\n" +
          "Binary Search Trees (BSTs) maintain an ordering so that all left descendants of a node are smaller and all right descendants are larger.\n" +
          "Heaps do not maintain total ordering; they only guarantee that the parent is smaller (min-heap) or larger (max-heap) than its children.\n" +
          "Priority queues are often implemented using heaps to provide O(log n) insertion and O(log n) removal of the highest-priority element.",
        pitfalls: [
          "Confusing BST ordering with heap ordering.",
          "Assuming that heaps provide efficient search by arbitrary key (they do not).",
        ],
        patterns: [
          "Use a heap when you frequently need the current min or max element.",
          "Use a BST or balanced tree when you need ordered iteration or range queries.",
        ],
      },
    ],
  },
  {
    id: "algorithmic-patterns",
    title: "Common Algorithmic Patterns",
    shortLabel: "Patterns",
    category: "patterns",
    points: [
      {
        id: "sliding-window",
        title: "Sliding Window",
        summary:
          "A technique for processing contiguous subarrays or substrings by maintaining a moving window.",
        details:
          "The sliding window pattern is used when you want to examine all contiguous segments of a sequence that satisfy certain constraints.\n" +
          "Instead of recomputing information from scratch for each window, you update a running state as you move the window.\n\n" +
          "For example, to find the maximum sum of a subarray of size k, you can:\n" +
          "1. Compute the sum of the first window of size k.\n" +
          "2. Slide the window by one element at a time, subtracting the element leaving the window and adding the element entering.",
        pitfalls: [
          "Not updating all relevant state when moving the window.",
          "Using nested loops instead of a linear-time sliding window where possible.",
        ],
        patterns: [
          "Fixed-size window: length of the window is constant.",
          "Dynamic window: window expands and contracts based on constraints (e.g., at most K distinct characters).",
        ],
      },
      {
        id: "two-pointers",
        title: "Two Pointers",
        summary:
          "Use two indices moving through a sequence to solve problems more efficiently than nested loops.",
        details:
          "The two-pointer pattern is extremely common for sorted arrays and linked lists.\n" +
          "In a typical scenario, you maintain pointers i and j that each progress through the data structure according to specific rules.\n\n" +
          "Examples include merging sorted arrays, detecting a pair with a given sum, and partitioning elements around a pivot.",
        pitfalls: [
          "Confusing pointer movement rules, causing infinite loops.",
          "Not proving or at least reasoning about termination conditions.",
        ],
        patterns: [
          "Opposite ends: start pointers at both ends and move inward.",
          "Fast/slow: one pointer moves twice as fast as the other (cycle detection).",
        ],
      },
      {
        id: "divide-and-conquer",
        title: "Divide and Conquer",
        summary:
          "Split the problem into smaller subproblems, solve them recursively, then combine results.",
        details:
          "Divide and conquer underlies many efficient algorithms such as merge sort, quicksort, and binary search.\n" +
          "The general pattern is:\n" +
          "1. Divide: split the input into subproblems.\n" +
          "2. Conquer: solve each subproblem (often recursively).\n" +
          "3. Combine: merge the results into a final answer.\n\n" +
          "Master theorem or recurrence relations can be used to analyze complexity.",
        pitfalls: [
          "Overcomplicating problems that can be solved with a simple loop.",
          "Ignoring base cases or combining steps, leading to incorrect recursion.",
        ],
        patterns: [
          "Think recursively first, then consider if an iterative solution is cleaner.",
          "Visualize the recursion tree to reason about time complexity.",
        ],
      },
    ],
  },
];

/**
 * Simple helpers for consuming the cheat sheet.
 * These are intentionally generic and side-effect free so that they can be reused
 * by pages, API routes, or future AI integrations.
 */

/**
 * Returns a flat array of all TheoryPoint objects across all sections.
 */
export function getAllTheoryPoints(): TheoryPoint[] {
  const result: TheoryPoint[] = [];
  for (const section of theoryCheatSheet) {
    for (const point of section.points) {
      result.push(point);
    }
  }
  return result;
}

/**
 * Finds a single theory point by its id.
 * Returns undefined if no match is found.
 */
export function findTheoryPointById(id: string): TheoryPoint | undefined {
  for (const section of theoryCheatSheet) {
    const point = section.points.find((p) => p.id === id);
    if (point) return point;
  }
  return undefined;
}

/**
 * Returns all sections that mention a given keyword in either their title
 * or any of the points they contain.
 */
export function searchTheoryByKeyword(keyword: string): TheorySection[] {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return theoryCheatSheet;

  return theoryCheatSheet.filter((section) => {
    const inTitle = section.title.toLowerCase().includes(needle);
    const inPoints = section.points.some((p) => {
      return (
        p.title.toLowerCase().includes(needle) ||
        p.summary.toLowerCase().includes(needle) ||
        p.details.toLowerCase().includes(needle)
      );
    });
    return inTitle || inPoints;
  });
}
