// src/lib/algorithms.ts 

export type AlgorithmCategory =
  | "sorting"
  | "searching"
  | "graph"
  | "dynamic-programming";

export type Difficulty = "easy" | "medium" | "hard";

export type Language = "javascript" | "python";

export type AlgorithmMeta = {
  id: string;

  /**
   * Optional internal / display name. If omitted, the UI should fall back
   * to `title`. This keeps older entries valid while allowing richer
   * naming for extended catalogs.
   */
  name?: string;

  /**
   * Title shown in cards, lists, and pages. This is always required.
   */
  title: string;
  shortDescription: string;

  /**
   * Optional longer explanation used on the details page.
   */
  description?: string;

  category: AlgorithmCategory;
  difficulty: Difficulty;

  timeComplexity: string;
  spaceComplexity: string;

  /**
   * Optional structured complexity block for detail views.
   */
  complexity?: {
    best: string;
    average: string;
    worst: string;
    space: string;
    notes?: string;
  };

  tags: string[];
  languages: Language[];

  recommendedInput?: string;
  notes?: string;

  codeTemplates: Record<Language, string>;

  relatedIds: string[];
};


/* -------------------------------------------------------------------------- */
/*  Labels & Helper Lookups                                                   */
/* -------------------------------------------------------------------------- */

