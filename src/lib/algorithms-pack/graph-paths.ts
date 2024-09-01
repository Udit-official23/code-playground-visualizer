// src/lib/algorithms-pack/graph-paths.ts
//
// Graph & Paths algorithm catalog for the Code Playground & Algorithm
// Visualizer.
//
// This module is intentionally verbose and heavily documented so that it adds
// meaningful LOC while staying genuinely educational. Each algorithm is
// compatible with AlgorithmMeta from src/lib/algorithms.ts and plugs into
// the same ecosystem as the Sorting / Searching / DP packs.

import type { AlgorithmMeta } from "@/lib/algorithms";

/* -------------------------------------------------------------------------- */
/*  Local Types                                                               */
/* -------------------------------------------------------------------------- */

export type GraphAlgorithmKind =
  | "traversal"
  | "shortest-path"
  | "minimum-spanning-tree"
  | "topological-sort";

export type GraphRepresentation =
  | "adjacency-list"
  | "adjacency-matrix"
  | "edge-list";

export interface GraphAlgorithmMeta extends AlgorithmMeta {
  graphKind: GraphAlgorithmKind;
  representation: GraphRepresentation;
  directed: boolean;
  weighted: boolean;
  typicalUseCases: string[];
  /**
   * Extra notes on constraints for which this algorithm is usually chosen,
   * e.g. "dense graphs" vs "sparse graphs", or small vs large vertex counts.
   */
  constraintProfile?: string;
}

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

export function defineGraphAlgorithm(
  meta: Omit<GraphAlgorithmMeta, "name"> & { name?: string }
): GraphAlgorithmMeta {
  return {
    ...meta,
    // We keep title and name in sync so other parts of the app can safely
    // rely on a stable "name" field for tables / dropdowns.
    name: meta.name ?? meta.title,
  };
}

/* -------------------------------------------------------------------------- */
/*  Code Templates                                                            */
/* -------------------------------------------------------------------------- */
/**
 * All templates are standalone scripts users can paste into the playground.
 * They use simple I/O via console.log / print and keep the signatures small.
 */

/* --------------------------------- BFS ------------------------------------ */

const BFS_JS = `// Breadth-First Search (BFS) on an unweighted graph
// -------------------------------------------------------------
// We represent the graph as an adjacency list:
//   const graph = {
//     A: ["B", "C"],
//     B: ["A", "D"],
//     ...
//   };
//
// BFS explores the graph in layers and is ideal for computing the shortest
// path in an unweighted graph (in terms of edge count).

function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  const parent = { [start]: null };

  while (queue.length > 0) {
    const node = queue.shift();
    console.log("Visiting:", node);

    const neighbors = graph[node] || [];
    for (const nei of neighbors) {
      if (!visited.has(nei)) {
        visited.add(nei);
        parent[nei] = node;
        queue.push(nei);
      }
    }
  }

  return { visited, parent };
}

function reconstructPath(parent, target) {
  const path = [];
  let curr = target;
  while (curr != null) {
    path.push(curr);
    curr = parent[curr];
  }
  return path.reverse();
}

function runBFSDemo() {
  const graph = {
    A: ["B", "C"],
    B: ["A", "D", "E"],
    C: ["A", "F"],
    D: ["B"],
    E: ["B", "F"],
    F: ["C", "E"],
  };

  const start = "A";
  const target = "F";
  const { visited, parent } = bfs(graph, start);

  console.log("Visited order:", Array.from(visited));
  console.log("Parents map:", parent);
  console.log("Shortest path from", start, "to", target, "=", reconstructPath(parent, target));
}

runBFSDemo();`;

