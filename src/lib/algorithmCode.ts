// src/lib/algorithmCode.ts
import type { Language } from "./types";

/**
 * Returns a language-specific starter implementation for the given algorithm id.
 * This code is used by:
 *  - /library -> "Open in Playground"
 *  - /algorithms/[id] -> Reference implementation
 *  - /playground?algo=...&lang=...
 */
export function getAlgorithmCode(
  id: string,
  lang: Language
): string | null {
  switch (id) {
    case "bubble-sort":
      return getBubbleSortCode(lang);
    case "insertion-sort":
      return getInsertionSortCode(lang);
    case "selection-sort":
      return getSelectionSortCode(lang);
    case "merge-sort":
      return getMergeSortCode(lang);
    case "quick-sort":
      return getQuickSortCode(lang);
    case "linear-search":
      return getLinearSearchCode(lang);
    case "binary-search":
      return getBinarySearchCode(lang);
    case "bfs":
      return getBfsCode(lang);
    case "dfs":
      return getDfsCode(lang);
    case "dijkstra":
      return getDijkstraCode(lang);
    case "topological-sort":
      return getTopologicalSortCode(lang);
    case "knapsack-01":
      return getKnapsack01Code(lang);
    default:
      return getDefaultTemplate(lang);
  }
}

/* -------------------------------------------------------------------------- */
/*                                Bubble Sort                                 */
/* -------------------------------------------------------------------------- */

function getBubbleSortCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Bubble Sort in JavaScript
// Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
// Time complexity: O(n^2), Space: O(1)

function bubbleSort(arr) {
  const a = [...arr]; // avoid mutating input
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    // Last i elements are already in place
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        // swap a[j] and a[j + 1]
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }

  return a;
}

const input = [5, 1, 4, 2, 8];
const sorted = bubbleSort(input);
console.log("Input:", input);
console.log("Sorted:", sorted);
`;
  }

  if (lang === "python") {
    return `# Bubble Sort in Python
# Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.
# Time complexity: O(n^2), Space: O(1)

def bubble_sort(arr):
    a = list(arr)  # avoid mutating input
    n = len(a)

    for i in range(n - 1):
        # Last i elements are already in place
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a

input_data = [5, 1, 4, 2, 8]
sorted_data = bubble_sort(input_data)
print("Input:", input_data)
print("Sorted:", sorted_data)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                              Insertion Sort                                */
/* -------------------------------------------------------------------------- */

function getInsertionSortCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Insertion Sort in JavaScript
// Builds the sorted array one item at a time by inserting into the correct position.

function insertionSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;

    // Move elements of a[0..i-1], that are greater than key, to one position ahead
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }

  return a;
}

const input = [3, 1, 4, 2, 9, 0];
const sorted = insertionSort(input);
console.log("Input:", input);
console.log("Sorted:", sorted);
`;
  }

  if (lang === "python") {
    return `# Insertion Sort in Python
# Builds the sorted array one item at a time by inserting into the correct position.

def insertion_sort(arr):
    a = list(arr)
    n = len(a)

    for i in range(1, n):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key

    return a

input_data = [3, 1, 4, 2, 9, 0]
sorted_data = insertion_sort(input_data)
print("Input:", input_data)
print("Sorted:", sorted_data)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                              Selection Sort                                */
/* -------------------------------------------------------------------------- */

function getSelectionSortCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Selection Sort in JavaScript
// Repeatedly selects the minimum element from the unsorted segment and moves it to the front.

function selectionSort(arr) {
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      const temp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = temp;
    }
  }

  return a;
}

const input = [64, 25, 12, 22, 11];
const sorted = selectionSort(input);
console.log("Input:", input);
console.log("Sorted:", sorted);
`;
  }

  // Python version can be added later
  if (lang === "python") {
    return `# Selection Sort in Python

def selection_sort(arr):
    a = list(arr)
    n = len(a)

    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if a[j] < a[min_idx]:
                min_idx = j
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
    return a

input_data = [64, 25, 12, 22, 11]
sorted_data = selection_sort(input_data)
print("Input:", input_data)
print("Sorted:", sorted_data)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                                Merge Sort                                  */
/* -------------------------------------------------------------------------- */

function getMergeSortCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Merge Sort in JavaScript
// Divide-and-conquer sorting algorithm that splits the array, sorts the halves, and merges them.

function merge(left, right) {
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

  // Concatenate remaining elements
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

const input = [38, 27, 43, 3, 9, 82, 10];
const sorted = mergeSort(input);
console.log("Input:", input);
console.log("Sorted:", sorted);
`;
  }

  if (lang === "python") {
    return `# Merge Sort in Python

def merge(left, right):
    result = []
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

def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

input_data = [38, 27, 43, 3, 9, 82, 10]
sorted_data = merge_sort(input_data)
print("Input:", input_data)
print("Sorted:", sorted_data)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                                Quick Sort                                  */
/* -------------------------------------------------------------------------- */

function getQuickSortCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Quick Sort in JavaScript
// Uses divide-and-conquer with a pivot to partition the array.

function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) continue;
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(left).concat(pivot, quickSort(right));
}

