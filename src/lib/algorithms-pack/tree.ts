// src/lib/algorithms-pack/tree.ts
//
// Tree and Binary Search Tree algorithms for the Algorithm Library.
// Focuses on traversals, height, balance checks, and classic BST operations.

import type { AlgorithmMeta } from "../algorithms";

const JS = "javascript" as const;
const PY = "python" as const;

export const treeAlgorithmsPack: AlgorithmMeta[] = [
  {
    id: "tree-binary-traversals",
    name: "Binary Tree Traversals",
    title: "Binary Tree Traversals (Pre/In/Post/Level)",
    shortDescription:
      "Classic DFS (pre-order, in-order, post-order) and BFS (level-order) traversals on a binary tree.",
    description:
      "Tree traversals are foundational in data structures. For a binary tree, we commonly use:\n" +
      "- Pre-order (root, left, right)\n" +
      "- In-order (left, root, right)\n" +
      "- Post-order (left, right, root)\n" +
      "- Level-order (BFS by levels)\n\n" +
      "These traversals can be implemented recursively or iteratively using an explicit stack or queue.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(h) recursion, O(n) output",
      notes:
        "n is the number of nodes. Recursion depth is O(h), where h is tree height. " +
        "For skewed trees h can be O(n).",
    },
    tags: [
      "tree",
      "binary-tree",
      "dfs",
      "bfs",
      "traversal",
      "recursion",
      "queue",
      "stack",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Binary tree:\n" +
      "      1\n" +
      "     / \\\n" +
      "    2   3\n" +
      "   / \\\n" +
      "  4   5\n\n" +
      "Expected:\n" +
      "  Pre-order: 1 2 4 5 3\n" +
      "  In-order: 4 2 5 1 3\n" +
      "  Post-order: 4 5 2 3 1\n" +
      "  Level-order: 1 2 3 4 5",
    notes:
      "In-order traversal of a Binary Search Tree (BST) visits nodes in sorted order. " +
      "Level-order is also useful for printing the tree level by level.",
    codeTemplates: {
      javascript: `// Binary tree node definition (JavaScript).
class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.value);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.value);
  inorder(root.right, result);
  return result;
}

function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.value);
  return result;
}

function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}

// Example:
const root = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3)
);

console.log("Preorder:", preorder(root));
console.log("Inorder:", inorder(root));
console.log("Postorder:", postorder(root));
console.log("Level-order:", levelOrder(root));`,
      python: `# Binary tree traversals in Python.

from __future__ import annotations
from collections import deque
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class TreeNode:
  value: int
  left: Optional["TreeNode"] = None
  right: Optional["TreeNode"] = None


def preorder(root: Optional[TreeNode], result: Optional[List[int]] = None) -> List[int]:
    if result is None:
        result = []
    if root is None:
        return result
    result.append(root.value)
    preorder(root.left, result)
    preorder(root.right, result)
    return result


def inorder(root: Optional[TreeNode], result: Optional[List[int]] = None) -> List[int]:
    if result is None:
        result = []
    if root is None:
        return result
    inorder(root.left, result)
    result.append(root.value)
    inorder(root.right, result)
    return result


def postorder(root: Optional[TreeNode], result: Optional[List[int]] = None) -> List[int]:
    if result is None:
        result = []
    if root is None:
        return result
    postorder(root.left, result)
    postorder(root.right, result)
    result.append(root.value)
    return result


def level_order(root: Optional[TreeNode]) -> List[int]:
    if root is None:
        return []
    q: deque[TreeNode] = deque([root])
    result: List[int] = []

    while q:
        node = q.popleft()
        result.append(node.value)
        if node.left is not None:
            q.append(node.left)
        if node.right is not None:
            q.append(node.right)

    return result


if __name__ == "__main__":
    root = TreeNode(
        1,
        left=TreeNode(2, TreeNode(4), TreeNode(5)),
        right=TreeNode(3),
    )

    print("Preorder:", preorder(root))
    print("Inorder:", inorder(root))
    print("Postorder:", postorder(root))
    print("Level-order:", level_order(root))`,
    },
    relatedIds: [
      "bst-search-insert",
      "tree-height-balance",
    ],
  },

  {
    id: "tree-height-balance",
    name: "Tree Height & Balanced Check",
    title: "Tree Height & Balanced Binary Tree Check",
    shortDescription:
      "Computes tree height and checks if a binary tree is height-balanced in O(n).",
    description:
      "A height-balanced binary tree is one in which the heights of the two child subtrees " +
      "of every node differ by no more than 1. A naive approach might compute height for " +
      "each node independently, leading to O(n^2) complexity. A better approach returns both " +
      "height and balance information in a single bottom-up traversal, achieving O(n) time.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(h)",
      notes:
        "h is the height of the tree. The algorithm uses post-order traversal to compute " +
        "heights bottom-up and propagate imbalance flags up the call stack.",
    },
    tags: [
      "tree",
      "binary-tree",
      "height",
      "balanced-tree",
      "recursion",
      "post-order",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Balanced tree:\n" +
      "      3\n" +
      "     / \\\n" +
      "    9  20\n" +
      "       / \\\n" +
      "      15  7\n" +
      "Expected: height = 3, balanced = true.\n\n" +
      "Unbalanced tree:\n" +
      "      1\n" +
      "     /\n" +
      "    2\n" +
      "   /\n" +
      "  3\n" +
      "Expected: height = 3, balanced = false.",
    notes:
      "This is a very common interview question and pairs nicely with traversal topics. " +
      "It’s also a good example of combining multiple return values in a single recursion.",
    codeTemplates: {
      javascript: `// Compute tree height and check balance in one pass (JavaScript).
class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function heightAndBalanced(root) {
  // Returns { height: number, balanced: boolean }.
  function helper(node) {
    if (!node) {
      return { height: 0, balanced: true };
    }

    const left = helper(node.left);
    const right = helper(node.right);

    const height = Math.max(left.height, right.height) + 1;
    const balanced =
      left.balanced &&
      right.balanced &&
      Math.abs(left.height - right.height) <= 1;

    return { height, balanced };
  }

  return helper(root);
}

// Example:
const balancedTree = new TreeNode(
  3,
  new TreeNode(9),
  new TreeNode(20, new TreeNode(15), new TreeNode(7))
);

const unbalancedTree = new TreeNode(1, new TreeNode(2, new TreeNode(3)));

console.log("Balanced tree:", heightAndBalanced(balancedTree));
console.log("Unbalanced tree:", heightAndBalanced(unbalancedTree));`,
      python: `# Compute tree height and check balance in one pass (Python).

from __future__ import annotations
from dataclasses import dataclass
from typing import Optional, Tuple

@dataclass
class TreeNode:
    value: int
    left: Optional["TreeNode"] = None
    right: Optional["TreeNode"] = None


def height_and_balanced(root: Optional[TreeNode]) -> Tuple[int, bool]:
    def helper(node: Optional[TreeNode]) -> Tuple[int, bool]:
        if node is None:
            return 0, True

        left_height, left_balanced = helper(node.left)
        right_height, right_balanced = helper(node.right)

        height = max(left_height, right_height) + 1
        balanced = (
            left_balanced
            and right_balanced
            and abs(left_height - right_height) <= 1
        )

        return height, balanced

    return helper(root)


if __name__ == "__main__":
    balanced_tree = TreeNode(
        3,
        left=TreeNode(9),
        right=TreeNode(20, TreeNode(15), TreeNode(7)),
    )
    unbalanced_tree = TreeNode(1, TreeNode(2, TreeNode(3)))

    print("Balanced tree:", height_and_balanced(balanced_tree))
    print("Unbalanced tree:", height_and_balanced(unbalanced_tree))`,
    },
    relatedIds: [
      "tree-binary-traversals",
      "bst-search-insert",
    ],
  },

  {
    id: "bst-search-insert",
    name: "BST Search & Insert",
    title: "Binary Search Tree: Search & Insert",
    shortDescription:
      "Implements search and insert operations on a Binary Search Tree (BST).",
    description:
      "A Binary Search Tree (BST) maintains the invariant that left child values are " +
      "less than the node value and right child values are greater. The search, insert, " +
      "and delete operations operate in O(h) time, where h is the height of the tree. " +
      "This example covers search and insert in both recursive and iterative forms.",
    category: "graph",
    difficulty: "easy",
    timeComplexity: "O(h)",
    spaceComplexity: "O(h)",
    complexity: {
      best: "O(log n) (perfectly balanced BST)",
      average: "O(log n)",
      worst: "O(n) (degenerate linked-list-like tree)",
      space: "O(h) recursion or O(1) iterative",
      notes:
        "Balanced BST variants (AVL, Red-Black Trees) maintain O(log n) height automatically. " +
        "This example focuses on the core BST idea without rebalancing.",
    },
    tags: [
      "bst",
      "binary-search-tree",
      "search",
      "insert",
      "ordered-structure",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Insert values [5, 3, 7, 2, 4, 6, 8] into an empty BST.\n" +
      "Search for 4 => found.\n" +
      "Search for 10 => not found.",
    notes:
      "Great building block for demonstrating how sorted arrays and trees relate. " +
      "Also a nice visualization candidate where each insert updates a displayed tree.",
    codeTemplates: {
      javascript: `// Binary Search Tree: search and insert (JavaScript).
class BSTNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function bstInsert(root, value) {
  if (!root) {
    return new BSTNode(value);
  }

  if (value < root.value) {
    root.left = bstInsert(root.left, value);
  } else if (value > root.value) {
    root.right = bstInsert(root.right, value);
  } else {
    // Value already exists: do nothing or handle duplicates.
  }

  return root;
}

function bstSearch(root, value) {
  let current = root;
  while (current) {
    if (value === current.value) {
      return true;
    }
    if (value < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return false;
}

// Example:
let bstRoot = null;
for (const val of [5, 3, 7, 2, 4, 6, 8]) {
  bstRoot = bstInsert(bstRoot, val);
}

console.log("Search 4:", bstSearch(bstRoot, 4));  // true
console.log("Search 10:", bstSearch(bstRoot, 10)); // false`,
      python: `# Binary Search Tree: search and insert (Python).

from __future__ import annotations
from dataclasses import dataclass
from typing import Optional

@dataclass
class BSTNode:
    value: int
    left: Optional["BSTNode"] = None
    right: Optional["BSTNode"] = None


def bst_insert(root: Optional[BSTNode], value: int) -> BSTNode:
    if root is None:
        return BSTNode(value)

    if value < root.value:
        root.left = bst_insert(root.left, value)
    elif value > root.value:
        root.right = bst_insert(root.right, value)
    else:
        # Value already exists; ignore or handle duplicates as needed.
        pass

    return root


def bst_search(root: Optional[BSTNode], value: int) -> bool:
    current = root
    while current is not None:
        if value == current.value:
            return True
        if value < current.value:
            current = current.left
        else:
            current = current.right
    return False


if __name__ == "__main__":
    bst_root: Optional[BSTNode] = None
    for v in [5, 3, 7, 2, 4, 6, 8]:
        bst_root = bst_insert(bst_root, v)

    print("Search 4:", bst_search(bst_root, 4))
    print("Search 10:", bst_search(bst_root, 10))`,
    },
    relatedIds: [
      "tree-binary-traversals",
      "tree-height-balance",
    ],
  },

  {
    id: "tree-diameter",
    name: "Diameter of Binary Tree",
    title: "Diameter of Binary Tree",
    shortDescription:
      "Computes the longest path between any two nodes (tree diameter).",
    description:
      "The diameter of a tree is the length (in edges or nodes) of the longest path " +
      "between any two nodes. A classic O(n) solution uses a single DFS that returns " +
      "height and updates a global or outer-scope maximum diameter as it visits nodes. " +
      "This is a natural extension of height computation and a good example of combining " +
      "local and global state in recursion.",
    category: "graph",
    difficulty: "medium",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(h)",
      notes:
        "Diameter can be defined in terms of edges or nodes; this implementation uses edges. " +
        "To convert to nodes, add 1 at the end if needed.",
    },
    tags: [
      "tree",
      "binary-tree",
      "diameter",
      "dfs",
      "recursion",
    ],
    languages: [JS, PY],
    recommendedInput:
      "Tree:\n" +
      "      1\n" +
      "     / \\\n" +
      "    2   3\n" +
      "   / \\\n" +
      "  4   5\n" +
      "Diameter (edges) = 3 along path 4–2–1–3.",
    notes:
      "Pairs nicely with height & balanced checks and is a favorite follow-up in many interviews.",
    codeTemplates: {
      javascript: `// Diameter of a binary tree (JavaScript, in edges).
class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

function treeDiameter(root) {
  let maxDiameter = 0;

  function depth(node) {
    if (!node) return 0;

    const leftDepth = depth(node.left);
    const rightDepth = depth(node.right);

    // Path through this node = leftDepth + rightDepth (edge count).
    const candidate = leftDepth + rightDepth;
    if (candidate > maxDiameter) {
      maxDiameter = candidate;
    }

    // Return height to parent.
    return Math.max(leftDepth, rightDepth) + 1;
  }

  depth(root);
  return maxDiameter;
}

// Example:
const root = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3)
);

console.log("Diameter (edges):", treeDiameter(root));`,
      python: `# Diameter of a binary tree in Python (edges).

from __future__ import annotations
from dataclasses import dataclass
from typing import Optional

@dataclass
class TreeNode:
    value: int
    left: Optional["TreeNode"] = None
    right: Optional["TreeNode"] = None


def tree_diameter(root: Optional[TreeNode]) -> int:
    max_diameter = 0

    def depth(node: Optional[TreeNode]) -> int:
        nonlocal max_diameter
        if node is None:
            return 0

        left_depth = depth(node.left)
        right_depth = depth(node.right)

        candidate = left_depth + right_depth
        if candidate > max_diameter:
            max_diameter = candidate

        return max(left_depth, right_depth) + 1

    depth(root)
    return max_diameter


if __name__ == "__main__":
    root = TreeNode(
        1,
        left=TreeNode(2, TreeNode(4), TreeNode(5)),
        right=TreeNode(3),
    )
    print("Diameter (edges):", tree_diameter(root))`,
    },
    relatedIds: [
      "tree-height-balance",
      "tree-binary-traversals",
    ],
  },
];
