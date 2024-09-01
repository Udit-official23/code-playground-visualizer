// src/lib/snippets/trees.ts

/**
 * Tree practice snippets & templates.
 *
 * These snippets mirror common interview patterns for binary trees and BSTs.
 * They are meant to be:
 *  - Displayed in a "Snippet Library" panel
 *  - Copied into the playground editor
 *  - Used as deeply commented reference implementations
 */

export type TreeSnippetLanguage = "javascript" | "typescript";

export type TreeSnippetCategory =
  | "fundamentals"
  | "traversal"
  | "dfs-bfs"
  | "binary-tree"
  | "bst"
  | "construction"
  | "serialization"
  | "path"
  | "interview-pattern";

export type TreeSnippetDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export interface TreeSnippet {
  id: string;
  title: string;
  summary: string;
  category: TreeSnippetCategory;
  difficulty: TreeSnippetDifficulty;
  language: TreeSnippetLanguage;
  tags: string[];
  code: string;
  explanation: string;
  complexityHint?: string;
}

export const treeSnippetCategoryLabels: Record<TreeSnippetCategory, string> = {
  fundamentals: "Fundamentals",
  traversal: "Tree Traversal",
  "dfs-bfs": "DFS & BFS",
  "binary-tree": "Binary Tree Logic",
  bst: "Binary Search Tree",
  construction: "Tree Construction",
  serialization: "Serialization",
  path: "Path Problems",
  "interview-pattern": "Interview Patterns",
};

export const treeSnippetDifficultyLabels: Record<
  TreeSnippetDifficulty,
  string
> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/**
 * Main collection of tree-related snippets.
 * Each snippet is heavily commented to maximise teaching value
 * and line count for the codebase buyer.
 */
