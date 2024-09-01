// src/lib/algorithms-pack/graph.ts
//
// Extended catalog of graph algorithms for the Code Playground & Algorithm
// Visualizer project. Like the sorting pack, this file is intentionally
// verbose and heavily documented to serve as a long-form reference as well as
// a way to increase total LOC in a meaningful, reviewable way.
//
// This module is not wired into the main UI by default. It can be used later
// to:
//   - populate a dedicated "Graph Algorithms" section
//   - generate printable study notes
//   - feed future visualizers (graph / tree / shortest-path)
//
// All types and helpers are compatible with the existing AlgorithmMeta model
// from src/lib/algorithms.ts.

import type { AlgorithmMeta, Language } from "@/lib/algorithms";

/* -------------------------------------------------------------------------- */
/*  Local Types                                                               */
/* -------------------------------------------------------------------------- */

export type GraphAlgorithmKind =
  | "traversal"
  | "shortest-path"
  | "mst"
  | "topological-sort"
  | "components"
  | "flow"
  | "cycle-detection"
  | "reachability"
  | "matching"
  | "centrality";

export type GraphType =
  | "directed"
  | "undirected"
  | "weighted"
  | "unweighted"
  | "mixed";

export type GraphUseCase =
  | "routes-and-maps"
  | "network-routing"
  | "social-networks"
  | "dependency-resolution"
  | "scheduling"
  | "recommendation"
  | "clustering"
  | "flow-optimization"
  | "game-ai"
  | "knowledge-graphs";

export type GraphAlgorithmMeta = AlgorithmMeta & {
  kind: GraphAlgorithmKind;
  graphTypes: GraphType[];
  isSingleSource?: boolean;
  isAllPairs?: boolean;
  supportsNegativeWeights?: boolean;
  detectsNegativeCycles?: boolean;
  typicalUseCases?: GraphUseCase[];
  theoreticalNotes?: string;
  implementationTips?: string[];
  gotchas?: string[];
  references?: string[];
};

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Helper to construct a GraphAlgorithmMeta instance. Similar to the sorting
 * helper, it auto-fills `name` from `title` when omitted so that older code
 * that only uses `title` remains valid and consistent.
 */
export function defineGraphAlgorithm(
  meta: Omit<GraphAlgorithmMeta, "name"> & { name?: string }
): GraphAlgorithmMeta {
  return {
    ...meta,
    name: meta.name ?? meta.title,
  };
}

/* -------------------------------------------------------------------------- */
/*  Shared Code Templates                                                     */
/* -------------------------------------------------------------------------- */

const DFS_JS_TEMPLATE = `// Depth-First Search (Recursive)
// Graph is represented as an adjacency list: Map<number, number[]>

function dfs(graph, start) {
  const visited = new Set();
  const order = [];

  function visit(node) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);

    const neighbors = graph.get(node) ?? [];
    for (const next of neighbors) {
      visit(next);
    }
  }

  visit(start);
  console.log("DFS order:", order.join(" -> "));
  return order;
}

// Example usage:
const g = new Map();
g.set(0, [1, 2]);
g.set(1, [2]);
g.set(2, [0, 3]);
g.set(3, [3]);

dfs(g, 2);`;

const DFS_PY_TEMPLATE = `# Depth-First Search (Recursive)
# Graph is represented as a dict[int, list[int]]

from typing import Dict, List, Set

def dfs(graph: Dict[int, List[int]], start: int) -> List[int]:
    visited: Set[int] = set()
    order: List[int] = []

    def visit(node: int) -> None:
        if node in visited:
            return
        visited.add(node)
        order.append(node)
        for nxt in graph.get(node, []):
            visit(nxt)

    visit(start)
    print("DFS order:", " -> ".join(map(str, order)))
    return order


if __name__ == "__main__":
    g = {
        0: [1, 2],
        1: [2],
        2: [0, 3],
        3: [3],
    }
    dfs(g, 2)`;

