// src/lib/algorithms-pack/grid.ts
//
// Grid / pathfinding algorithms for the Algorithm Library.
// These focus on BFS/DFS, shortest paths, and flood-fill style problems
// that are extremely common in interviews, competitive programming, and
// visual algorithm tools.

import type { AlgorithmMeta } from "../algorithms";

const JS = "javascript" as const;
const PY = "python" as const;

export const gridAlgorithmsPack: AlgorithmMeta[] = [
  {
    id: "grid-bfs-shortest-path",
    name: "Grid BFS Shortest Path",
    title: "Shortest Path in Grid (BFS)",
    shortDescription:
      "Level-order breadth-first search to find the shortest path in an unweighted 2D grid.",
    description:
      "This algorithm finds the shortest path between two cells in an unweighted 2D grid " +
      "using breadth-first search (BFS). Obstacles are treated as blocked cells, and the " +
      "search explores neighbors in layers (level by level). Because the grid is unweighted, " +
      "BFS guarantees that the first time we reach the target cell is via the shortest path " +
      "in terms of number of steps.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(n · m)",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O(n · m)",
      average: "O(n · m)",
      worst: "O(n · m)",
      space: "O(n · m)",
      notes:
        "We visit each cell at most once. The queue can hold up to O(n · m) cells in the worst case.",
    },
    tags: [
      "grid",
      "bfs",
      "shortest-path",
      "unweighted-graph",
      "maze",
      "pathfinding",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Grid: 0 = free, 1 = blocked.\n" +
      "[[0, 0, 0],\n" +
      " [1, 1, 0],\n" +
      " [0, 0, 0]]\n" +
      "Start: (0, 0), Target: (2, 2)\n" +
      "Expected: shortest distance = 4.",
    notes:
      "Great candidate for visualization: you can animate the BFS frontier expanding " +
      "and later reconstruct the exact path from target back to start using a parent map.",
    codeTemplates: {
      javascript: `// Shortest path in a grid using BFS (JavaScript).
// 0 = free cell, 1 = blocked cell.
// Returns the length of the shortest path or -1 if unreachable.
function shortestPathInGrid(grid, start, target) {
  const rows = grid.length;
  if (rows === 0) return -1;
  const cols = grid[0].length;

  const [sr, sc] = start;
  const [tr, tc] = target;

  if (
    sr < 0 || sr >= rows || sc < 0 || sc >= cols ||
    tr < 0 || tr >= rows || tc < 0 || tc >= cols
  ) {
    return -1;
  }

  if (grid[sr][sc] === 1 || grid[tr][tc] === 1) {
    return -1;
  }

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const visited = Array.from({ length: rows }, () =>
    new Array(cols).fill(false)
  );

  const queue = [];
  queue.push([sr, sc, 0]); // row, col, distance
  visited[sr][sc] = true;

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift();

    if (r === tr && c === tc) {
      return dist;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !visited[nr][nc] &&
        grid[nr][nc] === 0
      ) {
        visited[nr][nc] = true;
        queue.push([nr, nc, dist + 1]);
      }
    }
  }

  return -1;
}

// Example usage:
const gridExample = [
  [0, 0, 0],
  [1, 1, 0],
  [0, 0, 0],
];

console.log(shortestPathInGrid(gridExample, [0, 0], [2, 2])); // 4`,
      python: `# Shortest path in a grid using BFS (Python).
# 0 = free cell, 1 = blocked cell.
# Returns the length of the shortest path or -1 if unreachable.

from __future__ import annotations
from collections import deque
from typing import List, Tuple

Grid = List[List[int]]

def shortest_path_in_grid(grid: Grid, start: Tuple[int, int], target: Tuple[int, int]) -> int:
    rows = len(grid)
    if rows == 0:
        return -1
    cols = len(grid[0])

    sr, sc = start
    tr, tc = target

    if not (0 <= sr < rows and 0 <= sc < cols):
        return -1
    if not (0 <= tr < rows and 0 <= tc < cols):
        return -1

    if grid[sr][sc] == 1 or grid[tr][tc] == 1:
        return -1

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    visited = [[False] * cols for _ in range(rows)]
    q: deque[tuple[int, int, int]] = deque()
    q.append((sr, sc, 0))
    visited[sr][sc] = True

    while q:
        r, c, dist = q.popleft()
        if (r, c) == (tr, tc):
            return dist

        for dr, dc in directions:
            nr = r + dr
            nc = c + dc

            if (
                0 <= nr < rows
                and 0 <= nc < cols
                and not visited[nr][nc]
                and grid[nr][nc] == 0
            ):
                visited[nr][nc] = True
                q.append((nr, nc, dist + 1))

    return -1


if __name__ == "__main__":
    grid_example: Grid = [
        [0, 0, 0],
        [1, 1, 0],
        [0, 0, 0],
    ]
    print(shortest_path_in_grid(grid_example, (0, 0), (2, 2)))  # 4`,
    },
    relatedIds: [
      "bfs-graph",
      "grid-dijkstra",
      "grid-a-star",
    ],
  },

  {
    id: "grid-number-of-islands",
    name: "Number of Islands",
    title: "Number of Islands (DFS/BFS on Grid)",
    shortDescription:
      "Counts how many connected components of land (1s) exist in a 2D grid.",
    description:
      "The \"Number of Islands\" problem is a popular grid traversal exercise. " +
      "Cells with value 1 represent land and 0 represents water. An island is a " +
      "maximal group of adjacent land cells (4-way adjacency is typical). The algorithm " +
      "iterates over all cells and launches a DFS or BFS whenever it finds an unvisited " +
      "land cell, marking the entire island as visited and incrementing a counter.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(n · m)",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O(n · m)",
      average: "O(n · m)",
      worst: "O(n · m)",
      space: "O(n · m)",
      notes:
        "Every cell is visited at most once. Recursion depth may reach O(n · m) for DFS " +
        "unless converted to an explicit stack.",
    },
    tags: [
      "grid",
      "dfs",
      "bfs",
      "connected-components",
      "islands",
      "flood-fill",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Grid (1 = land, 0 = water):\n" +
      "[[1, 1, 0, 0],\n" +
      " [1, 0, 0, 1],\n" +
      " [0, 0, 1, 1]]\n" +
      "Expected number of islands: 3 (depending on adjacency rules).",
    notes:
      "Perfect for visual flood-fill demos where each island can be shown in a distinct color. " +
      "Variations include diagonal adjacency or counting \"enclaves\" only.",
    codeTemplates: {
      javascript: `// Number of Islands using DFS in JavaScript.
function numIslands(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;

  const visited = Array.from({ length: rows }, () =>
    new Array(cols).fill(false)
  );

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function dfs(r, c) {
    if (
      r < 0 || r >= rows ||
      c < 0 || c >= cols ||
      visited[r][c] ||
      grid[r][c] === 0
    ) {
      return;
    }

    visited[r][c] = true;
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  }

  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1 && !visited[r][c]) {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}

// Example:
const islandGrid = [
  [1, 1, 0, 0],
  [1, 0, 0, 1],
  [0, 0, 1, 1],
];

console.log(numIslands(islandGrid));`,
      python: `# Number of Islands using DFS in Python.

from __future__ import annotations
from typing import List

Grid = List[List[int]]

def num_islands(grid: Grid) -> int:
    rows = len(grid)
    if rows == 0:
        return 0
    cols = len(grid[0])

    visited = [[False] * cols for _ in range(rows)]
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    def dfs(r: int, c: int) -> None:
        if (
            r < 0
            or r >= rows
            or c < 0
            or c >= cols
            or visited[r][c]
            or grid[r][c] == 0
        ):
            return
        visited[r][c] = True
        for dr, dc in directions:
            dfs(r + dr, c + dc)

    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1 and not visited[r][c]:
                count += 1
                dfs(r, c)

    return count


if __name__ == "__main__":
    island_grid: Grid = [
        [1, 1, 0, 0],
        [1, 0, 0, 1],
        [0, 0, 1, 1],
    ]
    print(num_islands(island_grid))`,
    },
    relatedIds: ["grid-bfs-shortest-path", "grid-flood-fill"],
  },

  {
    id: "grid-dijkstra",
    name: "Grid Dijkstra",
    title: "Dijkstra on Weighted Grid",
    shortDescription:
      "Single-source shortest path on a weighted 2D grid using Dijkstra’s algorithm.",
    description:
      "This variant of Dijkstra’s algorithm runs on a 2D grid where each cell has a non-negative " +
      "cost. Moving into a cell adds that cell’s cost, and the goal is to find the minimum-cost " +
      "path from a start cell to a target cell. A priority queue selects the next cell with the " +
      "smallest tentative distance, and distances are relaxed as in the classic graph version.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O((n · m) log(n · m))",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O((n · m) log(n · m))",
      average: "O((n · m) log(n · m))",
      worst: "O((n · m) log(n · m))",
      space: "O(n · m)",
      notes:
        "Implementation complexity mainly comes from managing the priority queue efficiently " +
        "and ensuring we do not relax already-finalized nodes unnecessarily.",
    },
    tags: [
      "grid",
      "dijkstra",
      "shortest-path",
      "weighted-graph",
      "priority-queue",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Grid of costs:\n" +
      "[[1, 3, 1],\n" +
      " [1, 5, 1],\n" +
      " [4, 2, 1]]\n" +
      "Start: (0, 0), Target: (2, 2)\n" +
      "Expected minimum cost path sum = 7.",
    notes:
      "You can visualize Dijkstra’s frontier as a wave of gradually increasing distance values. " +
      "This is also the basis for many pathfinding visualizers (alongside A*).",
    codeTemplates: {
      javascript: `// Dijkstra on a weighted grid in JavaScript.
// Uses a simple priority queue implementation based on an array (for clarity).
// For production, replace with a binary heap for better performance.
function dijkstraGrid(costs, start, target) {
  const rows = costs.length;
  if (rows === 0) return Infinity;
  const cols = costs[0].length;

  const [sr, sc] = start;
  const [tr, tc] = target;

  const dist = Array.from({ length: rows }, () =>
    new Array(cols).fill(Infinity)
  );

  const visited = Array.from({ length: rows }, () =>
    new Array(cols).fill(false)
  );

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function push(queue, item) {
    queue.push(item);
    // Simple insertion; we will sort later.
  }

  function popMin(queue) {
    if (queue.length === 0) return null;
    let bestIndex = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i][0] < queue[bestIndex][0]) {
        bestIndex = i;
      }
    }
    const item = queue[bestIndex];
    queue.splice(bestIndex, 1);
    return item;
  }

  const pq = [];
  dist[sr][sc] = costs[sr][sc];
  push(pq, [dist[sr][sc], sr, sc]);

  while (pq.length > 0) {
    const node = popMin(pq);
    if (!node) break;

    const [currentDist, r, c] = node;

    if (visited[r][c]) continue;
    visited[r][c] = true;

    if (r === tr && c === tc) {
      return currentDist;
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;

      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[nr][nc]) continue;

      const candidate = currentDist + costs[nr][nc];
      if (candidate < dist[nr][nc]) {
        dist[nr][nc] = candidate;
        push(pq, [candidate, nr, nc]);
      }
    }
  }

  return dist[tr][tc];
}

// Example:
const costGrid = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];

console.log(dijkstraGrid(costGrid, [0, 0], [2, 2]));`,
      python: `# Dijkstra on a weighted grid in Python.

from __future__ import annotations
from typing import List, Tuple
import heapq

Grid = List[List[int]]

def dijkstra_grid(costs: Grid, start: Tuple[int, int], target: Tuple[int, int]) -> int:
    rows = len(costs)
    if rows == 0:
        return float("inf")
    cols = len(costs[0])

    sr, sc = start
    tr, tc = target

    dist: List[List[float]] = [
        [float("inf")] * cols for _ in range(rows)
    ]
    visited = [[False] * cols for _ in range(rows)]

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    dist[sr][sc] = costs[sr][sc]
    pq: list[tuple[float, int, int]] = []
    heapq.heappush(pq, (dist[sr][sc], sr, sc))

    while pq:
        current_dist, r, c = heapq.heappop(pq)
        if visited[r][c]:
            continue
        visited[r][c] = True

        if (r, c) == (tr, tc):
            return current_dist

        for dr, dc in directions:
            nr = r + dr
            nc = c + dc

            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if visited[nr][nc]:
                continue

            candidate = current_dist + costs[nr][nc]
            if candidate < dist[nr][nc]:
                dist[nr][nc] = candidate
                heapq.heappush(pq, (candidate, nr, nc))

    return dist[tr][tc]


if __name__ == "__main__":
    cost_grid: Grid = [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
    ]
    print(dijkstra_grid(cost_grid, (0, 0), (2, 2)))`,
    },
    relatedIds: ["grid-bfs-shortest-path", "grid-a-star"],
  },

  {
    id: "grid-a-star",
    name: "A* Pathfinding on Grid",
    title: "A* Pathfinding on Grid",
    shortDescription:
      "Heuristic-guided shortest path search on a grid using f = g + h.",
    description:
      "A* is a best-first search algorithm that uses a heuristic to guide exploration " +
      "toward the goal. On a grid, the typical choice of heuristic is Manhattan distance " +
      "for 4-directional movement or Euclidean distance for 8-directional movement. " +
      "If the heuristic is admissible and consistent, A* is both optimal and efficient " +
      "in the sense that it expands no more nodes than necessary compared to Dijkstra " +
      "for the same problem.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O((n · m) log(n · m)) in practice",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O(1) (start is target)",
      average: "O((n · m) log(n · m))",
      worst: "O((n · m) log(n · m)) or worse with poor heuristic",
      space: "O(n · m)",
      notes:
        "Performance heavily depends on the heuristic. In the worst case (bad heuristic), " +
        "A* degenerates to something close to Dijkstra.",
    },
    tags: [
      "grid",
      "a-star",
      "heuristics",
      "pathfinding",
      "shortest-path",
      "game-dev",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Same weighted grid as Dijkstra example.\n" +
      "Heuristic: Manhattan distance.\n" +
      "Should find the same optimal path cost.",
    notes:
      "Typical visualizers show open set vs closed set, with colors indicating f, g, and h values. " +
      "This algorithm is a favorite in game development and robotics.",
    codeTemplates: {
      javascript: `// A* pathfinding on a 2D grid in JavaScript.
// 0 or positive cost values indicate traversable cells; 1 cell's cost is given directly in grid.
function aStarGrid(costs, start, target) {
  const rows = costs.length;
  if (rows === 0) return Infinity;
  const cols = costs[0].length;

  const [sr, sc] = start;
  const [tr, tc] = target;

  function heuristic(r, c) {
    // Manhattan distance
    return Math.abs(r - tr) + Math.abs(c - tc);
  }

  const gScore = Array.from({ length: rows }, () =>
    new Array(cols).fill(Infinity)
  );
  const fScore = Array.from({ length: rows }, () =>
    new Array(cols).fill(Infinity)
  );
  const visited = Array.from({ length: rows }, () =>
    new Array(cols).fill(false)
  );

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function push(queue, item) {
    queue.push(item);
  }

  function popBest(queue) {
    if (queue.length === 0) return null;
    let bestIndex = 0;
    for (let i = 1; i < queue.length; i++) {
      if (queue[i][0] < queue[bestIndex][0]) {
        bestIndex = i;
      }
    }
    const item = queue[bestIndex];
    queue.splice(bestIndex, 1);
    return item;
  }

  const openSet = [];
  gScore[sr][sc] = costs[sr][sc];
  fScore[sr][sc] = gScore[sr][sc] + heuristic(sr, sc);
  push(openSet, [fScore[sr][sc], sr, sc]);

  while (openSet.length > 0) {
    const node = popBest(openSet);
    if (!node) break;
    const [currentF, r, c] = node;

    if (visited[r][c]) continue;
    visited[r][c] = true;

    if (r === tr && c === tc) {
      return gScore[r][c];
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (visited[nr][nc]) continue;

      const tentativeG = gScore[r][c] + costs[nr][nc];
      if (tentativeG < gScore[nr][nc]) {
        gScore[nr][nc] = tentativeG;
        fScore[nr][nc] = tentativeG + heuristic(nr, nc);
        push(openSet, [fScore[nr][nc], nr, nc]);
      }
    }
  }

  return gScore[tr][tc];
}

// Example:
const aStarCostGrid = [
  [1, 3, 1],
  [1, 5, 1],
  [4, 2, 1],
];

console.log(aStarGrid(aStarCostGrid, [0, 0], [2, 2]));`,
      python: `# A* pathfinding on a 2D grid in Python.

from __future__ import annotations
from typing import List, Tuple
import heapq

Grid = List[List[int]]

def a_star_grid(costs: Grid, start: Tuple[int, int], target: Tuple[int, int]) -> int:
    rows = len(costs)
    if rows == 0:
        return float("inf")
    cols = len(costs[0])

    sr, sc = start
    tr, tc = target

    def heuristic(r: int, c: int) -> int:
        # Manhattan distance
        return abs(r - tr) + abs(c - tc)

    g_score: List[List[float]] = [
        [float("inf")] * cols for _ in range(rows)
    ]
    f_score: List[List[float]] = [
        [float("inf")] * cols for _ in range(rows)
    ]

    visited = [[False] * cols for _ in range(rows)]

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    g_score[sr][sc] = costs[sr][sc]
    f_score[sr][sc] = g_score[sr][sc] + heuristic(sr, sc)

    open_set: list[tuple[float, int, int]] = []
    heapq.heappush(open_set, (f_score[sr][sc], sr, sc))

    while open_set:
        current_f, r, c = heapq.heappop(open_set)
        if visited[r][c]:
            continue
        visited[r][c] = True

        if (r, c) == (tr, tc):
            return g_score[r][c]

        for dr, dc in directions:
            nr = r + dr
            nc = c + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if visited[nr][nc]:
                continue

            tentative_g = g_score[r][c] + costs[nr][nc]
            if tentative_g < g_score[nr][nc]:
                g_score[nr][nc] = tentative_g
                f_score[nr][nc] = tentative_g + heuristic(nr, nc)
                heapq.heappush(open_set, (f_score[nr][nc], nr, nc))

    return g_score[tr][tc]


if __name__ == "__main__":
    grid_example: Grid = [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1],
    ]
    print(a_star_grid(grid_example, (0, 0), (2, 2)))`,
    },
    relatedIds: ["grid-dijkstra", "grid-bfs-shortest-path"],
  },

  {
    id: "grid-flood-fill",
    name: "Grid Flood Fill",
    title: "Flood Fill (DFS/BFS on Grid)",
    shortDescription:
      "Classic flood-fill algorithm used in paint tools and region labeling.",
    description:
      "Flood fill starts from a given cell and expands to all neighboring cells " +
      "that have the same starting color/value. It is the basis of tools like the " +
      "paint-bucket icon in drawing applications. The algorithm can be implemented " +
      "with either DFS or BFS and typically operates on 4-way or 8-way adjacency.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(n · m)",
    spaceComplexity: "O(n · m)",
    complexity: {
      best: "O(1) (starting cell already has the target color and no neighbors qualify)",
      average: "O(k) where k is the size of the region",
      worst: "O(n · m)",
      space: "O(n · m)",
      notes:
        "Recursive DFS can overflow the call stack for large regions. Iterative implementations " +
        "with an explicit stack or queue are safer.",
    },
    tags: [
      "grid",
      "flood-fill",
      "dfs",
      "bfs",
      "image-processing",
      "region-labeling",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Image (as grid of ints):\n" +
      "[[1, 1, 1],\n" +
      " [1, 1, 0],\n" +
      " [1, 0, 1]]\n" +
      "Start: (1, 1), NewColor: 2\n" +
      "Expected: region of 1's connected to (1,1) is recolored to 2.",
    notes:
      "In a visualizer, flood fill can show how a color region expands outward in waves, " +
      "which is very intuitive to students.",
    codeTemplates: {
      javascript: `// Flood fill on a grid in JavaScript.
function floodFill(image, sr, sc, newColor) {
  const rows = image.length;
  if (rows === 0) return image;
  const cols = image[0].length;

  const originalColor = image[sr][sc];
  if (originalColor === newColor) return image;

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  function dfs(r, c) {
    if (
      r < 0 || r >= rows ||
      c < 0 || c >= cols ||
      image[r][c] !== originalColor
    ) {
      return;
    }

    image[r][c] = newColor;
    for (const [dr, dc] of directions) {
      dfs(r + dr, c + dc);
    }
  }

  dfs(sr, sc);
  return image;
}

// Example:
const img = [
  [1, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
];

console.log(floodFill(img, 1, 1, 2));`,
      python: `# Flood fill on a grid in Python.

from __future__ import annotations
from typing import List

Grid = List[List[int]]

def flood_fill(image: Grid, sr: int, sc: int, new_color: int) -> Grid:
    rows = len(image)
    if rows == 0:
        return image
    cols = len(image[0])

    original_color = image[sr][sc]
    if original_color == new_color:
        return image

    def dfs(r: int, c: int) -> None:
        if (
            r < 0
            or r >= rows
            or c < 0
            or c >= cols
            or image[r][c] != original_color
        ):
            return
        image[r][c] = new_color
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    dfs(sr, sc)
    return image


if __name__ == "__main__":
    img: Grid = [
        [1, 1, 1],
        [1, 1, 0],
        [1, 0, 1],
    ]
    print(flood_fill(img, 1, 1, 2))`,
    },
    relatedIds: ["grid-number-of-islands"],
  },
];
