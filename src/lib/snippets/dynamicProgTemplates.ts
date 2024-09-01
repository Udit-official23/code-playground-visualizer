// src/lib/snippets/dynamicProgTemplates.ts

/**
 * Dynamic Programming Templates
 *
 * This module contains highly–commented reference implementations for
 * common dynamic-programming patterns that show up in interviews:
 *
 *  - 1D DP (Fibonacci, Climbing Stairs, House Robber…)
 *  - Unbounded knapsack / coin-change style problems
 *  - 0/1 knapsack and subset-sum style problems
 *  - 2D DP on strings (LCS, edit distance, palindromes)
 *  - 2D DP on grids (shortest path, unique paths)
 *  - Longest Increasing Subsequence variants
 *
 * These are **real** implementations, not pseudocode, so a buyer can
 * reuse them directly or treat them as a teaching library inside the
 * playground.
 */

/* ------------------------------------------------------------------ */
/* Basic shared types                                                  */
/* ------------------------------------------------------------------ */

export type DPDomain =
  | "sequence"
  | "string"
  | "grid"
  | "knapsack"
  | "graph"
  | "misc";

export type DPPattern =
  | "top-down-memo"
  | "bottom-up-table"
  | "space-optimized"
  | "state-compression"
  | "bitmask"
  | "prefix"
  | "transition-graph";

export interface DynamicProgTemplateMeta {
  /**
   * Short identifier used internally or in URLs.
   */
  id: string;
  /**
   * Human-readable title for the template.
   */
  title: string;
  /**
   * One-paragraph explanation of what the template demonstrates.
   */
  summary: string;
  /**
   * The rough problem domain.
   */
  domain: DPDomain;
  /**
   * The primary DP pattern used in this template.
   */
  pattern: DPPattern;
  /**
   * Optional tags that can be surfaced in the UI.
   */
  tags: string[];
}

/**
 * Each template entry includes the meta information and the full TypeScript
 * implementation as plain text. The playground can immediately drop the
 * `code` value into the editor when a user chooses a template.
 */
export interface DynamicProgTemplate {
  meta: DynamicProgTemplateMeta;
  code: string;
}

/* ------------------------------------------------------------------ */
/* Template collection                                                 */
/* ------------------------------------------------------------------ */