export const categoryLabels: Record<AlgorithmCategory, string> = {
  sorting: "Sorting",
  searching: "Searching",
  graph: "Graph Algorithms",
  "dynamic-programming": "Dynamic Programming",
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const languageLabels: Record<Language, string> = {
  javascript: "JavaScript",
  python: "Python",
};

export const algorithmCategories: {
  id: AlgorithmCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "sorting",
    label: categoryLabels.sorting,
    description:
      "Algorithms that reorder collections, often compared by performance, stability, and in-place behavior.",
  },
  {
    id: "searching",
    label: categoryLabels.searching,
    description:
      "Algorithms for finding elements within collections, ranging from linear scan to logarithmic-time search.",
  },
  {
    id: "graph",
    label: categoryLabels.graph,
    description:
      "Traversal, path-finding, and connectivity algorithms over nodes and edges.",
  },
  {
    id: "dynamic-programming",
    label: categoryLabels["dynamic-programming"],
    description:
      "Optimization and counting problems solved via overlapping subproblems and optimal substructure.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Algorithm Catalog                                                         */
/* -------------------------------------------------------------------------- */

export const ALGORITHMS: AlgorithmMeta[] = [
  /* -------------------------------- Bubble Sort --------------------------- */
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    shortDescription:
      "Simple comparison-based sort that repeatedly swaps adjacent out-of-order elements.",
    description:
      "Bubble sort is a pedagogical sorting algorithm where adjacent elements are compared and swapped if out of order. It is rarely used in production, but it is excellent for visual demonstrations because each swap is easy to animate.",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      notes: "Stable; often used for teaching and visualization, not for large inputs.",
    },
    tags: ["sorting", "array", "teaching", "beginner"],
    languages: ["javascript", "python"],
    recommendedInput: "Unsorted integer array, e.g., [5, 1, 4, 2, 8].",
    notes:
      "Perfect for driving the ArrayVisualizer with step-by-step swapping traces.",
    codeTemplates: {
      javascript: `function bubbleSort(arr) {
  const a = [...arr]; // do not mutate original
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        // swap adjacent elements
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }

    // Small optimization: if nothing was swapped,
    // the array is already sorted.
    if (!swapped) {
      break;
    }
  }

  return a;
}

console.log(bubbleSort([5, 1, 4, 2, 8]));`,
      python: `from typing import List

def bubble_sort(arr: List[int]) -> List[int]:
    a = list(arr)
    n = len(a)

    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break
    return a

if __name__ == "__main__":
    print(bubble_sort([5, 1, 4, 2, 8]))`,
    },
    relatedIds: ["insertion-sort", "selection-sort", "merge-sort"],
  },

  /* ------------------------------ Insertion Sort -------------------------- */
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    shortDescription:
      "Builds the sorted list one element at a time by inserting into the correct position.",
    description:
      "Insertion sort is efficient for very small arrays and almost-sorted inputs. It works by taking elements from the input and inserting them into the correct place in the already-sorted section.",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      notes: "Stable; often used as a base case inside more advanced sorts.",
    },
    tags: ["sorting", "array", "stable"],
    languages: ["javascript", "python"],
    recommendedInput: "Small list of numbers or partially sorted array.",
    notes:
      "Nice to contrast with bubble sort: same complexity class but feels more 'natural'.",
    codeTemplates: {
      javascript: `function insertionSort(arr) {
  const a = [...arr];

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    // Shift larger elements to the right
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }

    // Insert the key at the correct position
    a[j + 1] = key;
  }

  return a;
}

console.log(insertionSort([5, 1, 4, 2, 8]));`,
      python: `from typing import List

def insertion_sort(arr: List[int]) -> List[int]:
    a = list(arr)
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
    return a

if __name__ == "__main__":
    print(insertion_sort([5, 1, 4, 2, 8]))`,
    },
    relatedIds: ["bubble-sort", "selection-sort"],
  },

  /* ------------------------------ Selection Sort -------------------------- */
  {
    id: "selection-sort",
    title: "Selection Sort",
    shortDescription:
      "Repeatedly selects the minimum remaining element and moves it to its final position.",
    description:
      "Selection sort divides the array into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region and swapping it into place.",
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
        "Not stable in its simplest form; mostly educational compared to practical algorithms.",
    },
    tags: ["sorting", "array"],
    languages: ["javascript", "python"],
    recommendedInput: "Array of numbers; best demonstrated with 6–10 elements.",
    notes:
      "Good for illustrating the idea of a 'current minimum' and swap positions.",
    codeTemplates: {
      javascript: `function selectionSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
    }
  }

  return a;
}

console.log(selectionSort([5, 1, 4, 2, 8]));`,
      python: `from typing import List

def selection_sort(arr: List[int]) -> List[int]:
    a = list(arr)
    n = len(a)
    for i in range(n - 1):
        min_index = i
        for j in range(i + 1, n):
            if a[j] < a[min_index]:
                min_index = j
        if min_index != i:
            a[i], a[min_index] = a[min_index], a[i]
    return a

if __name__ == "__main__":
    print(selection_sort([5, 1, 4, 2, 8]))`,
    },
    relatedIds: ["insertion-sort", "bubble-sort"],
  },

  /* -------------------------------- Merge Sort ---------------------------- */
  {
    id: "merge-sort",
    title: "Merge Sort",
    shortDescription:
      "Divide-and-conquer sort that recursively splits the array and merges sorted halves.",
    description:
      "Merge sort divides the input into halves, recursively sorts each half, and then merges them. It guarantees O(n log n) performance and is stable, but requires extra memory for merging.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
      notes:
        "Stable; good for external sorting and large datasets when memory is acceptable.",
    },
    tags: ["sorting", "divide-and-conquer", "stable"],
    languages: ["javascript", "python"],
    recommendedInput:
      "Medium/large array of numbers; ideal for performance comparisons.",
    notes: "Good reference algorithm for explaining O(n log n) sorting.",
    codeTemplates: {
      javascript: `function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Append remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

console.log(mergeSort([5, 1, 4, 2, 8, 0, 3]));`,
      python: `from typing import List

def merge(left: List[int], right: List[int]) -> List[int]:
    result: List[int] = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

if __name__ == "__main__":
    print(merge_sort([5, 1, 4, 2, 8, 0, 3]))`,
    },
    relatedIds: ["quick-sort", "heap-sort"],
  },

  /* -------------------------------- Quick Sort ---------------------------- */
  {
    id: "quick-sort",
    title: "Quick Sort",
    shortDescription:
      "Divide-and-conquer sort that partitions the array around a pivot element.",
    description:
      "Quick sort picks a pivot, partitions the array into smaller and larger elements, and recursively sorts the partitions. With good pivot selection, it is typically faster than other O(n log n) sorts in practice.",
    category: "sorting",
    difficulty: "medium",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    complexity: {
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
      notes:
        "Not stable in typical in-place forms; performance depends heavily on pivot strategy.",
    },
    tags: ["sorting", "divide-and-conquer", "recursion"],
    languages: ["javascript"],
    recommendedInput: "Randomized array of numbers; avoid already-sorted arrays.",
    notes:
      "Great for performance demonstrations; worst-case can be triggered with sorted inputs.",
    codeTemplates: {
      javascript: `function partition(a, lo, hi) {
  const pivot = a[hi];
  let i = lo;

  for (let j = lo; j < hi; j++) {
    if (a[j] <= pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }

  [a[i], a[hi]] = [a[hi], a[i]];
  return i;
}

function quickSortInPlace(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;

  const p = partition(a, lo, hi);
  quickSortInPlace(a, lo, p - 1);
  quickSortInPlace(a, p + 1, hi);
}

function quickSort(arr) {
  const a = [...arr];
  quickSortInPlace(a);
  return a;
}

console.log(
  quickSort([9, 1, 4, 7, 3, 2, 8, 5, 6])
);`,
      python: "",
    },
    relatedIds: ["merge-sort", "heap-sort", "insertion-sort"],
  },

  /* -------------------------------- Linear Search ------------------------- */
  {
    id: "linear-search",
    title: "Linear Search",
    shortDescription:
      "Sequential search that scans each element until the target is found.",
    description:
      "Linear search checks each element in a collection sequentially. It is simple and works on unsorted data, but is O(n) in the worst case.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
    },
    tags: ["searching", "array", "beginner"],
    languages: ["javascript", "python"],
    recommendedInput: "Unsorted array and a target value.",
    notes: "Nice baseline to compare against more advanced searching.",
    codeTemplates: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}