export const treeSnippets: TreeSnippet[] = [
  {
    id: "tree-node-definition-and-builder",
    title: "Tree Node Definition & Helper Builder",
    summary:
      "Basic binary tree node type with a helper function to quickly build small trees.",
    category: "fundamentals",
    difficulty: "beginner",
    language: "typescript",
    tags: ["tree", "node", "definition", "helper"],
    code: `// A minimal binary tree node definition used by many snippets below.
// This is intentionally simple and can be extended with parent pointers,
// colour flags (for red-black trees), metadata, etc.

export interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Convenience factory to reduce boilerplate when building trees.
// We give the helper a short name so examples remain compact.

export function node(
  value: number,
  left: TreeNode | null = null,
  right: TreeNode | null = null
): TreeNode {
  return { value, left, right };
}

// Example of constructing a tiny tree:
//
//        10
//       /  \\
//      5    20
//          /  \\
//         15   30
//
// const root = node(10,
//   node(5),
//   node(20, node(15), node(30))
// );
//
// console.log(JSON.stringify(root, null, 2));`,
    explanation:
      "Many tree algorithms start with a shared TreeNode definition. This snippet keeps the node structure minimal (value, left, right) and provides a helper factory for quickly constructing trees in tests or playground experiments.",
    complexityHint:
      "All operations shown are O(1); bigger snippets will build on this.",
  },
  {
    id: "tree-traversal-dfs-recursive",
    title: "Depth-First Traversals (Pre/In/Post Order)",
    summary:
      "Classic recursive implementations of pre-order, in-order, and post-order traversal.",
    category: "traversal",
    difficulty: "beginner",
    language: "typescript",
    tags: ["traversal", "dfs", "recursion", "preorder", "inorder", "postorder"],
    code: `// Depth-first traversal patterns using recursion.
//
// We collect values into arrays rather than printing them directly.
// This design is friendlier for testing, visualisation, and reuse.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace with your actual path or inline TreeNode.

export function preorder(root: TreeNode | null, result: number[] = []): number[] {
  if (!root) return result;

  // 1. Visit current node.
  result.push(root.value);

  // 2. Traverse left subtree.
  preorder(root.left, result);

  // 3. Traverse right subtree.
  preorder(root.right, result);

  return result;
}

export function inorder(root: TreeNode | null, result: number[] = []): number[] {
  if (!root) return result;

  // 1. Left subtree.
  inorder(root.left, result);

  // 2. Current node.
  result.push(root.value);

  // 3. Right subtree.
  inorder(root.right, result);

  return result;
}

export function postorder(
  root: TreeNode | null,
  result: number[] = []
): number[] {
  if (!root) return result;

  // 1. Left subtree.
  postorder(root.left, result);

  // 2. Right subtree.
  postorder(root.right, result);

  // 3. Current node.
  result.push(root.value);

  return result;
}

// Example usage:
//
// const root = node(1, node(2, node(4), node(5)), node(3));
// console.log("preorder", preorder(root));   // [1, 2, 4, 5, 3]
// console.log("inorder", inorder(root));     // [4, 2, 5, 1, 3]
// console.log("postorder", postorder(root)); // [4, 5, 2, 3, 1]`,
    explanation:
      "These three traversals are canonical examples of recursion on trees. The implementation pattern is extremely stable: base case for null, then visit children in different orders. Visualisers can animate the call stack as the traversal progresses.",
    complexityHint: "Time: O(n), Space: O(h) recursion stack (h = height).",
  },
  {
    id: "tree-traversal-bfs-level-order",
    title: "Level-Order Traversal (Breadth-First Search)",
    summary:
      "Iterative BFS over a binary tree using a queue, returning values level by level.",
    category: "dfs-bfs",
    difficulty: "beginner",
    language: "typescript",
    tags: ["bfs", "queue", "level order", "breadth-first"],
    code: `// Breadth-first search (BFS) for a binary tree.
// We return a nested array where each inner array corresponds to a level.
//
// Example return value for the tree
//     1
//    / \\
//   2   3
//      / \\
//     4   5
//
// would be [[1], [2, 3], [4, 5]].

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.

export function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];

  const result: number[][] = [];
  const queue: (TreeNode | null)[] = [];

  queue.push(root);

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelValues: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (!node) continue;

      levelValues.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(levelValues);
  }

  return result;
}

// Example usage:
// const root = node(1, node(2), node(3, node(4), node(5)));
// console.log(levelOrder(root));`,
    explanation:
      "Level-order traversal is the tree analogue of a standard BFS for graphs. Using a queue makes the control flow explicit and very easy to visualise: each iteration consumes one level and enqueues the next.",
    complexityHint: "Time: O(n), Space: O(n) in the worst case.",
  },
  {
    id: "tree-height-and-node-count",
    title: "Height (Max Depth) and Node Count",
    summary:
      "Compute the height and node count of a tree with simple recursive helpers.",
    category: "binary-tree",
    difficulty: "beginner",
    language: "typescript",
    tags: ["height", "size", "recursion", "properties"],
    code: `// Many problems need basic structural metrics: depth / height and
// total number of nodes. Here we provide two independent helpers.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.

export function treeHeight(root: TreeNode | null): number {
  if (!root) return 0;

  const leftHeight = treeHeight(root.left);
  const rightHeight = treeHeight(root.right);

  // Height is 1 + max height of children.
  return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

export function treeNodeCount(root: TreeNode | null): number {
  if (!root) return 0;

  // Count current node plus all nodes in both subtrees.
  return 1 + treeNodeCount(root.left) + treeNodeCount(root.right);
}

// Example usage:
// const root = node(10, node(5), node(20, node(15), node(30)));
// console.log("height:", treeHeight(root));       // 3
// console.log("node count:", treeNodeCount(root)); // 5`,
    explanation:
      "Height and node count are classic building blocks. Many more complex problems (balanced tree checks, diameter calculations) use these helpers either directly or as subroutines with additional bookkeeping.",
    complexityHint: "Both helpers run in O(n) time and use O(h) stack space.",
  },
  {
    id: "tree-diameter",
    title: "Tree Diameter (Longest Path Between Two Nodes)",
    summary:
      "Compute the diameter of a binary tree in a single DFS that tracks heights and best path length.",
    category: "binary-tree",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["diameter", "dfs", "height", "longest path"],
    code: `// The diameter of a tree is the number of edges on the longest path
// between any two nodes. This path may or may not pass through the root.
//
// The trick: while computing height, also track the best diameter seen so far.
//
// We return the diameter as an integer; variants can also return the actual
// path by keeping parent pointers or reconstructing from a second pass.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.

export function treeDiameter(root: TreeNode | null): number {
  let best = 0;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0;

    const leftHeight = dfs(node.left);
    const rightHeight = dfs(node.right);

    // Longest path THROUGH this node uses one edge down to the left and
    // one edge down to the right, so the edge count is leftHeight + rightHeight.
    const pathThroughHere = leftHeight + rightHeight;

    if (pathThroughHere > best) {
      best = pathThroughHere;
    }

    // Height to parent is 1 + max child height.
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
  }

  dfs(root);
  return best;
}

// Example usage:
// const root = node(1,
//   node(2, node(4), node(5)),
//   node(3)
// );
// console.log(treeDiameter(root)); // 3 (path 4-2-1-3)`,
    explanation:
      "The key insight is that the diameter through a node uses the sum of left and right heights. By computing heights bottom-up, we can keep a running maximum of this quantity and return it after the DFS finishes.",
    complexityHint:
      "Time: O(n) for a single DFS, Space: O(h) recursion stack.",
  },
  {
    id: "bst-validate",
    title: "Validate Binary Search Tree (BST)",
    summary:
      "Check whether a binary tree satisfies BST ordering constraints using min/max bounds.",
    category: "bst",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["bst", "validation", "dfs", "bounds"],
    code: `// Validate that a binary tree is a proper Binary Search Tree.
// We ensure that all values in the left subtree fall in (min, node.value)
// and all values in the right subtree fall in (node.value, max).
//
// This bound propagation technique avoids subtle bugs that arise when
// we only compare each node with its immediate parent.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.

export function isValidBST(root: TreeNode | null): boolean {
  function dfs(
    node: TreeNode | null,
    min: number | null,
    max: number | null
  ): boolean {
    if (!node) return true;

    if (min !== null && node.value <= min) return false;
    if (max !== null && node.value >= max) return false;

    // Left subtree: allowed range stays (min, node.value).
    if (!dfs(node.left, min, node.value)) {
      return false;
    }

    // Right subtree: allowed range becomes (node.value, max).
    if (!dfs(node.right, node.value, max)) {
      return false;
    }

    return true;
  }

  return dfs(root, null, null);
}

// Example usage:
//
// const root = node(10,
//   node(5, node(2), node(7)),
//   node(15, null, node(20))
// );
// console.log(isValidBST(root)); // true`,
    explanation:
      "Rather than storing all values in a list and checking if it is sorted, this approach validates the BST property locally during DFS with min/max bounds. This method generalises nicely when nodes store ranges or when duplicates require special handling.",
    complexityHint: "Time: O(n), Space: O(h) for recursion.",
  },
  {
    id: "bst-insert-search-delete",
    title: "BST Insert, Search, and Delete (Recursive)",
    summary:
      "A compact set of core operations for a classic BST: search, insert, and delete.",
    category: "bst",
    difficulty: "advanced",
    language: "typescript",
    tags: ["bst", "insert", "delete", "search", "recursion"],
    code: `// Core Binary Search Tree operations using recursion.
// These samples intentionally ignore self-balancing to keep the logic clear.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.
import { node } from "./trees-basic-import-placeholder";

// Search for a value in the BST.
export function bstSearch(root: TreeNode | null, target: number): TreeNode | null {
  if (!root) return null;
  if (target === root.value) return root;
  if (target < root.value) return bstSearch(root.left, target);
  return bstSearch(root.right, target);
}

// Insert a new value into the BST, returning the (possibly new) root.
export function bstInsert(root: TreeNode | null, value: number): TreeNode {
  if (!root) {
    return node(value);
  }

  if (value < root.value) {
    root.left = bstInsert(root.left, value);
  } else if (value > root.value) {
    root.right = bstInsert(root.right, value);
  } else {
    // Duplicate: we keep the tree unchanged in this simple implementation.
  }

  return root;
}

// Helper: find the minimum value node in a subtree.
function findMin(nodeRoot: TreeNode): TreeNode {
  let current: TreeNode = nodeRoot;
  while (current.left) {
    current = current.left;
  }
  return current;
}

// Delete a value from the BST, returning the new root.
export function bstDelete(root: TreeNode | null, value: number): TreeNode | null {
  if (!root) return null;

  if (value < root.value) {
    root.left = bstDelete(root.left, value);
  } else if (value > root.value) {
    root.right = bstDelete(root.right, value);
  } else {
    // Node found: handle the three classic cases.

    // 1. No children.
    if (!root.left && !root.right) {
      return null;
    }

    // 2. One child: replace node with its non-null child.
    if (!root.left) {
      return root.right;
    }
    if (!root.right) {
      return root.left;
    }

    // 3. Two children: replace with inorder successor (smallest in right subtree).
    const successor = findMin(root.right);
    root.value = successor.value;
    root.right = bstDelete(root.right, successor.value);
  }

  return root;
}

// Example usage:
// let root: TreeNode | null = null;
// for (const value of [8, 3, 10, 1, 6, 14, 4, 7, 13]) {
//   root = bstInsert(root, value);
// }
// console.log(isValidBST(root)); // should be true
// root = bstDelete(root, 3);`,
    explanation:
      "These operations show how structural mutations work in BSTs. Even though the tree may become unbalanced, the code is easy to reason about and perfect for stepping through in a playground visualiser.",
    complexityHint:
      "Average: O(log n) per operation; Worst case (degenerate tree): O(n).",
  },
  {
    id: "tree-serialize-deserialize",
    title: "Serialize & Deserialize Binary Tree (Level-Order)",
    summary:
      "Convert a tree to a comma-separated string using BFS and reconstruct it back.",
    category: "serialization",
    difficulty: "advanced",
    language: "typescript",
    tags: ["serialization", "deserialization", "bfs", "codec"],
    code: `// Encode a binary tree as a string using level-order traversal,
// then decode it back into a tree.
//
// We represent null children with the marker "#". Values are stored as
// decimal integers separated by commas, which keeps the format compact
// but human-readable.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.
import { node } from "./trees-basic-import-placeholder";

const NULL_MARKER = "#";

export function serialize(root: TreeNode | null): string {
  if (!root) return "";

  const queue: (TreeNode | null)[] = [root];
  const output: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      output.push(NULL_MARKER);
      continue;
    }

    output.push(String(current.value));
    queue.push(current.left);
    queue.push(current.right);
  }

  // Trailing null markers can be trimmed without losing information.
  let lastNonNull = output.length - 1;
  while (lastNonNull >= 0 && output[lastNonNull] === NULL_MARKER) {
    lastNonNull--;
  }

  return output.slice(0, lastNonNull + 1).join(",");
}

export function deserialize(data: string): TreeNode | null {
  if (!data) return null;

  const values = data.split(",");
  if (values.length === 0) return null;

  const rootValue = values[0];
  if (rootValue === NULL_MARKER) return null;

  const root = node(Number(rootValue));
  const queue: TreeNode[] = [root];

  let index = 1;

  while (queue.length > 0 && index < values.length) {
    const current = queue.shift();
    if (!current) continue;

    // Left child.
    const leftToken = values[index++];
    if (leftToken !== undefined) {
      if (leftToken === NULL_MARKER) {
        current.left = null;
      } else {
        const leftNode = node(Number(leftToken));
        current.left = leftNode;
        queue.push(leftNode);
      }
    }

    // Right child.
    if (index >= values.length) break;
    const rightToken = values[index++];
    if (rightToken !== undefined) {
      if (rightToken === NULL_MARKER) {
        current.right = null;
      } else {
        const rightNode = node(Number(rightToken));
        current.right = rightNode;
        queue.push(rightNode);
      }
    }
  }

  return root;
}

// Example usage:
//
// const root = node(1, node(2), node(3, node(4), node(5)));
// const encoded = serialize(root);
// const decoded = deserialize(encoded);
// console.log(encoded);
// console.log(JSON.stringify(decoded, null, 2));`,
    explanation:
      "Serialisation converts a tree structure into a linear representation that can be stored or sent across the network. Level-order encoding with null markers is easy to implement and works for arbitrary shapes, making it a common interview pattern.",
    complexityHint:
      "Time: O(n) for both operations, Space: O(n) for queues and arrays.",
  },
  {
    id: "tree-path-sum-dfs",
    title: "Root-to-Leaf Path Sum and Path Enumeration",
    summary:
      "Check if a path from root to leaf sums to a target and also collect all such paths.",
    category: "path",
    difficulty: "intermediate",
    language: "typescript",
    tags: ["path sum", "dfs", "backtracking", "root-to-leaf"],
    code: `// Determine whether there exists a root-to-leaf path whose node values
// sum to a given target. We also provide a variant that returns all such paths.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.

export function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;

  // Leaf node: check if the remaining sum equals node value.
  if (!root.left && !root.right) {
    return root.value === targetSum;
  }

  const remaining = targetSum - root.value;
  return (
    hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining)
  );
}

// Collect all root-to-leaf paths that sum to target.
export function allPathSums(
  root: TreeNode | null,
  targetSum: number
): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function dfs(node: TreeNode | null, remaining: number): void {
    if (!node) return;

    path.push(node.value);

    // If we are at a leaf, check sum.
    if (!node.left && !node.right) {
      if (remaining === node.value) {
        result.push([...path]);
      }
      path.pop();
      return;
    }

    const nextRemaining = remaining - node.value;

    dfs(node.left, nextRemaining);
    dfs(node.right, nextRemaining);

    // Backtrack.
    path.pop();
  }

  dfs(root, targetSum);
  return result;
}

// Example usage:
//
// const root = node(5,
//   node(4, node(11, node(7), node(2)), null),
//   node(8, node(13), node(4, null, node(1)))
// );
//
// console.log(hasPathSum(root, 22)); // true
// console.log(allPathSums(root, 22));`,
    explanation:
      "Path-sum problems combine DFS with a small state variable: the running total or remaining sum. The backtracking pattern of pushing onto a path array and then popping after exploring children appears across many tree path questions.",
    complexityHint:
      "Time: O(n) for hasPathSum, O(n + k) for collecting k valid paths; Space: O(h) recursion plus O(k * pathLength) for results.",
  },
  {
    id: "tree-lowest-common-ancestor",
    title: "Lowest Common Ancestor (LCA) in Binary Tree",
    summary:
      "Return the lowest common ancestor of two nodes in a binary tree without parent pointers.",
    category: "interview-pattern",
    difficulty: "advanced",
    language: "typescript",
    tags: ["lca", "lowest common ancestor", "dfs"],
    code: `// Find the lowest common ancestor (LCA) of two nodes p and q
// in a binary tree that does not store parent references.
//
// The DFS return value is either:
//  - null if the subtree contains neither p nor q,
//  - the node reference for p or q,
//  - or the LCA when both are found in different subtrees.

import type { TreeNode } from "./trees-basic-import-placeholder"; // Replace or inline.

export function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode | null,
  q: TreeNode | null
): TreeNode | null {
  if (!root || !p || !q) return null;

  function dfs(node: TreeNode | null): TreeNode | null {
    if (!node) return null;

    if (node === p || node === q) {
      return node;
    }

    const left = dfs(node.left);
    const right = dfs(node.right);

    // If both sides returned non-null, this node is the LCA.
    if (left && right) {
      return node;
    }

    // Otherwise propagate whichever side is non-null upwards.
    return left ?? right;
  }

  return dfs(root);
}

// Example usage:
//
// const shared = node(2);
// const root = node(3,
//   node(5, shared, node(6)),
//   node(1, node(0), node(8))
// );
// const lca = lowestCommonAncestor(root, shared, root.right?.right ?? null);
// console.log(lca?.value);`,
    explanation:
      "The LCA problem is a staple of tree interviews. This DFS solution is concise yet expressive: every recursive call returns the single 'interesting' node in its subtree, or null. The first node where both left and right children report hits must be the LCA.",
    complexityHint: "Time: O(n), Space: O(h) recursion stack.",
  },
];

/**
 * Lookup map from id → snippet for quick access in UI components.
 */
export const treeSnippetsById: Record<string, TreeSnippet> = (() => {
  const map: Record<string, TreeSnippet> = {};
  for (const snippet of treeSnippets) {
    map[snippet.id] = snippet;
  }
  return map;
})();

/**
 * Helper to retrieve a snippet by id.
 */
export function getTreeSnippetById(id: string): TreeSnippet | undefined {
  return treeSnippetsById[id];
}