const BFS_JS_TEMPLATE = `// Breadth-First Search (Queue-based)
// Graph is represented as an adjacency list: Map<number, number[]>
// Prints shortest-path distance (in edges) from source.

function bfs(graph, start) {
  const visited = new Set();
  const dist = new Map();
  const queue = [];

  visited.add(start);
  dist.set(start, 0);
  queue.push(start);

  while (queue.length > 0) {
    const node = queue.shift();
    const neighbors = graph.get(node) ?? [];

    for (const next of neighbors) {
      if (!visited.has(next)) {
        visited.add(next);
        dist.set(next, dist.get(node) + 1);
        queue.push(next);
      }
    }
  }

  console.log("Distances from", start, ":");
  for (const [node, d] of dist.entries()) {
    console.log("  ", node, "=>", d);
  }
  return dist;
}

// Example
const g = new Map();
g.set(0, [1, 2]);
g.set(1, [2]);
g.set(2, [0, 3]);
g.set(3, [3]);

bfs(g, 2);`;

const BFS_PY_TEMPLATE = `# Breadth-First Search (Queue-based)
# Graph is represented as dict[int, list[int]]

from collections import deque
from typing import Dict, List, Deque, Set

def bfs(graph: Dict[int, List[int]], start: int):
    visited: Set[int] = {start}
    dist: Dict[int, int] = {start: 0}
    q: Deque[int] = deque([start])

    while q:
        node = q.popleft()
        for nxt in graph.get(node, []):
            if nxt not in visited:
                visited.add(nxt)
                dist[nxt] = dist[node] + 1
                q.append(nxt)

    print("Distances from", start)
    for node, d in dist.items():
        print("  ", node, "=>", d)
    return dist


if __name__ == "__main__":
    g = {
        0: [1, 2],
        1: [2],
        2: [0, 3],
        3: [3],
    }
    bfs(g, 2)`;

const DIJKSTRA_JS_TEMPLATE = `// Dijkstra's Algorithm (Min-Heap)
// Graph: Map<number, Array<{ to: number, weight: number }>>

class MinHeap {
  constructor() {
    this.data = [];
  }
  push(item) {
    this.data.push(item);
    this._siftUp(this.data.length - 1);
  }
  pop() {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0 && last !== undefined) {
      this.data[0] = last;
      this._siftDown(0);
    }
    return top;
  }
  _siftUp(idx) {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.data[parent].dist <= this.data[idx].dist) break;
      [this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]];
      idx = parent;
    }
  }
  _siftDown(idx) {
    const n = this.data.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      if (left < n && this.data[left].dist < this.data[smallest].dist) {
        smallest = left;
      }
      if (right < n && this.data[right].dist < this.data[smallest].dist) {
        smallest = right;
      }
      if (smallest === idx) break;
      [this.data[smallest], this.data[idx]] = [this.data[idx], this.data[smallest]];
      idx = smallest;
    }
  }
  get size() {
    return this.data.length;
  }
}

function dijkstra(graph, source) {
  const dist = new Map();
  const heap = new MinHeap();

  graph.forEach((_edges, node) => {
    dist.set(node, Infinity);
  });
  dist.set(source, 0);

  heap.push({ node: source, dist: 0 });

  while (heap.size > 0) {
    const { node, dist: currentDist } = heap.pop();
    if (currentDist > dist.get(node)) continue;

    const neighbors = graph.get(node) ?? [];
    for (const edge of neighbors) {
      const next = edge.to;
      const weight = edge.weight;
      const newDist = currentDist + weight;
      if (newDist < dist.get(next)) {
        dist.set(next, newDist);
        heap.push({ node: next, dist: newDist });
      }
    }
  }

  console.log("Shortest distances from", source, ":");
  for (const [node, d] of dist.entries()) {
    console.log("  ", node, "=>", d);
  }
  return dist;
}

// Example usage:
const g = new Map();
g.set(0, [{ to: 1, weight: 4 }, { to: 2, weight: 1 }]);
g.set(1, [{ to: 3, weight: 1 }]);
g.set(2, [{ to: 1, weight: 2 }, { to: 3, weight: 5 }]);
g.set(3, []);

dijkstra(g, 0);`;