const BFS_PY = `# Breadth-First Search (BFS) on an unweighted graph
# -------------------------------------------------------------
# Graph represented as an adjacency list:
#   graph = {
#       "A": ["B", "C"],
#       "B": ["A", "D"],
#       ...
#   }

from collections import deque
from typing import Dict, List, Optional, Set, Tuple


def bfs(graph: Dict[str, List[str]], start: str) -> Tuple[Set[str], Dict[str, Optional[str]]]:
    queue: deque[str] = deque([start])
    visited: Set[str] = {start}
    parent: Dict[str, Optional[str]] = {start: None}

    while queue:
        node = queue.popleft()
        print("Visiting:", node)
        for nei in graph.get(node, []):
            if nei not in visited:
                visited.add(nei)
                parent[nei] = node
                queue.append(nei)
    return visited, parent


def reconstruct_path(parent: Dict[str, Optional[str]], target: str) -> List[str]:
    path: List[str] = []
    curr: Optional[str] = target
    while curr is not None:
        path.append(curr)
        curr = parent.get(curr)
    return list(reversed(path))


def run_bfs_demo() -> None:
    graph = {
        "A": ["B", "C"],
        "B": ["A", "D", "E"],
        "C": ["A", "F"],
        "D": ["B"],
        "E": ["B", "F"],
        "F": ["C", "E"],
    }
    start = "A"
    target = "F"
    visited, parent = bfs(graph, start)
    print("Visited order:", visited)
    print("Parent map:", parent)
    print("Shortest path from", start, "to", target, "=", reconstruct_path(parent, target))


if __name__ == "__main__":
    run_bfs_demo()`;

/* --------------------------------- DFS ------------------------------------ */

const DFS_JS = `// Depth-First Search (DFS) on a graph
// -------------------------------------------------------------
// DFS explores as far as possible along each branch before backtracking.
// This implementation uses recursion and records entry / exit times that are
// often useful in graph algorithms (e.g. detecting back edges).

function dfs(graph, start) {
  const visited = new Set();
  const entryTime = {};
  const exitTime = {};
  let time = 0;

  function explore(node) {
    visited.add(node);
    entryTime[node] = time++;
    console.log("Enter", node, "at time", entryTime[node]);

    for (const nei of graph[node] || []) {
      if (!visited.has(nei)) {
        explore(nei);
      }
    }

    exitTime[node] = time++;
    console.log("Exit", node, "at time", exitTime[node]);
  }

  explore(start);
  return { visited, entryTime, exitTime };
}

function runDFSDemo() {
  const graph = {
    A: ["B", "C"],
    B: ["D"],
    C: ["E"],
    D: ["F"],
    E: [],
    F: [],
  };

  const { visited, entryTime, exitTime } = dfs(graph, "A");
  console.log("Visited:", Array.from(visited));
  console.log("Entry times:", entryTime);
  console.log("Exit times:", exitTime);
}

runDFSDemo();`;

const DFS_PY = `# Depth-First Search (DFS) on a graph
# -------------------------------------------------------------
from typing import Dict, List, Set, Tuple


def dfs(graph: Dict[str, List[str]], start: str):
    visited: Set[str] = set()
    entry_time: Dict[str, int] = {}
    exit_time: Dict[str, int] = {}
    time = 0

    def explore(node: str) -> None:
        nonlocal time
        visited.add(node)
        entry_time[node] = time
        print("Enter", node, "at time", time)
        time += 1

        for nei in graph.get(node, []):
            if nei not in visited:
                explore(nei)

        exit_time[node] = time
        print("Exit", node, "at time", time)
        time += 1

    explore(start)
    return visited, entry_time, exit_time


def run_dfs_demo() -> None:
    graph = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": ["E"],
        "D": ["F"],
        "E": [],
        "F": [],
    }
    visited, entry_time, exit_time = dfs(graph, "A")
    print("Visited:", visited)
    print("Entry times:", entry_time)
    print("Exit times:", exit_time)


if __name__ == "__main__":
    run_dfs_demo()`;

/* ----------------------------- Dijkstra (Heap) ----------------------------- */