const data = [42, 7, 13, 99, 5];
console.log(linearSearch(data, 13));`,
      python: `from typing import List, Any

def linear_search(arr: List[Any], target: Any) -> int:
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1

if __name__ == "__main__":
    data = [42, 7, 13, 99, 5]
    print(linear_search(data, 13))`,
    },
    relatedIds: ["binary-search"],
  },

  /* -------------------------------- Binary Search ------------------------- */
  {
    id: "binary-search",
    title: "Binary Search",
    shortDescription:
      "Logarithmic-time search in a sorted array using a low/high/mid pointer strategy.",
    description:
      "Binary search repeatedly divides the search interval in half by comparing the target to the middle element. It requires sorted input but runs in O(log n) time.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(1)",
      average: "O(log n)",
      worst: "O(log n)",
      space: "O(1)",
      notes: "Requires random access to elements and sorted input.",
    },
    tags: ["searching", "array", "logarithmic"],
    languages: ["javascript", "python"],
    recommendedInput:
      "Sorted array of numbers and a target; e.g., [1,3,5,7,9,11], target=7.",
    notes:
      "Pairs well with detailed trace logs that show lo/hi/mid updates at each step.",
    codeTemplates: {
      javascript: `function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const value = arr[mid];

    console.log(
      \`lo=\${lo}, hi=\${hi}, mid=\${mid}, value=\${value}\`
    );

    if (value === target) return mid;
    if (value < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}

const sorted = [1, 3, 5, 7, 9, 11];
console.log(binarySearch(sorted, 7));`,
      python: `from typing import List

def binary_search(arr: List[int], target: int) -> int:
    lo = 0
    hi = len(arr) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        value = arr[mid]
        print(f"lo={lo}, hi={hi}, mid={mid}, value={value}")
        if value == target:
            return mid
        if value < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

if __name__ == "__main__":
    sorted_values = [1, 3, 5, 7, 9, 11]
    print(binary_search(sorted_values, 7))`,
    },
    relatedIds: ["linear-search"],
  },

  /* -------------------------------- BFS ----------------------------------- */
  {
    id: "bfs",
    title: "Breadth-First Search (BFS)",
    shortDescription:
      "Graph traversal that explores neighbors level by level using a queue.",
    description:
      "Breadth-first search explores a graph in waves: it visits all neighbors at distance 1, then distance 2, and so on. It can be used to compute shortest paths in unweighted graphs.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      notes:
        "Ideal for shortest path in unweighted graphs and for level-order traversals.",
    },
    tags: ["graph", "queue", "traversal", "shortest-path"],
    languages: ["javascript"],
    recommendedInput:
      "Adjacency list graph, e.g., {A:['B','C'], B:['D'], C:['E','F']} and a start node.",
    notes:
      "Works nicely as a foundation for the GraphVisualizer when showing frontier expansions.",
    codeTemplates: {
      javascript: `function bfs(start, adjacency) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  console.log(\`Start BFS from \${start}\`);

  while (queue.length > 0) {
    const node = queue.shift();
    console.log(
      \`Visit \${node} (queue: [\${queue.join(", ")}])\`
    );

    const neighbors = adjacency[node] ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        console.log(\`  enqueue \${neighbor}\`);
      }
    }
  }
}

const graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["E", "F"],
  D: [],
  E: [],
  F: [],
};

bfs("A", graph);`,
      python: "",
    },
    relatedIds: ["dfs", "dijkstra"],
  },

  /* -------------------------------- DFS ----------------------------------- */
  {
    id: "dfs",
    title: "Depth-First Search (DFS)",
    shortDescription:
      "Graph traversal that explores as far as possible along each branch before backtracking.",
    description:
      "Depth-first search can be implemented recursively or with an explicit stack. It is useful for exploring components, detecting cycles, and generating topological orders in DAGs.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
    tags: ["graph", "traversal", "recursion", "stack"],
    languages: ["javascript"],
    recommendedInput:
      "Adjacency list graph and a start node; recursion depth depends on structure.",
    notes:
      "Helpful to show recursion stacks and to compare with BFS frontier-style expansion.",
    codeTemplates: {
      javascript: `function dfs(node, adjacency, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  console.log(\`Enter \${node}\`);

  const neighbors = adjacency[node] ?? [];
  for (const neighbor of neighbors) {
    dfs(neighbor, adjacency, visited);
  }

  console.log(\`Leave \${node}\`);
}

const graph = {
  A: ["B", "C"],
  B: ["D"],
  C: ["E", "F"],
  D: [],
  E: [],
  F: [],
};

dfs("A", graph);`,
      python: "",
    },
    relatedIds: ["bfs", "topological-sort"],
  },

  /* -------------------------------- Dijkstra ------------------------------- */
  {
    id: "dijkstra",
    title: "Dijkstra's Algorithm",
    shortDescription:
      "Single-source shortest path algorithm for graphs with non-negative edge weights.",
    description:
      "Dijkstra's algorithm maintains a priority queue of frontier nodes and relaxes edges to compute the shortest path distances from a source node in a graph with non-negative edge weights.",
    category: "graph",
    difficulty: "hard",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V + E)",
    complexity: {
      best: "O((V + E) log V)",
      average: "O((V + E) log V)",
      worst: "O((V + E) log V)",
      space: "O(V + E)",
      notes: "Typically implemented using a binary heap or priority queue.",
    },
    tags: ["graph", "shortest-path", "priority-queue"],
    languages: ["javascript"],
    recommendedInput:
      "Weighted adjacency list graph and a source node, with non-negative weights.",
    notes:
      "Good candidate for a future path visualizer showing frontier expansion and tentative distances.",
    codeTemplates: {
      javascript: `// A simple (non-optimized) Dijkstra implementation
// using a priority queue interface based on an array.

function dijkstra(graph, source) {
  const distances = {};
  const visited = new Set();

  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
  }
  distances[source] = 0;

  const queue = [{ node: source, dist: 0 }];

  while (queue.length > 0) {
    // Extract node with smallest distance
    queue.sort((a, b) => a.dist - b.dist);
    const { node } = queue.shift();
    if (visited.has(node)) continue;
    visited.add(node);

    for (const edge of graph[node] ?? []) {
      const { to, weight } = edge;
      const newDist = distances[node] + weight;
      if (newDist < distances[to]) {
        distances[to] = newDist;
        queue.push({ node: to, dist: newDist });
      }
    }
  }

  return distances;
}

const graph = {
  A: [{ to: "B", weight: 4 }, { to: "C", weight: 2 }],
  B: [{ to: "C", weight: 5 }, { to: "D", weight: 10 }],
  C: [{ to: "E", weight: 3 }],
  D: [],
  E: [{ to: "D", weight: 4 }],
};

console.log(dijkstra(graph, "A"));`,
      python: "",
    },
    relatedIds: ["bfs"],
  },

  /* ------------------------------ Topological Sort ------------------------ */
  {
    id: "topological-sort",
    title: "Topological Sort (Kahn's Algorithm)",
    shortDescription:
      "Linear ordering of a DAG's vertices such that all edges go from left to right.",
    description:
      "A topological sort orders the vertices of a Directed Acyclic Graph (DAG) so that all edges point forward. Kahn's algorithm repeatedly removes nodes with in-degree zero.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V + E)",
    },
    tags: ["graph", "ordering", "dag"],
    languages: ["javascript"],
    recommendedInput:
      "Directed acyclic graph represented as adjacency list; e.g., prerequisites graph.",
    notes:
      "Great for visualizing dependency resolution (like build systems or course prerequisites).",
    codeTemplates: {
      javascript: `function topologicalSort(graph) {
  const inDegree = {};
  const queue = [];
  const order = [];

  // Initialize in-degrees
  for (const node of Object.keys(graph)) {
    inDegree[node] = 0;
  }
  for (const node of Object.keys(graph)) {
    for (const neighbor of graph[node]) {
      inDegree[neighbor] = (inDegree[neighbor] ?? 0) + 1;
    }
  }

  // Collect nodes with in-degree 0
  for (const [node, deg] of Object.entries(inDegree)) {
    if (deg === 0) queue.push(node);
  }

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node] ?? []) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  if (order.length !== Object.keys(graph).length) {
    console.log("Graph has a cycle; no topological ordering exists.");
  }

  return order;
}

const dag = {
  A: ["C"],
  B: ["C", "D"],
  C: ["E"],
  D: ["F"],
  E: ["H", "F"],
  F: ["G"],
  G: [],
  H: [],
};

console.log(topologicalSort(dag));`,
      python: "",
    },
    relatedIds: ["bfs", "dfs"],
  },

  /* ------------------------------- Two Sum -------------------------------- */
  {
    id: "two-sum",
    title: "Two Sum (Brute Force & Hash Map)",
    shortDescription:
      "Find indices of two numbers that add up to a target using brute force and hash map solutions.",
    description:
      "Two Sum is a classic interview problem. The naive solution checks all pairs, while the optimal solution uses a hash map to find complements in linear time.",
    category: "searching",
    difficulty: "medium",
    timeComplexity: "O(n) or O(n²)",
    spaceComplexity: "O(1)–O(n)",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)",
      notes:
        "Brute force: O(n²)/O(1). Hash map: O(n)/O(n). Great for demonstrating optimization.",
    },
    tags: ["array", "hash-map", "interview"],
    languages: ["javascript"],
    recommendedInput: "Array of integers and a target sum; e.g., [2,7,11,15], 9.",
    notes:
      "Works well with the performance tab by comparing brute-force and optimized implementations.",
    codeTemplates: {
      javascript: `// O(n^2) brute-force
function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}

// O(n) hash map solution
function twoSumHash(nums, target) {
  const map = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return null;
}

console.log(twoSumBruteForce([2, 7, 11, 15], 9));
console.log(twoSumHash([2, 7, 11, 15], 9));`,
      python: "",
    },
    relatedIds: ["binary-search"],
  },

  /* ----------------------------- Kadane's Algorithm ----------------------- */
  {
    id: "kadane",
    title: "Kadane's Algorithm (Maximum Subarray)",
    shortDescription:
      "Linear-time algorithm to find the maximum sum contiguous subarray.",
    description:
      "Kadane's algorithm iteratively computes the maximum subarray sum ending at each position, keeping track of the global maximum. It runs in O(n) time and uses O(1) extra space.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1)",
    },
    tags: ["dp", "array", "subarray"],
    languages: ["javascript"],
    recommendedInput: "Array of positive and negative integers.",
    notes:
      "Nice example of turning a seemingly quadratic problem into a linear one via DP.",
    codeTemplates: {
      javascript: `function kadane(nums) {
  let best = -Infinity;
  let current = 0;

  for (const value of nums) {
    current = Math.max(value, current + value);
    best = Math.max(best, current);
  }

  return best;
}

console.log(kadane([-2,1,-3,4,-1,2,1,-5,4]));`,
      python: "",
    },
    relatedIds: ["two-sum"],
  },

  /* ------------------------------ Fibonacci DP ---------------------------- */
  {
    id: "fibonacci-dp",
    title: "Fibonacci (Recursive vs DP)",
    shortDescription:
      "Compare naive recursion, memoization, and bottom-up DP for the Fibonacci sequence.",
    description:
      "The Fibonacci sequence is a canonical example of overlapping subproblems. A naive recursive implementation is exponential, while memoization and bottom-up DP achieve linear time.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n) or O(φ^n)",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)",
      notes:
        "Naive recursion: O(φ^n). DP versions: O(n). Illustrates the value of caching.",
    },
    tags: ["dp", "recursion", "memoization"],
    languages: ["javascript"],
    recommendedInput: "Small integer n (e.g., n=10 or n=20) for comparisons.",
    notes:
      "Great for teaching DP trade-offs and showing performance tab differences.",
    codeTemplates: {
      javascript: `// Exponential recursion
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// Memoized top-down DP
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Bottom-up DP
function fibBottomUp(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

for (let i = 0; i <= 10; i++) {
  console.log(i, fibRecursive(i), fibMemo(i), fibBottomUp(i));
}`,
      python: "",
    },
    relatedIds: ["kadane"],
  },

  /* ------------------------------ Coin Change ----------------------------- */
  {
    id: "coin-change",
    title: "Coin Change (Min Coins)",
    shortDescription:
      "Dynamic programming solution to find the minimum number of coins that make a given amount.",
    description:
      "Coin Change is a classic DP problem. The goal is to find the minimum number of coins needed to make up a given amount using unlimited coins of given denominations.",
    category: "dynamic-programming",
    difficulty: "hard",
    timeComplexity: "O(amount * n)",
    spaceComplexity: "O(amount)",
    complexity: {
      best: "O(amount * n)",
      average: "O(amount * n)",
      worst: "O(amount * n)",
      space: "O(amount)",
      notes:
        "Where n is the number of coin denominations. Variants count combinations instead.",
    },
    tags: ["dp", "optimization", "classic"],
    languages: ["javascript"],
    recommendedInput: "Coin array like [1,2,5] and an amount like 11.",
    notes:
      "Good candidate for a future table/matrix visualizer that shows subproblem states.",
    codeTemplates: {
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11));`,
      python: "",
    },
    relatedIds: ["fibonacci-dp"],
  },

  /* ------------------------------ 0/1 Knapsack ---------------------------- */
  {
    id: "knapsack-01",
    title: "0/1 Knapsack",
    shortDescription:
      "DP algorithm for selecting items to maximize value under a weight constraint.",
    description:
      "The 0/1 Knapsack problem chooses a subset of items, each with a weight and value, to maximize value without exceeding the weight capacity. The standard DP solution builds a 2D table of capacities vs. items.",
    category: "dynamic-programming",
    difficulty: "hard",
    timeComplexity: "O(n * W)",
    spaceComplexity: "O(n * W)",
    complexity: {
      best: "O(n * W)",
      average: "O(n * W)",
      worst: "O(n * W)",
      space: "O(n * W)",
      notes: "Pseudo-polynomial in capacity W; good candidate for table visualizer.",
    },
    tags: ["dp", "optimization", "table"],
    languages: ["javascript"],
    recommendedInput:
      "Items like [{w:2,v:3},{w:3,v:4},{w:4,v:5},{w:5,v:8}] and capacity W=5.",
    notes:
      "Dense DP; best visualized with a matrix that shows decisions up to each capacity.",
    codeTemplates: {
      javascript: `function knapsack01(items, capacity) {
  const n = items.length;
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (weight > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weight] + value
        );
      }
    }
  }

  return dp[n][capacity];
}