export const dynamicProgTemplates: DynamicProgTemplate[] = [
  {
    meta: {
      id: "dp-fib-top-down",
      title: "Fibonacci – Top-Down with Memoization",
      summary:
        "Minimal example of top-down DP: recursion + memo table to avoid exponential blow-up.",
      domain: "sequence",
      pattern: "top-down-memo",
      tags: ["fibonacci", "memoization", "recursion", "1D"],
    },
    code: `// Fibonacci numbers using top-down DP (memoization).
//
// This is often the very first dynamic-programming example people learn.
// The purely recursive definition:
//
//    fib(n) = fib(n-1) + fib(n-2)
//    fib(0) = 0
//    fib(1) = 1
//
// explodes to O(2^n) calls because the same sub-problems are solved repeatedly.
// By storing intermediate results in a memo table we turn it into O(n).
//
// This template is intentionally verbose to make the thought process explicit.

export function fibTopDown(n: number): number {
  // Memo table where memo[k] stores fib(k) once computed.
  // We initialize it with an empty array and fill entries lazily.
  const memo: number[] = [];

  function helper(k: number): number {
    // Base cases: by definition.
    if (k === 0) return 0;
    if (k === 1) return 1;

    // If we already solved this sub-problem, return cached answer.
    if (memo[k] !== undefined) {
      return memo[k];
    }

    // Otherwise compute recursively and remember the result.
    const value = helper(k - 1) + helper(k - 2);
    memo[k] = value;
    return value;
  }

  return helper(n);
}

// Debug helper to show intermediate memo table for teaching purposes.
export function fibTopDownWithTrace(n: number): { value: number; memo: number[] } {
  const memo: number[] = [];

  function helper(k: number): number {
    if (k === 0) return 0;
    if (k === 1) return 1;
    if (memo[k] !== undefined) return memo[k];
    const value = helper(k - 1) + helper(k - 2);
    memo[k] = value;
    return value;
  }

  const value = helper(n);
  return { value, memo };
}`,
  },
  {
    meta: {
      id: "dp-fib-bottom-up",
      title: "Fibonacci – Bottom-Up with Space Optimisation",
      summary:
        "Bottom-up DP that evolves the recurrence iteratively and keeps only constant memory.",
      domain: "sequence",
      pattern: "space-optimized",
      tags: ["fibonacci", "bottom-up", "1D", "space-optimized"],
    },
    code: `// Fibonacci using bottom-up DP with O(1) space.
//
// Instead of recursion, we start from the base cases and build our way up.
// This style is closer to how many more complex DP tables are filled.

export function fibBottomUp(n: number): number {
  if (n === 0) return 0;
  if (n === 1) return 1;

  let prev2 = 0; // fib(0)
  let prev1 = 1; // fib(1)

  for (let k = 2; k <= n; k++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
`,
  },
  {
    meta: {
      id: "dp-coin-change-min-coins",
      title: "Coin Change – Minimum Number of Coins (Unbounded Knapsack)",
      summary:
        "Classic unbounded knapsack variant: minimum coins to make up a given amount.",
      domain: "knapsack",
      pattern: "bottom-up-table",
      tags: ["coin change", "unbounded knapsack", "minimisation", "1D dp"],
    },
    code: `// Coin Change – minimum coins to make up a target amount.
//
// Given an integer array coins representing coin denominations and an integer
// amount representing a total amount of money, return the fewest number of
// coins that you need to make up that amount. If that amount of money cannot
// be made up by any combination of the coins, return -1.
//
// This is a classic example of an "unbounded knapsack" problem where each coin
// can be used arbitrarily many times.

export function coinChangeMinCoins(coins: number[], amount: number): number {
  const INF = Number.POSITIVE_INFINITY;

  // dp[x] = minimum number of coins needed to make amount x.
  // Initialise with "infinity" (unreachable) for all x > 0.
  const dp = new Array<number>(amount + 1).fill(INF);
  dp[0] = 0; // base case: 0 coins to make amount 0.

  for (const coin of coins) {
    for (let value = coin; value <= amount; value++) {
      // If we can make (value - coin), then we can also make 'value'
      // by adding this coin one more time.
      if (dp[value - coin] + 1 < dp[value]) {
        dp[value] = dp[value - coin] + 1;
      }
    }
  }

  return dp[amount] === INF ? -1 : dp[amount];
}

// A variant that additionally reconstructs one optimal combination
// of coins for teaching / debugging purposes.
export function coinChangeMinCoinsWithPath(
  coins: number[],
  amount: number
): { minCoins: number; combination: number[] } {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(amount + 1).fill(INF);
  const parent = new Array<number | null>(amount + 1).fill(null);

  dp[0] = 0;

  for (const coin of coins) {
    for (let value = coin; value <= amount; value++) {
      if (dp[value - coin] + 1 < dp[value]) {
        dp[value] = dp[value - coin] + 1;
        parent[value] = coin;
      }
    }
  }

  if (dp[amount] === INF) {
    return { minCoins: -1, combination: [] };
  }

  // Reconstruct combination by walking the parent array backwards.
  const combination: number[] = [];
  let current = amount;

  while (current > 0 && parent[current] !== null) {
    const coin = parent[current]!;
    combination.push(coin);
    current -= coin;
  }

  return { minCoins: dp[amount], combination: combination.reverse() };
}
`,
  },
  {
    meta: {
      id: "dp-coin-change-count-ways",
      title: "Coin Change – Count the Number of Ways",
      summary:
        "Counts combinations of coins that sum to a given amount using 1D DP.",
      domain: "knapsack",
      pattern: "bottom-up-table",
      tags: ["coin change", "unbounded", "combinatorics", "1D dp"],
    },
    code: `// Coin Change – number of combinations.
//
// Given coin denominations and an amount, return how many distinct combinations
// of coins make up that amount. Order does not matter (i.e., [1,2] and [2,1]
// are the same combination), so we iterate coins in the outer loop and amounts
// in the inner loop to avoid double counting.

export function coinChangeCountWays(coins: number[], amount: number): number {
  const dp = new Array<number>(amount + 1).fill(0);
  dp[0] = 1; // One way to make amount 0: choose nothing.

  for (const coin of coins) {
    for (let value = coin; value <= amount; value++) {
      dp[value] += dp[value - coin];
    }
  }

  return dp[amount];
}
`,
  },
  {
    meta: {
      id: "dp-knapsack-01",
      title: "0/1 Knapsack – Max Value",
      summary:
        "Maximise value with weight constraint where each item can only be taken once.",
      domain: "knapsack",
      pattern: "space-optimized",
      tags: ["0/1 knapsack", "optimisation", "1D", "classic"],
    },
    code: `// 0/1 Knapsack – space-optimised implementation.
//
// weights[i]  -> weight of item i
// values[i]   -> value of item i
// capacity    -> maximum total weight allowed
//
// Each item can either be taken once or skipped. The goal is to maximise value.
//
// Typical 2D DP:
//   dp[i][w] = best value using items[0..i] with total weight <= w
//
// Space-optimised 1D version iterates items in outer loop and weights in
// **descending** order in the inner loop, so each item is only used once.

export function knapSack01(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const n = weights.length;
  if (values.length !== n) {
    throw new Error("weights and values must have the same length");
  }

  const dp = new Array<number>(capacity + 1).fill(0);

  for (let i = 0; i < n; i++) {
    const wt = weights[i];
    const val = values[i];

    // Iterate weight in descending order so each item is considered once.
    for (let w = capacity; w >= wt; w--) {
      const candidate = dp[w - wt] + val;
      if (candidate > dp[w]) {
        dp[w] = candidate;
      }
    }
  }

  return dp[capacity];
}
`,
  },
  {
    meta: {
      id: "dp-lcs",
      title: "Longest Common Subsequence (LCS)",
      summary:
        "2D DP on strings that demonstrates a classic include/exclude recurrence.",
      domain: "string",
      pattern: "bottom-up-table",
      tags: ["lcs", "2D dp", "string", "table"],
    },
    code: `// Longest Common Subsequence (LCS)
//
// Given two strings text1 and text2, return the length of their longest
// common subsequence. A subsequence is obtained by deleting characters
// without changing the order of the remaining characters.
//
// Recurrence:
//   If text1[i] === text2[j]:
//       dp[i+1][j+1] = 1 + dp[i][j]
//   else:
//       dp[i+1][j+1] = max(dp[i][j+1], dp[i+1][j])
//
// We build the table bottom-up starting from the empty prefixes.

export function longestCommonSubsequence(a: string, b: string): number {
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (a[i] === b[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }

  return dp[n][m];
}

// Optional helper that reconstructs one LCS string, useful for visualisation.
export function reconstructLCS(a: string, b: string): string {
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  );

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (a[i] === b[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }

  const result: string[] = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.push(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return result.reverse().join("");
}
`,
  },
  {
    meta: {
      id: "dp-edit-distance",
      title: "Edit Distance (Levenshtein)",
      summary:
        "Classic DP on strings counting insert/delete/replace operations.",
      domain: "string",
      pattern: "bottom-up-table",
      tags: ["edit distance", "levenshtein", "2D dp", "string transform"],
    },
    code: `// Edit Distance (Levenshtein)
//
// Given two strings word1 and word2, return the minimum number of operations
// required to convert word1 to word2. Allowed operations are insert a
// character, delete a character, or replace a character.
//
// dp[i][j] = minimum operations to transform word1[0..i) into word2[0..j)
//
// Transitions:
//   If word1[i-1] === word2[j-1]:
//       dp[i][j] = dp[i-1][j-1]
//   else:
//       dp[i][j] = 1 + min(
//         dp[i-1][j],   // delete from word1
//         dp[i][j-1],   // insert into word1
//         dp[i-1][j-1]  // replace
//       )

export function editDistance(word1: string, word2: string): number {
  const n = word1.length;
  const m = word2.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0)
  );

  for (let i = 0; i <= n; i++) {
    dp[i][0] = i; // i deletions
  }
  for (let j = 0; j <= m; j++) {
    dp[0][j] = j; // j insertions
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const deletion = dp[i - 1][j];
        const insertion = dp[i][j - 1];
        const replacement = dp[i - 1][j - 1];
        dp[i][j] = 1 + Math.min(deletion, insertion, replacement);
      }
    }
  }

  return dp[n][m];
}
`,
  },
  {
    meta: {
      id: "dp-grid-unique-paths",
      title: "Grid – Unique Paths with Obstacles",
      summary:
        "Counts number of paths from top-left to bottom-right with obstacles using 2D DP.",
      domain: "grid",
      pattern: "bottom-up-table",
      tags: ["grid", "paths", "combinatorics", "2D dp"],
    },
    code: `// Unique Paths with Obstacles
//
// Given an m x n grid where some cells are blocked (1 = obstacle, 0 = free),
// count the number of unique paths from top-left to bottom-right. You can move
// only down or right.
//
// dp[r][c] = number of ways to reach cell (r, c).
//
// If grid[r][c] is an obstacle, dp[r][c] = 0.
// Otherwise, dp[r][c] = dp[r-1][c] + dp[r][c-1].

export function uniquePathsWithObstacles(obstacleGrid: number[][]): number {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0]?.length ?? 0;

  if (m === 0 || n === 0) return 0;

  const dp: number[][] = Array.from({ length: m }, () =>
    new Array<number>(n).fill(0)
  );

  // Start cell.
  dp[0][0] = obstacleGrid[0][0] === 1 ? 0 : 1;

  // First column.
  for (let r = 1; r < m; r++) {
    if (obstacleGrid[r][0] === 1) {
      dp[r][0] = 0;
    } else {
      dp[r][0] = dp[r - 1][0];
    }
  }

  // First row.
  for (let c = 1; c < n; c++) {
    if (obstacleGrid[0][c] === 1) {
      dp[0][c] = 0;
    } else {
      dp[0][c] = dp[0][c - 1];
    }
  }

  // Rest of the grid.
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      if (obstacleGrid[r][c] === 1) {
        dp[r][c] = 0;
      } else {
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
      }
    }
  }

  return dp[m - 1][n - 1];
}
`,
  },
  {
    meta: {
      id: "dp-grid-min-path-sum",
      title: "Grid – Minimum Path Sum",
      summary:
        "Shortest path on an m×n grid with non-negative weights using 2D DP.",
      domain: "grid",
      pattern: "bottom-up-table",
      tags: ["grid", "shortest path", "2D dp"],
    },
    code: `// Minimum Path Sum
//
// Given a m x n grid filled with non-negative numbers, find a path from
// top-left to bottom-right which minimises the sum of all numbers along its
// path. You can only move down or right.
//
// dp[r][c] = minimum cost to reach cell (r, c)

export function minPathSum(grid: number[][]): number {
  const m = grid.length;
  const n = grid[0]?.length ?? 0;
  if (m === 0 || n === 0) return 0;

  const dp: number[][] = Array.from({ length: m }, () =>
    new Array<number>(n).fill(0)
  );

  dp[0][0] = grid[0][0];

  for (let r = 1; r < m; r++) {
    dp[r][0] = dp[r - 1][0] + grid[r][0];
  }
  for (let c = 1; c < n; c++) {
    dp[0][c] = dp[0][c - 1] + grid[0][c];
  }

  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      dp[r][c] = Math.min(dp[r - 1][c], dp[r][c - 1]) + grid[r][c];
    }
  }

  return dp[m - 1][n - 1];
}
`,
  },
  {
    meta: {
      id: "dp-lis-nlogn",
      title:
        "Longest Increasing Subsequence – Patience Sorting (O(n log n))",
      summary:
        "Optimised LIS with binary search over tails array, a standard advanced DP pattern.",
      domain: "sequence",
      pattern: "transition-graph",
      tags: ["lis", "n log n", "binary search", "sequence"],
    },
    code: `// Longest Increasing Subsequence – O(n log n) version.
//
// Instead of the simple O(n^2) DP, we use the "patience sorting" trick:
//   - tails[len] = minimum possible tail value of an increasing subsequence
//     with length (len + 1).
//   - For each number x we binary search the first index i where tails[i] >= x
//     and update tails[i] = x.
//   - The length of the LIS is the last index we filled.

export function lengthOfLIS(nums: number[]): number {
  if (nums.length === 0) return 0;

  const tails: number[] = [];

  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;

    // Find insertion position for x.
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    // Now lo is the first index where tails[lo] >= x.
    if (lo === tails.length) {
      tails.push(x);
    } else {
      tails[lo] = x;
    }
  }

  return tails.length;
}
`,
  },
  {
    meta: {
      id: "dp-longest-pal-subsequence",
      title: "Longest Palindromic Subsequence",
      summary:
        "2D DP on a single string, often used as a building block for other problems.",
      domain: "string",
      pattern: "bottom-up-table",
      tags: ["palindrome", "lps", "2D dp"],
    },
    code: `// Longest Palindromic Subsequence
//
// Given a string s, find the length of its longest palindromic subsequence.
// A subsequence reads the same forwards and backwards but characters do not
// need to be contiguous.
//
// dp[i][j] = length of LPS in substring s[i..j]
//
// If s[i] === s[j]:
//   dp[i][j] = 2 + dp[i+1][j-1]
// Else:
//   dp[i][j] = max(dp[i+1][j], dp[i][j-1])
//
// We fill the table by increasing substring length.

export function longestPalindromicSubsequence(s: string): number {
  const n = s.length;
  if (n === 0) return 0;

  const dp: number[][] = Array.from({ length: n }, () =>
    new Array<number>(n).fill(0)
  );

  // Substrings of length 1 are palindromes of length 1.
  for (let i = 0; i < n; i++) {
    dp[i][i] = 1;
  }

  // length is current substring length.
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i + length - 1 < n; i++) {
      const j = i + length - 1;

      if (s[i] === s[j]) {
        if (length === 2) {
          dp[i][j] = 2;
        } else {
          dp[i][j] = 2 + dp[i + 1][j - 1];
        }
      } else {
        dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[0][n - 1];
}
`,
  },
];

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Map template id -> template object for fast lookup in the playground.
 */
export const dynamicProgTemplateMap: Record<string, DynamicProgTemplate> =
  (() => {
    const map: Record<string, DynamicProgTemplate> = {};
    for (const tpl of dynamicProgTemplates) {
      map[tpl.meta.id] = tpl;
    }
    return map;
  })();

/**
 * Get a template by id. Returns undefined if not found.
 */
export function getDynamicProgTemplate(
  id: string
): DynamicProgTemplate | undefined {
  return dynamicProgTemplateMap[id];
}