const DIJKSTRA_JS = `// Dijkstra's Algorithm (Shortest Path) using a binary heap
// -------------------------------------------------------------
// Graph is represented as adjacency list with weighted edges:
//   const graph = {
//     A: [{ to: "B", weight: 4 }, { to: "C", weight: 1 }],
//     ...
//   };
//
// All edge weights must be non-negative for Dijkstra to be correct.

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

  isEmpty() {
    return this.data.length === 0;
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
      const left = idx * 2 + 1;
      const right = idx * 2 + 2;
      let smallest = idx;

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
}

function dijkstra(graph, source) {
  const dist = {};
  const prev = {};
  const heap = new MinHeap();

  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
    prev[node] = null;
  }
  dist[source] = 0;
  heap.push({ node: source, dist: 0 });

  while (!heap.isEmpty()) {
    const { node, dist: d } = heap.pop();
    if (d > dist[node]) continue; // stale entry
    console.log("Extract min:", node, "with distance", d);

    for (const edge of graph[node] || []) {
      const alt = d + edge.weight;
      if (alt < dist[edge.to]) {
        dist[edge.to] = alt;
        prev[edge.to] = node;
        heap.push({ node: edge.to, dist: alt });
      }
    }
  }

  return { dist, prev };
}

function reconstructShortestPath(prev, target) {
  const path = [];
  let curr = target;
  while (curr != null) {
    path.push(curr);
    curr = prev[curr];
  }
  return path.reverse();
}

function runDijkstraDemo() {
  const graph = {
    A: [
      { to: "B", weight: 4 },
      { to: "C", weight: 1 },
    ],
    B: [
      { to: "E", weight: 4 },
    ],
    C: [
      { to: "B", weight: 2 },
      { to: "D", weight: 4 },
    ],
    D: [
      { to: "E", weight: 4 },
    ],
    E: [],
  };

  const source = "A";
  const target = "E";
  const { dist, prev } = dijkstra(graph, source);
  console.log("Distances:", dist);
  console.log("Parents:", prev);
  console.log(
    "Shortest path from",
    source,
    "to",
    target,
    "=",
    reconstructShortestPath(prev, target),
    "with distance",
    dist[target]
  );
}

runDijkstraDemo();`;

const DIJKSTRA_PY = `# Dijkstra's Algorithm (Shortest Path) with a binary heap
# --------------------------------------------------------------------
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Tuple, Optional
import heapq


@dataclass(order=True)
class NodeDistance:
    dist: float
    node: str = field(compare=False)


def dijkstra(graph: Dict[str, List[Tuple[str, float]]], source: str):
    dist: Dict[str, float] = {v: float("inf") for v in graph}
    prev: Dict[str, Optional[str]] = {v: None for v in graph}
    dist[source] = 0.0

    heap: List[NodeDistance] = [NodeDistance(0.0, source)]
    heapq.heapify(heap)

    while heap:
        current = heapq.heappop(heap)
        node, d = current.node, current.dist
        if d > dist[node]:
            continue  # stale entry

        print("Extract min:", node, "with distance", d)

        for nei, weight in graph.get(node, []):
            alt = d + weight
            if alt < dist[nei]:
                dist[nei] = alt
                prev[nei] = node
                heapq.heappush(heap, NodeDistance(alt, nei))

    return dist, prev


def reconstruct_shortest_path(prev: Dict[str, Optional[str]], target: str):
    path = []
    curr: Optional[str] = target
    while curr is not None:
        path.append(curr)
        curr = prev.get(curr)
    return list(reversed(path))


def run_dijkstra_demo() -> None:
    graph: Dict[str, List[Tuple[str, float]]] = {
        "A": [("B", 4.0), ("C", 1.0)],
        "B": [("E", 4.0)],
        "C": [("B", 2.0), ("D", 4.0)],
        "D": [("E", 4.0)],
        "E": [],
    }
    source = "A"
    target = "E"
    dist, prev = dijkstra(graph, source)
    print("Distances:", dist)
    print("Parents:", prev)
    print(
        "Shortest path from",
        source,
        "to",
        target,
        "=",
        reconstruct_shortest_path(prev, target),
        "with distance",
        dist[target],
    )


if __name__ == "__main__":
    run_dijkstra_demo()`;

/* --------------------------- Topological Sort ------------------------------ */