const input = [10, 7, 8, 9, 1, 5];
const sorted = quickSort(input);
console.log("Input:", input);
console.log("Sorted:", sorted);
`;
  }

  if (lang === "python") {
    return `# Quick Sort in Python
# Uses divide-and-conquer with a pivot to partition the array.

def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot_index = len(arr) // 2
    pivot = arr[pivot_index]
    left = []
    right = []

    for i, value in enumerate(arr):
        if i == pivot_index:
            continue
        if value < pivot:
            left.append(value)
        else:
            right.append(value)

    return quick_sort(left) + [pivot] + quick_sort(right)

input_data = [10, 7, 8, 9, 1, 5]
sorted_data = quick_sort(input_data)
print("Input:", input_data)
print("Sorted:", sorted_data)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                               Linear Search                                */
/* -------------------------------------------------------------------------- */

function getLinearSearchCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Linear Search in JavaScript
// Scans each element of the array until it finds the target or reaches the end.

function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // index of target
    }
  }
  return -1; // not found
}

const array = [2, 4, 6, 8, 10];
const target = 6;
const index = linearSearch(array, target);

console.log("Array:", array);
console.log("Target:", target);
console.log("Index:", index);
`;
  }

  if (lang === "python") {
    return `# Linear Search in Python

def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i  # index of target
    return -1

array = [2, 4, 6, 8, 10]
target = 6
index = linear_search(array, target)

print("Array:", array)
print("Target:", target)
print("Index:", index)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                               Binary Search                                */
/* -------------------------------------------------------------------------- */

function getBinarySearchCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Binary Search in JavaScript
// Requires a sorted array. Repeatedly divides the search interval in half.

function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const midVal = arr[mid];

    if (midVal === target) {
      return mid;
    } else if (midVal < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return -1;
}

const array = [1, 3, 5, 7, 9, 11];
const target = 7;
const index = binarySearch(array, target);

console.log("Array:", array);
console.log("Target:", target);
console.log("Index:", index);
`;
  }

  if (lang === "python") {
    return `# Binary Search in Python
# Requires a sorted array. Repeatedly divides the search interval in half.

def binary_search(arr, target):
    lo = 0
    hi = len(arr) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        mid_val = arr[mid]
        if mid_val == target:
            return mid
        elif mid_val < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

array = [1, 3, 5, 7, 9, 11]
target = 7
index = binary_search(array, target)

print("Array:", array)
print("Target:", target)
print("Index:", index)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                               Breadth-First Search                         */
/* -------------------------------------------------------------------------- */

function getBfsCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Breadth-First Search (BFS) in JavaScript
// Traverses a graph level by level using a queue.

function bfs(adjList, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    console.log("Visited:", node);

    const neighbors = adjList[node] ?? [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
}

const graph = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [4],
  4: [],
};

bfs(graph, 0);
`;
  }

  if (lang === "python") {
    return `# Breadth-First Search (BFS) in Python
from collections import deque

def bfs(adj_list, start):
    visited = set([start])
    queue = deque([start])

    while queue:
        node = queue.popleft()
        print("Visited:", node)

        for neighbor in adj_list.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

graph = {
    0: [1, 2],
    1: [3],
    2: [3],
    3: [4],
    4: [],
}

bfs(graph, 0)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                               Depth-First Search                           */
/* -------------------------------------------------------------------------- */

function getDfsCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Depth-First Search (DFS) in JavaScript
// Recursively explores as far as possible along each branch.

function dfs(adjList, node, visited = new Set()) {
  if (visited.has(node)) return;
  visited.add(node);
  console.log("Visited:", node);

  const neighbors = adjList[node] ?? [];
  for (const next of neighbors) {
    dfs(adjList, next, visited);
  }
}

const graph = {
  0: [1, 2],
  1: [3],
  2: [3],
  3: [4],
  4: [],
};

dfs(graph, 0);
`;
  }

  if (lang === "python") {
    return `# Depth-First Search (DFS) in Python