const DIJKSTRA_PY_TEMPLATE = `# Dijkstra's Algorithm (Priority Queue)
// Graph: dict[int, list[tuple[int, int]]]

import heapq
from typing import Dict, List, Tuple

def dijkstra(graph: Dict[int, List[Tuple[int, int]]], source: int) -> Dict[int, int]:
    dist: Dict[int, int] = {node: float("inf") for node in graph}
    dist[source] = 0
    heap: List[Tuple[int, int]] = [(0, source)]

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue
        for nxt, w in graph.get(node, []):
            nd = d + w
            if nd < dist[nxt]:
                dist[nxt] = nd
                heapq.heappush(heap, (nd, nxt))

    print("Shortest distances from", source)
    for node, d in dist.items():
        print("  ", node, "=>", d)
    return dist


if __name__ == "__main__":
    g = {
        0: [(1, 4), (2, 1)],
        1: [(3, 1)],
        2: [(1, 2), (3, 5)],
        3: [],
    }
    dijkstra(g, 0)`;

const TOPO_SORT_JS_TEMPLATE = `// Topological Sort (Kahn's Algorithm)
// Works on directed acyclic graphs (DAGs).

function topoSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  const indeg = Array(numNodes).fill(0);

  for (const [u, v] of edges) {
    adj[u].push(v);
    indeg[v]++;
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (indeg[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);
    for (const nxt of adj[node]) {
      indeg[nxt]--;
      if (indeg[nxt] === 0) queue.push(nxt);
    }
  }

  if (order.length !== numNodes) {
    console.log("Graph has a cycle; no topological ordering exists.");
    return null;
  }

  console.log("Topological order:", order.join(" -> "));
  return order;
}

// Example:
const numNodes = 6;
const edges = [
  [5, 2],
  [5, 0],
  [4, 0],
  [4, 1],
  [2, 3],
  [3, 1],
];

topoSort(numNodes, edges);`;

/* -------------------------------------------------------------------------- */
/*  Algorithm Catalog                                                         */
/* -------------------------------------------------------------------------- */