const TOPOSORT_JS = `// Topological Sort (Kahn's Algorithm)
// -------------------------------------------------------------
// Works on Directed Acyclic Graphs (DAGs). For graphs with cycles,
// the algorithm will visit only the acyclic portion and the resulting
// order will not include nodes in cycles.

function topoSortKahn(graph) {
  const inDegree = {};
  const nodes = Object.keys(graph);

  for (const node of nodes) {
    if (!(node in inDegree)) inDegree[node] = 0;
    for (const nei of graph[node]) {
      inDegree[nei] = (inDegree[nei] || 0) + 1;
    }
  }

  const queue = [];
  for (const node of nodes) {
    if ((inDegree[node] || 0) === 0) queue.push(node);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const nei of graph[node] || []) {
      inDegree[nei] -= 1;
      if (inDegree[nei] === 0) {
        queue.push(nei);
      }
    }
  }

  return order;
}

function runTopoSortDemo() {
  const graph = {
    A: ["C"],
    B: ["C", "D"],
    C: ["E"],
    D: ["F"],
    E: ["H", "F"],
    F: ["G"],
    G: [],
    H: [],
  };

  const order = topoSortKahn(graph);
  console.log("Topological order:", order);
}

runTopoSortDemo();`;

const TOPOSORT_PY = `# Topological Sort (Kahn's Algorithm)
# -------------------------------------------------------------
from collections import deque
from typing import Dict, List


def topo_sort_kahn(graph: Dict[str, List[str]]) -> List[str]:
    in_degree: Dict[str, int] = {}
    for node in graph.keys():
        in_degree.setdefault(node, 0)
        for nei in graph[node]:
            in_degree[nei] = in_degree.get(nei, 0) + 1

    queue: deque[str] = deque([node for node, deg in in_degree.items() if deg == 0])
    order: List[str] = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for nei in graph.get(node, []):
            in_degree[nei] -= 1
            if in_degree[nei] == 0:
                queue.append(nei)

    return order


def run_topo_sort_demo() -> None:
    graph = {
        "A": ["C"],
        "B": ["C", "D"],
        "C": ["E"],
        "D": ["F"],
        "E": ["H", "F"],
        "F": ["G"],
        "G": [],
        "H": [],
    }
    order = topo_sort_kahn(graph)
    print("Topological order:", order)


if __name__ == "__main__":
    run_topo_sort_demo()`;

/* ------------------------ Minimum Spanning Tree (Prim) -------------------- */

const MST_PRIM_JS = `// Minimum Spanning Tree (Prim's Algorithm)
// -------------------------------------------------------------
// Undirected, connected, weighted graph. Uses a simple O(V^2) version
// for clarity. For sparse graphs, a heap-based implementation is faster.

function primMST(graph) {
  const nodes = Object.keys(graph);
  if (nodes.length === 0) return [];

  const inMST = new Set();
  const parent = {};
  const key = {};

  for (const node of nodes) {
    key[node] = Infinity;
    parent[node] = null;
  }

  // Start from the first node
  const start = nodes[0];
  key[start] = 0;

  for (let i = 0; i < nodes.length; i++) {
    // Pick the node with the smallest key not yet in MST
    let u = null;
    let minKey = Infinity;
    for (const v of nodes) {
      if (!inMST.has(v) && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }

    if (u === null) break;
    inMST.add(u);
    console.log("Add to MST:", u, "with key", minKey);

    for (const edge of graph[u] || []) {
      const { to, weight } = edge;
      if (!inMST.has(to) && weight < key[to]) {
        key[to] = weight;
        parent[to] = u;
      }
    }
  }

  const mstEdges = [];
  for (const node of nodes) {
    if (parent[node] != null) {
      mstEdges.push({ from: parent[node], to: node, weight: key[node] });
    }
  }
  return mstEdges;
}

function runMSTPrimDemo() {
  const graph = {
    A: [
      { to: "B", weight: 2 },
      { to: "C", weight: 3 },
    ],
    B: [
      { to: "A", weight: 2 },
      { to: "C", weight: 1 },
      { to: "D", weight: 4 },
    ],
    C: [
      { to: "A", weight: 3 },
      { to: "B", weight: 1 },
      { to: "D", weight: 5 },
    ],
    D: [
      { to: "B", weight: 4 },
      { to: "C", weight: 5 },
    ],
  };

  const mst = primMST(graph);
  console.log("MST edges:", mst);
  const totalWeight = mst.reduce((sum, e) => sum + e.weight, 0);
  console.log("Total MST weight:", totalWeight);
}

runMSTPrimDemo();`;