const items = [
  { weight: 2, value: 3 },
  { weight: 3, value: 4 },
  { weight: 4, value: 5 },
  { weight: 5, value: 8 },
];

console.log(knapsack01(items, 5));`,
      python: "",
    },
    relatedIds: ["coin-change"],
  },

  /* ----------------------------- Python Intro ----------------------------- */
  {
    id: "python-intro-loop",
    title: "Python Loop & Print Basics",
    shortDescription:
      "Introductory Python example using loops, conditionals, and print output.",
    description:
      "A gentle Python example to verify that the playground can execute Python code and display standard output. Uses a FizzBuzz-style loop.",
    category: "searching",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    tags: ["python", "intro"],
    languages: ["python"],
    recommendedInput:
      "Integer range 1..20; modify to experiment with conditional logic.",
    notes:
      "Pairs with the 'stdout' panel so learners can see multiple lines of output from a loop.",
    codeTemplates: {
      python: `def fizz_buzz(n: int) -> str:
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)

for i in range(1, 21):
    print(i, "→", fizz_buzz(i))`,
      javascript: "",
    },
    relatedIds: ["bubble-sort"],
  },

  /* -------------------------- Custom Playground Template ------------------ */
  {
    id: "custom-template",
    title: "Custom Playground Template",
    shortDescription:
      "Minimal JS template for starting any experiment with logging in place.",
    description:
      "A boilerplate template that logs input and transformed data, giving learners a structured starting point without imposing a specific algorithm.",
    category: "sorting",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    tags: ["playground", "template"],
    languages: ["javascript"],
    recommendedInput: "Any array or data structure you want to experiment with.",
    notes:
      "Useful as the default playground code for custom snippets or quick experiments.",
    codeTemplates: {
      javascript: `function main() {
  // TODO: Replace with your own logic.
  const input = [1, 2, 3, 4, 5];
  console.log("Input:", input);

  // Example transformation:
  const squared = input.map((x) => x * x);
  console.log("Squared:", squared);

  return squared;
}

console.log("Result:", main());`,
      python: "",
    },
    relatedIds: ["bubble-sort", "linear-search"],
  },
];

/* -------------------------------------------------------------------------- */
/*  Helper Functions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Returns the algorithm metadata for a given id, or undefined if not found.
 */
export function getAlgorithmById(id: string): AlgorithmMeta | undefined {
  return ALGORITHMS.find((algo) => algo.id === id);
}

/**
 * Simple search helper used by the Library page and any future UI
 * that needs fuzzy-ish search over title, category, and tags.
 */
export function searchAlgorithms(query: string): AlgorithmMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALGORITHMS;

  return ALGORITHMS.filter((algo) => {
    const haystack =
      `${algo.title} ${algo.shortDescription} ${algo.category} ${algo.tags.join(
        " "
      )}`.toLowerCase();
    return haystack.includes(q);
  });
}