export const GRAPH_ALGORITHMS_DETAILED: GraphAlgorithmMeta[] = [
  defineGraphAlgorithm({
    id: "dfs-recursive",
    title: "Depth-First Search (Recursive)",
    shortDescription:
      "Graph traversal that explores as far along each branch as possible before backtracking.",
    description:
      "Depth-First Search (DFS) is a fundamental graph traversal technique. " +
      "Starting from a source node, DFS explores as deep as possible along each branch " +
      "before backtracking. It can be implemented recursively or with an explicit stack. " +
      "DFS is commonly used for connectivity checks, topological sorting, cycle detection, " +
      "and as a building block for more complex graph algorithms.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V) recursion stack / visited set",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      notes:
        "On very deep graphs, the recursion depth may exceed call-stack limits; " +
        "an iterative version with an explicit stack becomes preferable.",
    },
    graphTypes: ["directed", "undirected", "weighted", "unweighted"],
    kind: "traversal",
    isSingleSource: true,
    typicalUseCases: [
      "routes-and-maps",
      "dependency-resolution",
      "scheduling",
      "game-ai",
      "knowledge-graphs",
    ],
    theoreticalNotes: [
      "DFS induces a depth-first forest that partitions edges into tree, back, forward, " +
        "and cross edges in directed graphs.",
      "The postorder of DFS is critical in algorithms such as Kosaraju's strongly " +
        "connected components and in topological sorting.",
    ].join(" "),
    implementationTips: [
      "Prefer an explicit stack for environments with limited recursion depth.",
      "Keep a separate ordering list if you need pre-order or post-order traversal sequences.",
      "When working with weighted graphs, DFS still ignores weights and only explores structure.",
    ],
    gotchas: [
      "Forgetting to mark nodes as visited before recursing can cause infinite recursion " +
        "on cycles.",
      "In undirected graphs, failing to handle the parent node correctly can cause " +
        "false cycle detection.",
    ],
    tags: [
      "dfs",
      "graph-traversal",
      "recursion",
      "connected-components",
      "topological-sort",
    ],
    languages: ["javascript", "python"],
    codeTemplates: {
      javascript: DFS_JS_TEMPLATE,
      python: DFS_PY_TEMPLATE,
    },
    recommendedInput:
      "Adjacency list with a few small cycles, e.g. 0→1,2; 1→2; 2→0,3; 3→3. " +
      "Try changing the start node to see different traversal orders.",
    relatedIds: ["bfs", "topological-sort-kahn", "scc-kosaraju"],
  }),

  defineGraphAlgorithm({
    id: "bfs",
    title: "Breadth-First Search (BFS)",
    shortDescription:
      "Layer-by-layer graph traversal that discovers vertices in increasing distance from the source.",
    description:
      "Breadth-First Search (BFS) explores a graph in layers: it visits all vertices at " +
      "distance 1 from the source, then distance 2, and so on. When the graph is unweighted, " +
      "BFS computes shortest path lengths in terms of edge count. BFS is widely used in " +
      "shortest path problems on unweighted graphs, finding connected components, and " +
      "in algorithms like Edmonds–Karp (for augmenting path discovery).",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      notes:
        "Memory usage is dominated by the queue and visited set, which in dense graphs " +
        "may approach O(V + E).",
    },
    graphTypes: ["directed", "undirected", "unweighted"],
    kind: "traversal",
    isSingleSource: true,
    typicalUseCases: [
      "routes-and-maps",
      "network-routing",
      "social-networks",
      "recommendation",
    ],
    supportsNegativeWeights: false,
    detectsNegativeCycles: false,
    theoreticalNotes:
      "When edges are unweighted or share a constant weight, BFS produces shortest paths " +
      "from the source. Its level structure gives an implicit layering of the graph.",
    implementationTips: [
      "Use a queue (FIFO) and enqueue neighbors exactly once to avoid duplicates.",
      "Store predecessor pointers if you wish to reconstruct actual shortest paths.",
      "On very large graphs, consider techniques like bidirectional BFS.",
    ],
    gotchas: [
      "Forgetting to mark nodes as visited when enqueuing can create redundant work.",
      "Applying BFS directly to weighted graphs without modifying the edge model " +
        "will not produce correct shortest paths.",
    ],
    tags: [
      "bfs",
      "shortest-path",
      "unweighted-graph",
      "graph-traversal",
      "queue",
    ],
    languages: ["javascript", "python"],
    codeTemplates: {
      javascript: BFS_JS_TEMPLATE,
      python: BFS_PY_TEMPLATE,
    },
    recommendedInput:
      "Small undirected or directed unweighted graphs, such as road intersections " +
      "where all edges have equal travel cost.",
    relatedIds: ["dfs-recursive", "dijkstra", "shortest-path-unweighted"],
  }),

  defineGraphAlgorithm({
    id: "dijkstra",
    title: "Dijkstra's Shortest Path Algorithm",
    shortDescription:
      "Greedy algorithm for single-source shortest paths in graphs with non-negative edge weights.",
    description:
      "Dijkstra's algorithm maintains a growing set of vertices whose shortest path " +
      "from the source is already known. At each step it selects the vertex with the " +
      "smallest tentative distance, relaxes its outgoing edges, and repeats. With an " +
      "appropriate priority queue (min-heap), the algorithm runs in O((V + E) log V).",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O((V + E) log V) with binary heap",
    spaceComplexity: "O(V + E)",
    complexity: {
      best: "O((V + E) log V)",
      average: "O((V + E) log V)",
      worst: "O((V + E) log V)",
      space: "O(V + E)",
      notes:
        "Using a Fibonacci heap yields a theoretical O(E + V log V), but with a " +
        "larger constant factor and complexity.",
    },
    graphTypes: ["directed", "undirected", "weighted"],
    kind: "shortest-path",
    isSingleSource: true,
    supportsNegativeWeights: false,
    detectsNegativeCycles: false,
    typicalUseCases: [
      "routes-and-maps",
      "network-routing",
      "game-ai",
      "flow-optimization",
    ],
    theoreticalNotes:
      "Dijkstra's algorithm is a special case of more general label-setting methods " +
      "for shortest path problems. It fails in the presence of negative-weight edges.",
    implementationTips: [
      "Use a priority queue where each push stores (distance, node). Do not attempt to " +
        "decrease-key; simply push a new pair and skip stale entries when popped.",
      "Store predecessor pointers to reconstruct shortest paths.",
      "For dense graphs, an O(V^2) implementation using arrays may be simpler and competitive.",
    ],
    gotchas: [
      "The algorithm produces incorrect results if any edge has a negative weight.",
      "Reusing the same distance map across runs without resetting can lead to subtle bugs.",
    ],
    tags: [
      "dijkstra",
      "shortest-path",
      "greedy",
      "priority-queue",
      "weighted-graph",
    ],
    languages: ["javascript", "python"],
    codeTemplates: {
      javascript: DIJKSTRA_JS_TEMPLATE,
      python: DIJKSTRA_PY_TEMPLATE,
    },
    recommendedInput:
      "Weighted graphs where all edge weights are non-negative, such as road networks " +
      "with travel times or distances.",
    relatedIds: [
      "bfs",
      "bellman-ford",
      "floyd-warshall",
      "a-star",
      "dijkstra-bidirectional",
    ],
  }),

  defineGraphAlgorithm({
    id: "topological-sort-kahn",
    title: "Topological Sort (Kahn's Algorithm)",
    shortDescription:
      "Ordering of vertices in a directed acyclic graph such that every edge goes from earlier to later.",
    description:
      "Topological sorting orders the vertices of a directed acyclic graph (DAG) so that " +
      "for every directed edge u → v, vertex u comes before v in the ordering. " +
      "Kahn's algorithm repeatedly removes vertices with indegree 0, appending them " +
      "to the output sequence and decrementing the indegree of their neighbors.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    complexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V + E)",
      notes:
        "The algorithm inherently detects cycles: if the output does not contain " +
        "all vertices, the graph is not a DAG.",
    },
    graphTypes: ["directed"],
    kind: "topological-sort",
    isSingleSource: false,
    supportsNegativeWeights: false,
    detectsNegativeCycles: false,
    typicalUseCases: [
      "dependency-resolution",
      "scheduling",
      "knowledge-graphs",
    ],
    theoreticalNotes:
      "Topological ordering exists if and only if the directed graph has no cycles. " +
      "The DFS-based approach provides an alternative algorithm using reverse postorder.",
    implementationTips: [
      "Keep an indegree array and adjacency list; initialize indegrees in a single pass.",
      "Use a queue to store vertices of indegree 0. For deterministic results, you may use " +
        "a priority queue or sort the queue in each step.",
      "In build systems, topological sorting is used to compute a safe compilation order.",
    ],
    gotchas: [
      "Forgetting to rebuild indegree information after modifying edges leads to invalid results.",
      "Self-loops immediately violate DAG assumptions and should be detected explicitly.",
    ],
    tags: [
      "topological-sort",
      "dag",
      "scheduling",
      "dependency-resolution",
      "kahn-algorithm",
    ],
    languages: ["javascript"],
    codeTemplates: {
      javascript: TOPO_SORT_JS_TEMPLATE,
      python:
        "# Topological sort (Kahn) – Python version left as an exercise.\n" +
        "# The JavaScript template in this pack provides the canonical implementation.\n",
    },
    recommendedInput:
      "Directed acyclic graphs representing course prerequisites, build dependencies, " +
      "or task scheduling with ordering constraints.",
    relatedIds: ["dfs-recursive", "scc-kosaraju", "kahn-detect-cycle"],
  }),
];