const MST_PRIM_PY = `# Minimum Spanning Tree (Prim's Algorithm)
# -------------------------------------------------------------
from typing import Dict, List, Tuple, Optional


def prim_mst(graph: Dict[str, List[Tuple[str, float]]]):
    nodes = list(graph.keys())
    if not nodes:
        return []

    in_mst = set()
    parent: Dict[str, Optional[str]] = {v: None for v in nodes}
    key: Dict[str, float] = {v: float("inf") for v in nodes}

    start = nodes[0]
    key[start] = 0.0

    for _ in range(len(nodes)):
        u = None
        min_val = float("inf")
        for v in nodes:
            if v not in in_mst and key[v] < min_val:
                min_val = key[v]
                u = v
        if u is None:
            break

        in_mst.add(u)
        print("Add to MST:", u, "with key", min_val)

        for nei, weight in graph.get(u, []):
            if nei not in in_mst and weight < key[nei]:
                key[nei] = weight
                parent[nei] = u

    mst_edges = []
    for v in nodes:
        if parent[v] is not None:
            mst_edges.append((parent[v], v, key[v]))
    return mst_edges


def run_prim_mst_demo() -> None:
    graph: Dict[str, List[Tuple[str, float]]] = {
        "A": [("B", 2.0), ("C", 3.0)],
        "B": [("A", 2.0), ("C", 1.0), ("D", 4.0)],
        "C": [("A", 3.0), ("B", 1.0), ("D", 5.0)],
        "D": [("B", 4.0), ("C", 5.0)],
    }
    mst = prim_mst(graph)
    print("MST edges:", mst)
    total_weight = sum(weight for _, _, weight in mst)
    print("Total MST weight:", total_weight)


if __name__ == "__main__":
    run_prim_mst_demo()`;

/* -------------------------------------------------------------------------- */
/*  Catalog                                                                   */
/* -------------------------------------------------------------------------- */