def dfs(adj_list, node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return
    visited.add(node)
    print("Visited:", node)

    for neighbor in adj_list.get(node, []):
        dfs(adj_list, neighbor, visited)

graph = {
    0: [1, 2],
    1: [3],
    2: [3],
    3: [4],
    4: [],
}

dfs(graph, 0)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                              Dijkstra's Algorithm                          */
/* -------------------------------------------------------------------------- */

function getDijkstraCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Dijkstra's Shortest Path Algorithm in JavaScript
// Works for graphs with non-negative edge weights.

function dijkstra(graph, source) {
  const dist = {};
  const visited = new Set();

  for (const node in graph) {
    dist[node] = Infinity;
  }
  dist[source] = 0;

  while (visited.size < Object.keys(graph).length) {
    let current = null;
    let currentDist = Infinity;

    for (const node in dist) {
      if (!visited.has(node) && dist[node] < currentDist) {
        currentDist = dist[node];
        current = node;
      }
    }

    if (current === null) break;
    visited.add(current);

    const neighbors = graph[current] ?? [];
    for (const { to, weight } of neighbors) {
      const newDist = dist[current] + weight;
      if (newDist < dist[to]) {
        dist[to] = newDist;
      }
    }
  }

  return dist;
}

const weightedGraph = {
  A: [{ to: "B", weight: 4 }, { to: "C", weight: 2 }],
  B: [{ to: "C", weight: 5 }, { to: "D", weight: 10 }],
  C: [{ to: "E", weight: 3 }],
  D: [{ to: "F", weight: 11 }],
  E: [{ to: "D", weight: 4 }],
  F: [],
};

const distances = dijkstra(weightedGraph, "A");
console.log("Shortest distances from A:", distances);
`;
  }

  if (lang === "python") {
    return `# Dijkstra's Shortest Path Algorithm in Python

import heapq

def dijkstra(graph, source):
    dist = {node: float("inf") for node in graph}
    dist[source] = 0

    heap = [(0, source)]

    while heap:
        current_dist, node = heapq.heappop(heap)
        if current_dist > dist[node]:
            continue

        for neighbor, weight in graph.get(node, []):
            new_dist = current_dist + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    return dist

weighted_graph = {
    "A": [("B", 4), ("C", 2)],
    "B": [("C", 5), ("D", 10)],
    "C": [("E", 3)],
    "D": [("F", 11)],
    "E": [("D", 4)],
    "F": [],
}

distances = dijkstra(weighted_graph, "A")
print("Shortest distances from A:", distances)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                            Topological Sort (Kahn)                         */
/* -------------------------------------------------------------------------- */

function getTopologicalSortCode(lang: Language): string | null {
  if (lang === "javascript") {
    return `// Topological Sort (Kahn's Algorithm) in JavaScript
// Works on Directed Acyclic Graphs (DAGs).

function topologicalSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  const indegree = Array(numNodes).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    indegree[v]++;
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
    }
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const next of adj[node]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  if (order.length !== numNodes) {
    console.log("Graph has a cycle, no valid topological ordering.");
  } else {
    console.log("Topological order:", order);
  }
}

const edges = [
  [5, 2],
  [5, 0],
  [4, 0],
  [4, 1],
  [2, 3],
  [3, 1],
];

topologicalSort(6, edges);
`;
  }

  if (lang === "python") {
    return `# Topological Sort (Kahn's Algorithm) in Python
from collections import deque

def topological_sort(num_nodes, edges):
    adj = [[] for _ in range(num_nodes)]
    indegree = [0] * num_nodes

    for u, v in edges:
        adj[u].append(v)
        indegree[v] += 1

    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for nxt in adj[node]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)

    if len(order) != num_nodes:
        print("Graph has a cycle, no valid topological ordering.")
    else:
        print("Topological order:", order)

edges = [
    (5, 2),
    (5, 0),
    (4, 0),
    (4, 1),
    (2, 3),
    (3, 1),
]

topological_sort(6, edges)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                              0/1 Knapsack (DP)                             */
/* -------------------------------------------------------------------------- */

function getKnapsack01Code(lang: Language): string | null {
  if (lang === "javascript") {
    return `// 0/1 Knapsack (Dynamic Programming) in JavaScript

function knapsack01(weights, values, capacity) {
  const n = weights.length;
  // dp[i][w] = best value using first i items and capacity w
  const dp = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const wt = weights[i - 1];
    const val = values[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (wt > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - wt] + val
        );
      }
    }
  }

  return dp[n][capacity];
}

const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 5;

const best = knapsack01(weights, values, capacity);
console.log("Best achievable value:", best);
`;
  }

  if (lang === "python") {
    return `# 0/1 Knapsack (Dynamic Programming) in Python

def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        wt = weights[i - 1]
        val = values[i - 1]

        for w in range(capacity + 1):
            if wt > w:
                dp[i][w] = dp[i - 1][w]
            else:
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wt] + val)

    return dp[n][capacity]

weights = [2, 3, 4, 5]
values = [3, 4, 5, 6]
capacity = 5

best = knapsack_01(weights, values, capacity)
print("Best achievable value:", best)
`;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*                            Default Templates                               */
/* -------------------------------------------------------------------------- */

function getDefaultTemplate(lang: Language): string {
  if (lang === "javascript") {
    return `// Playground starter (JavaScript)
// Write any JS code here and use console.log to inspect values.

function main() {
  console.log("Hello from the JavaScript playground!");
}

main();
`;
  }

  // default Python
  return `# Playground starter (Python)
# Write any Python code here and use print() to inspect values.

def main():
    print("Hello from the Python playground!")

if __name__ == "__main__":
    main()
`;
}