export const GRAPH_ALGORITHMS_DETAILED: GraphAlgorithmMeta[] = [
  defineGraphAlgorithm({
    id: "graph-bfs-unweighted",
    title: "Breadth-First Search (Unweighted Graph)",
    shortDescription:
      "Level-order traversal that can also compute shortest paths in unweighted graphs.",
    description:
      "Breadth-First Search explores a graph in concentric layers starting from a source node. "
      + "It is particularly useful on unweighted graphs to compute the shortest path in terms of edge count. "
      + "This implementation uses an adjacency list, a simple queue, and a parent map to reconstruct paths.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    complexity: {
      best: "O(V + E) when you only visit a small connected component.",
      average: "O(V + E) across most random graph instances.",
      worst:
        "O(V + E) when the entire graph is connected and every edge is explored once.",
      space:
        "O(V) for the visited set, queue, and parent map (plus adjacency list storage).",
      notes:
        "On dense graphs E can be ~V^2, so practical performance depends heavily on graph density.",
    },
    graphKind: "traversal",
    representation: "adjacency-list",
    directed: false,
    weighted: false,
    typicalUseCases: [
      "Finding shortest paths in unweighted graphs",
      "Checking connectivity of an undirected graph",
      "Layer-by-layer exploration in grids and mazes",
    ],
    constraintProfile:
      "Best suited for graphs where edges are unweighted or all share the same weight.",
    languages: ["javascript", "python"],
    tags: ["bfs", "graph-traversal", "shortest-path-unweighted", "queue"],
    codeTemplates: {
      javascript: BFS_JS,
      python: BFS_PY,
    },
    recommendedInput:
      "Small undirected graphs (5–10 nodes) to visually trace the layer order.",
    notes:
      "BFS is also frequently used on implicit graphs such as grids, where each cell is a node.",
    relatedIds: ["graph-dfs-recursive", "graph-dijkstra-binary-heap"],
  }),

  defineGraphAlgorithm({
    id: "graph-dfs-recursive",
    title: "Depth-First Search (Recursive)",
    shortDescription:
      "A recursive traversal that explores one branch fully before backtracking.",
    description:
      "Depth-First Search explores neighbors as deep as possible before backtracking. "
      + "This variant uses recursion and records entry/exit times for each vertex, which is extremely useful "
      + "for classification of edges, detecting cycles, and building algorithms like strongly connected components.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    complexity: {
      best:
        "O(V + E), with recursion depth proportional to the height of the DFS tree.",
      average: "O(V + E).",
      worst:
        "O(V + E) with worst-case recursion depth O(V) on a long chain-like graph.",
      space:
        "O(V) for the recursion stack and visited metadata; more in languages with large stack frames.",
      notes:
        "For extremely deep or skewed graphs, consider an explicit stack-based implementation to avoid stack overflow.",
    },
    graphKind: "traversal",
    representation: "adjacency-list",
    directed: true,
    weighted: false,
    typicalUseCases: [
      "Detecting cycles in directed graphs",
      "Topological sorting via finishing times",
      "Partitioning graphs into connected components",
    ],
    constraintProfile:
      "Ideal when recursion depth is manageable and you want to leverage entry/exit timestamps.",
    languages: ["javascript", "python"],
    tags: ["dfs", "graph-traversal", "recursion", "time-stamps"],
    codeTemplates: {
      javascript: DFS_JS,
      python: DFS_PY,
    },
    recommendedInput:
      "Directed graphs with 5–8 nodes where branching structure is easy to spot by hand.",
    notes:
      "Many graph algorithms boil down to customizing the work done upon entry and exit of each node in DFS.",
    relatedIds: ["graph-bfs-unweighted", "graph-toposort-kahn"],
  }),

  defineGraphAlgorithm({
    id: "graph-dijkstra-binary-heap",
    title: "Dijkstra (Binary Heap Implementation)",
    shortDescription:
      "Single-source shortest paths in graphs with non-negative edge weights.",
    description:
      "Dijkstra's algorithm computes shortest path distances from a single source vertex to all other vertices "
      + "in a graph with non-negative edge weights. This implementation uses a binary heap priority queue to pick "
      + "the next closest vertex in O(log V) time, giving an overall complexity of O((V + E) log V).",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O((V + E) log V)",
    spaceComplexity: "O(V + E)",
    complexity: {
      best:
        "O((V + E) log V), although in very sparse graphs with small E the constant factors are small.",
      average: "O((V + E) log V) in most real-world sparse networks.",
      worst:
        "O((V + E) log V) with dense adjacency (E ~ V^2) becoming the dominant factor.",
      space:
        "O(V + E) for distance, parent, adjacency list, and heap storage.",
      notes:
        "If all edges share a small integer weight, specialized versions like 0-1 BFS can outperform Dijkstra.",
    },
    graphKind: "shortest-path",
    representation: "adjacency-list",
    directed: true,
    weighted: true,
    typicalUseCases: [
      "Routing in road networks (non-negative distances)",
      "Network latency minimization",
      "Pathfinding in games with positive movement costs",
    ],
    constraintProfile:
      "Requires non-negative weights; for negative edges, use Bellman–Ford or Johnson's algorithm.",
    languages: ["javascript", "python"],
    tags: ["dijkstra", "shortest-path", "priority-queue", "graph"],
    codeTemplates: {
      javascript: DIJKSTRA_JS,
      python: DIJKSTRA_PY,
    },
    recommendedInput:
      "Small directed graphs with 4–6 nodes and various positive weights for easy debugging.",
    notes:
      "When integrated with the visualizer, each extraction from the heap and relaxation step can correspond to a trace step.",
    relatedIds: ["graph-bfs-unweighted"],
  }),

  defineGraphAlgorithm({
    id: "graph-toposort-kahn",
    title: "Topological Sort (Kahn's Algorithm)",
    shortDescription:
      "Linear ordering of vertices in a Directed Acyclic Graph respecting edge directions.",
    description:
      "Kahn's algorithm performs a topological sort by repeatedly removing vertices with in-degree zero. "
      + "It uses a queue to process vertices in an order that respects all edges u -> v, meaning u appears before v in the output. "
      + "If the graph has a cycle, not all vertices will be processed, serving as a simple cycle detector.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V + E)",
    complexity: {
      best: "O(V + E) with small constant factors due to sequential processing.",
      average: "O(V + E).",
      worst:
        "O(V + E) when every vertex participates in long dependency chains.",
      space:
        "O(V + E) for the adjacency list and in-degree map plus the queue.",
      notes:
        "For extremely large graphs, carefully chosen data structures can reduce overhead in maintaining in-degree counts.",
    },
    graphKind: "topological-sort",
    representation: "adjacency-list",
    directed: true,
    weighted: false,
    typicalUseCases: [
      "Build systems (task dependency resolution)",
      "Course prerequisites planning",
      "Any DAG-based scheduling problem",
    ],
    constraintProfile:
      "Only valid for Directed Acyclic Graphs; presence of a cycle means no topological ordering exists.",
    languages: ["javascript", "python"],
    tags: ["topological-sort", "dag", "kahn", "in-degree"],
    codeTemplates: {
      javascript: TOPOSORT_JS,
      python: TOPOSORT_PY,
    },
    recommendedInput:
      "DAGs with 6–8 vertices representing tasks with simple dependencies.",
    notes:
      "If you use DFS finishing times, you can obtain an alternative topological order by sorting nodes by decreasing exit time.",
    relatedIds: ["graph-dfs-recursive"],
  }),

  defineGraphAlgorithm({
    id: "graph-mst-prim",
    title: "Minimum Spanning Tree (Prim, O(V^2))",
    shortDescription:
      "Builds a minimum spanning tree for a connected, weighted, undirected graph.",
    description:
      "Prim's algorithm incrementally builds a minimum spanning tree (MST) by repeatedly adding the lightest edge "
      + "that connects a vertex in the growing MST to a vertex outside it. This version uses an O(V^2) dense-graph "
      + "implementation that is easy to read and straightforward to visualize.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(V^2)",
    spaceComplexity: "O(V + E)",
    complexity: {
      best:
        "O(V^2), but on small graphs the overhead is minimal and the implementation is very approachable.",
      average: "O(V^2) on typical dense graphs.",
      worst:
        "O(V^2) regardless of E; switching to a heap-based Prim reduces complexity for sparse graphs.",
      space:
        "O(V + E) for adjacency list, keys, parents, and the inMST set.",
      notes:
        "Kruskal's algorithm is often more convenient if the graph is given as an edge list and is sparse.",
    },
    graphKind: "minimum-spanning-tree",
    representation: "adjacency-list",
    directed: false,
    weighted: true,
    typicalUseCases: [
      "Designing cost-minimal communication networks",
      "Approximation algorithms that work on MSTs (e.g., TSP heuristics)",
      "Any situation where you want a minimal connecting structure without cycles",
    ],
    constraintProfile:
      "Works best for moderately sized, dense graphs. For very sparse graphs, prefer a heap-based implementation.",
    languages: ["javascript", "python"],
    tags: ["mst", "prim", "spanning-tree", "graph"],
    codeTemplates: {
      javascript: MST_PRIM_JS,
      python: MST_PRIM_PY,
    },
    recommendedInput:
      "Undirected graphs with 4–6 vertices and symmetric edges (u,v,w) and (v,u,w).",
    notes:
      "In the visualizer you can highlight the edge chosen at each iteration and maintain a running total weight.",
    relatedIds: ["graph-dijkstra-binary-heap"],
  }),
];
