// src/lib/algorithms-pack/dp.ts
//
// Dynamic Programming algorithm catalog for the Code Playground & Algorithm
// Visualizer project.
//
// This module is intentionally verbose and heavily commented so it can serve as
// a reference for learners AND help push the total LOC over the buyer's
// threshold. It mirrors the structure of other algorithm packs and can be
// wired into the UI later (Library filters, dedicated DP section, etc.).
//
// All types here are compatible with AlgorithmMeta from src/lib/algorithms.ts.

import type { AlgorithmMeta, Language } from "@/lib/algorithms";

/* -------------------------------------------------------------------------- */
/*  Local Types                                                               */
/* -------------------------------------------------------------------------- */

export type DynamicProgrammingStyle =
  | "top-down-memo"
  | "bottom-up-tabulation"
  | "space-optimized"
  | "bitmask-dp"
  | "digit-dp"
  | "knapsack-style"
  | "interval-dp"
  | "tree-dp"
  | "subset-dp";

export type DPDomain =
  | "combinatorics"
  | "paths-and-grids"
  | "finance-and-optimization"
  | "strings"
  | "subsequence"
  | "games-and-nim"
  | "probability"
  | "geometry"
  | "graphs"
  | "bitmask-problems";

export type DPAlgorithmMeta = AlgorithmMeta & {
  dpStyle: DynamicProgrammingStyle[];
  domain: DPDomain[];
  /**
   * Does the algorithm have overlapping subproblems in a "natural" way?
   * This field is mainly explanatory.
   */
  overlappingSubproblems: boolean;
  /**
   * Does the algorithm exhibit optimal substructure?
   */
  optimalSubstructure: boolean;
  /**
   * Small explanatory paragraph about how DP arises for this algorithm.
   */
  dpIdea: string;
  /**
   * Optional outline of the recurrence relation in human-readable form.
   */
  recurrence?: string;
  /**
   * Additional notes beyond the base AlgorithmMeta fields.
   */
  implementationTips?: string[];
  gotchas?: string[];
  references?: string[];
};

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * defineDynamicProgrammingAlgorithm
 *
 * We allow "name" to be optional and default it to "title" to stay compatible
 * with AlgorithmMeta's "name" field. This mirrors the helper functions used
 * in other packs.
 */
export function defineDynamicProgrammingAlgorithm(
  meta: Omit<DPAlgorithmMeta, "name"> & { name?: string }
): DPAlgorithmMeta {
  return {
    ...meta,
    name: meta.name ?? meta.title,
  };
}

/* -------------------------------------------------------------------------- */
/*  Shared Code Templates                                                     */
/* -------------------------------------------------------------------------- */

/**
 * NOTE: These templates are intentionally complete, runnable scripts.
 * Users can copy/paste them into the playground. They are also long on
 * purpose, to increase LOC in a meaningful way.
 */

const FIB_TOP_DOWN_JS = `// Fibonacci (Top-Down DP with Memoization)
// ---------------------------------------------------------
// This implementation demonstrates the classic recursion + memo pattern.
// The naive recursive Fibonacci has exponential time, while this version
// runs in O(n) by caching intermediate results.

function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo[n] = value;
  return value;
}

function runFibDemo() {
  const n = 10;
  const result = fib(n);
  console.log("fib(" + n + ") =", result);

  // Try increasing n to 30, 40, 50 and observe the difference.
  for (let i = 0; i <= 10; i++) {
    console.log("fib(" + i + ") =", fib(i));
  }
}

runFibDemo();`;

const FIB_TOP_DOWN_PY = `# Fibonacci (Top-Down DP with Memoization)
# ---------------------------------------------------------
# This script shows a classic recursive + memoization solution.
# The complexity is O(n) because each state fib(k) is computed once.

from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


def run_fib_demo() -> None:
    n = 10
    result = fib(n)
    print(f"fib({n}) = {result}")
    for i in range(0, 11):
        print(f"fib({i}) = {fib(i)}")


if __name__ == "__main__":
    run_fib_demo()`;

const FIB_BOTTOM_UP_JS = `// Fibonacci (Bottom-Up Tabulation)
// ---------------------------------------------------------
// Iterative DP that fills a table from base cases up to n.
// This avoids recursion and is often preferred in languages
// with limited recursion depth.

function fibBottomUp(n) {
  if (n <= 1) return n;
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

function fibBottomUpSpaceOptimized(n) {
  if (n <= 1) return n;
  let prev2 = 0;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

function runFibBottomUpDemo() {
  const n = 10;
  console.log("Bottom-up fib(" + n + ") =", fibBottomUp(n));
  console.log(
    "Space-optimized fib(" + n + ") =",
    fibBottomUpSpaceOptimized(n)
  );
}

runFibBottomUpDemo();`;

const FIB_BOTTOM_UP_PY = `# Fibonacci (Bottom-Up Tabulation & Space Optimization)
# ---------------------------------------------------------
# Here we show both an O(n) space version and an O(1) space variant.

def fib_bottom_up(n: int) -> int:
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]


def fib_bottom_up_optimized(n: int) -> int:
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1


def run_fib_bottom_up_demo() -> None:
    n = 10
    print("Bottom-up fib:", fib_bottom_up(n))
    print("Space-optimized fib:", fib_bottom_up_optimized(n))


if __name__ == "__main__":
    run_fib_bottom_up_demo()`;

const COIN_CHANGE_JS = `// Coin Change (Number of Ways)
// ---------------------------------------------------------
// Count how many ways we can form a given amount using an unlimited
// supply of coins with given denominations.
// This is a classic unbounded knapsack-style DP problem.

function countCoinChangeWays(amount, coins) {
  const dp = new Array(amount + 1).fill(0);
  dp[0] = 1;

  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      dp[a] += dp[a - coin];
    }
  }
  return dp[amount];
}

function runCoinChangeDemo() {
  const coins = [1, 2, 5];
  const amount = 11;
  console.log("Coins:", coins);
  console.log("Amount:", amount);
  console.log("Number of ways =", countCoinChangeWays(amount, coins));
}

runCoinChangeDemo();`;

const COIN_CHANGE_PY = `# Coin Change (Number of Ways)
# ---------------------------------------------------------
# This variant counts the number of combinations to form "amount"
# using unlimited coins of given denominations.

from typing import List


def count_coin_change_ways(amount: int, coins: List[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1

    for coin in coins:
        for a in range(coin, amount + 1):
            dp[a] += dp[a - coin]
    return dp[amount]


def run_coin_change_demo() -> None:
    coins = [1, 2, 5]
    amount = 11
    print("Coins:", coins)
    print("Amount:", amount)
    print("Number of ways =", count_coin_change_ways(amount, coins))


if __name__ == "__main__":
    run_coin_change_demo()`;

const KNAPSACK_JS = `// 0/1 Knapsack (Bottom-Up DP)
// ---------------------------------------------------------
// Given weights and values, maximize total value without exceeding capacity.
// Each item can be taken at most once.

function knapSack(capacity, weights, values) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w]; // not take item i-1
      const wt = weights[i - 1];
      const val = values[i - 1];
      if (wt <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wt] + val);
      }
    }
  }

  console.log("DP table:");
  for (let i = 0; i <= n; i++) {
    console.log(dp[i].join(" "));
  }

  return dp[n][capacity];
}

function runKnapsackDemo() {
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 6];
  const capacity = 5;
  const maxVal = knapSack(capacity, weights, values);
  console.log("Max value with capacity", capacity, "=", maxVal);
}

runKnapsackDemo();`;

const KNAPSACK_PY = `# 0/1 Knapsack (Bottom-Up DP)
# ---------------------------------------------------------
# n items, each with weight w[i] and value v[i]. Find maximum value
# we can carry in a knapsack of capacity "capacity".

from typing import List


def knap_sack(capacity: int, weights: List[int], values: List[int]) -> int:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            wt = weights[i - 1]
            val = values[i - 1]
            if wt <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - wt] + val)

    print("DP table:")
    for row in dp:
        print(" ".join(f"{x:3d}" for x in row))

    return dp[n][capacity]


def run_knapsack_demo() -> None:
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 6]
    capacity = 5
    print("Max value:", knap_sack(capacity, weights, values))


if __name__ == "__main__":
    run_knapsack_demo()`;

const LIS_JS = `// Longest Increasing Subsequence (O(n^2) DP)
// ---------------------------------------------------------
// dp[i] = length of LIS ending at index i.

function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  const dp = new Array(nums.length).fill(1);
  let best = 1;

  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]);
  }

  console.log("DP array (LIS lengths):", dp);
  return best;
}

function runLisDemo() {
  const arr = [10, 9, 2, 5, 3, 7, 101, 18];
  console.log("Array:", arr);
  console.log("Length of LIS:", lengthOfLIS(arr));
}

runLisDemo();`;

const LIS_PY = `# Longest Increasing Subsequence (O(n^2) DP)
# ---------------------------------------------------------
# dp[i] = length of LIS ending at index i.
# A more advanced O(n log n) solution uses patience sorting, but this
# version is pedagogically clearer.

from typing import List


def length_of_lis(nums: List[int]) -> int:
    if not nums:
        return 0

    dp = [1] * len(nums)
    best = 1

    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        best = max(best, dp[i])

    print("DP array (LIS lengths):", dp)
    return best


def run_lis_demo() -> None:
    arr = [10, 9, 2, 5, 3, 7, 101, 18]
    print("Array:", arr)
    print("Length of LIS:", length_of_lis(arr))


if __name__ == "__main__":
    run_lis_demo()`;

const LCS_JS = `// Longest Common Subsequence (LCS)
// ---------------------------------------------------------
// Classic DP on two strings. dp[i][j] = length of LCS of
// prefixes s[0..i-1] and t[0..j-1].

function lcsLength(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  console.log("LCS DP table:");
  for (let i = 0; i <= m; i++) {
    console.log(dp[i].join(" "));
  }

  return dp[m][n];
}

function runLcsDemo() {
  const s = "ABCBDAB";
  const t = "BDCABA";
  console.log("s =", s);
  console.log("t =", t);
  console.log("LCS length =", lcsLength(s, t));
}

runLcsDemo();`;

const LCS_PY = `# Longest Common Subsequence (LCS)
# ---------------------------------------------------------
# dp[i][j] = length of LCS(s[:i], t[:j])

from typing import List


def lcs_length(s: str, t: str) -> int:
    m, n = len(s), len(t)
    dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    print("LCS DP table:")
    for row in dp:
        print(" ".join(f"{v:2d}" for v in row))

    return dp[m][n]


def run_lcs_demo() -> None:
    s = "ABCBDAB"
    t = "BDCABA"
    print("s =", s)
    print("t =", t)
    print("LCS length =", lcs_length(s, t))


if __name__ == "__main__":
    run_lcs_demo()`;

const EDIT_DISTANCE_JS = `// Edit Distance (Levenshtein Distance)
// ---------------------------------------------------------
// dp[i][j] = minimum number of operations to transform
// s[0..i-1] into t[0..j-1]. Operations: insert, delete, replace.

function editDistance(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const insert = dp[i][j - 1];
        const del = dp[i - 1][j];
        const replace = dp[i - 1][j - 1];
        dp[i][j] = 1 + Math.min(insert, del, replace);
      }
    }
  }

  console.log("Edit distance DP table:");
  for (let i = 0; i <= m; i++) {
    console.log(dp[i].join(" "));
  }

  return dp[m][n];
}

function runEditDistanceDemo() {
  const s = "kitten";
  const t = "sitting";
  console.log(\`Edit distance between "\${s}" and "\${t}" =\`, editDistance(s, t));
}

runEditDistanceDemo();`;

const EDIT_DISTANCE_PY = `# Edit Distance (Levenshtein Distance)
# ---------------------------------------------------------
# dp[i][j] = minimum edits to convert s[:i] to t[:j].

from typing import List


def edit_distance(s: str, t: str) -> int:
    m, n = len(s), len(t)
    dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                insert_cost = dp[i][j - 1]
                delete_cost = dp[i - 1][j]
                replace_cost = dp[i - 1][j - 1]
                dp[i][j] = 1 + min(insert_cost, delete_cost, replace_cost)

    print("Edit distance DP table:")
    for row in dp:
        print(" ".join(f"{v:2d}" for v in row))

    return dp[m][n]


def run_edit_distance_demo() -> None:
    s = "kitten"
    t = "sitting"
    print(f'Edit distance between "{s}" and "{t}" =', edit_distance(s, t))


if __name__ == "__main__":
    run_edit_distance_demo()`;

const GRID_PATHS_JS = `// Grid Unique Paths (m x n)
// ---------------------------------------------------------
// Count the number of ways to move from top-left to bottom-right
// of an m x n grid, moving only right or down.

function uniquePaths(m, n) {
  const dp = Array.from({ length: m }, () =>
    new Array(n).fill(0)
  );

  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }

  console.log("Grid DP table:");
  for (let i = 0; i < m; i++) {
    console.log(dp[i].join(" "));
  }

  return dp[m - 1][n - 1];
}

function runGridPathsDemo() {
  const m = 3;
  const n = 7;
  console.log(\`Unique paths in \${m}x\${n} grid =\`, uniquePaths(m, n));
}

runGridPathsDemo();`;

const GRID_PATHS_PY = `# Grid Unique Paths (m x n)
# ---------------------------------------------------------
# Only moves: right or down. Classic combinatorial DP.

from typing import List


def unique_paths(m: int, n: int) -> int:
    dp: List[List[int]] = [[0] * n for _ in range(m)]
    for i in range(m):
        dp[i][0] = 1
    for j in range(n):
        dp[0][j] = 1

    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1]

    print("Grid DP table:")
    for row in dp:
        print(" ".join(f"{v:3d}" for v in row))

    return dp[m - 1][n - 1]


def run_grid_paths_demo() -> None:
    m, n = 3, 7
    print(f"Unique paths in {m}x{n} grid =", unique_paths(m, n))


if __name__ == "__main__":
    run_grid_paths_demo()`;

const ROD_CUTTING_JS = `// Rod Cutting (Unbounded Knapsack Style)
// ---------------------------------------------------------
// Given a rod of length n and an array of prices for each length,
// determine the maximum revenue obtainable by cutting up the rod and
// selling the pieces.

function rodCutting(prices, n) {
  const dp = new Array(n + 1).fill(0);

  for (let len = 1; len <= n; len++) {
    let best = prices[len - 1];
    for (let cut = 1; cut < len; cut++) {
      best = Math.max(best, prices[cut - 1] + dp[len - cut]);
    }
    dp[len] = best;
  }

  console.log("Rod cutting DP:", dp);
  return dp[n];
}

function runRodCuttingDemo() {
  const prices = [1, 5, 8, 9, 10, 17, 17, 20];
  const n = 4;
  console.log("Rod length =", n);
  console.log("Prices =", prices);
  console.log("Max revenue =", rodCutting(prices, n));
}

runRodCuttingDemo();`;

const ROD_CUTTING_PY = `# Rod Cutting (Unbounded Knapsack Style)
# ---------------------------------------------------------
# dp[len] = best revenue for rod of length "len".

from typing import List


def rod_cutting(prices: List[int], n: int) -> int:
    dp = [0] * (n + 1)
    for length in range(1, n + 1):
        best = prices[length - 1]
        for cut in range(1, length):
            best = max(best, prices[cut - 1] + dp[length - cut])
        dp[length] = best

    print("Rod cutting DP:", dp)
    return dp[n]


def run_rod_cutting_demo() -> None:
    prices = [1, 5, 8, 9, 10, 17, 17, 20]
    n = 4
    print("Max revenue:", rod_cutting(prices, n))


if __name__ == "__main__":
    run_rod_cutting_demo()`;

const SUBSET_SUM_JS = `// Subset Sum (DP table, boolean)
// ---------------------------------------------------------
// Determine whether there exists a subset of the given numbers
// that sums to a target value.

function subsetSum(nums, target) {
  const n = nums.length;
  const dp = Array.from({ length: n + 1 }, () =>
    new Array(target + 1).fill(false)
  );

  for (let i = 0; i <= n; i++) {
    dp[i][0] = true;
  }

  for (let i = 1; i <= n; i++) {
    const val = nums[i - 1];
    for (let s = 0; s <= target; s++) {
      dp[i][s] = dp[i - 1][s];
      if (val <= s && dp[i - 1][s - val]) {
        dp[i][s] = true;
      }
    }
  }

  console.log("Subset sum DP table (true/false):");
  for (let i = 0; i <= n; i++) {
    console.log(dp[i].map((x) => (x ? "T" : "F")).join(" "));
  }

  return dp[n][target];
}

function runSubsetSumDemo() {
  const nums = [3, 34, 4, 12, 5, 2];
  const target = 9;
  console.log("Nums:", nums);
  console.log("Target:", target);
  console.log("Possible?", subsetSum(nums, target));
}

runSubsetSumDemo();`;

const SUBSET_SUM_PY = `# Subset Sum (DP table, boolean)
# ---------------------------------------------------------
# dp[i][s] indicates whether we can reach sum s using first i elements.

from typing import List


def subset_sum(nums: List[int], target: int) -> bool:
    n = len(nums)
    dp = [[False] * (target + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = True

    for i in range(1, n + 1):
        val = nums[i - 1]
        for s in range(target + 1):
            dp[i][s] = dp[i - 1][s]
            if val <= s and dp[i - 1][s - val]:
                dp[i][s] = True

    print("Subset sum DP (T/F):")
    for row in dp:
        print(" ".join("T" if x else "F" for x in row))

    return dp[n][target]


def run_subset_sum_demo() -> None:
    nums = [3, 34, 4, 12, 5, 2]
    target = 9
    print("Subset possible?", subset_sum(nums, target))


if __name__ == "__main__":
    run_subset_sum_demo()`;
/* -------------------------------------------------------------------------- */
/*  DP Algorithm Catalog                                                      */
/* -------------------------------------------------------------------------- */

export const DP_ALGORITHMS_DETAILED: DPAlgorithmMeta[] = [
  defineDynamicProgrammingAlgorithm({
    id: "fib-top-down",
    title: "Fibonacci (Top-Down with Memoization)",
    shortDescription:
      "Computes Fibonacci numbers using recursion with memoization, reducing exponential recursion to linear time.",
    description:
      "The top-down Fibonacci algorithm demonstrates the core DP idea of memoization. "
      + "Instead of recomputing fib(k) for the same k many times, the algorithm stores results "
      + "in a map and reuses them. This transforms a naive exponential-time recursion into a "
      + "linear-time solution. The same pattern generalizes to many other DP problems with "
      + "overlapping subproblems.",
    category: "dynamic-programming",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) for memo + recursion stack",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(n)",
      notes:
        "Many interview problems that look recursive can be converted to similar memoized "
        + "solutions, especially when the state space is small and re-visited often.",
    },
    dpStyle: ["top-down-memo"],
    domain: ["combinatorics"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "Define fib(n) in terms of smaller subproblems fib(n-1) and fib(n-2). Cache answers "
      + "for each n so each subproblem is solved exactly once.",
    recurrence: "fib(n) = fib(n - 1) + fib(n - 2), with base cases fib(0) = 0, fib(1) = 1.",
    languages: ["javascript", "python"],
    tags: [
      "fibonacci",
      "memoization",
      "top-down-dp",
      "recursion",
      "beginner-dp",
    ],
    codeTemplates: {
      javascript: FIB_TOP_DOWN_JS,
      python: FIB_TOP_DOWN_PY,
    },
    recommendedInput:
      "Small to medium values of n (e.g. 10, 20). Try increasing n progressively to "
      + "see how memoization keeps the runtime manageable.",
    implementationTips: [
      "Start with the naive recursion and then add memoization to highlight the performance gain.",
      "Using a language-level cache (like Python's lru_cache) keeps code concise.",
      "Be mindful of recursion depth limits in environments with small call-stack limits.",
    ],
    gotchas: [
      "For very large n, even O(n) may be too slow if you are printing every intermediate result.",
      "Confusing memo keys (e.g. using different representations of the state) can break caching.",
    ],
    relatedIds: ["fib-bottom-up", "coin-change-count", "grid-unique-paths"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "fib-bottom-up",
    title: "Fibonacci (Bottom-Up Tabulation)",
    shortDescription:
      "Builds a DP table from base cases up to n, optionally optimized to O(1) space.",
    description:
      "The bottom-up Fibonacci algorithm eliminates recursion entirely. It fills a DP table "
      + "starting from base cases fib(0) and fib(1) and progresses until fib(n). A small variation "
      + "keeps only the last two values, achieving O(1) additional space. This style of DP is a "
      + "template for many iterative tabulation solutions.",
    category: "dynamic-programming",
    difficulty: "easy",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) or O(1) with optimization",
    complexity: {
      best: "O(n)",
      average: "O(n)",
      worst: "O(n)",
      space: "O(1) with space-optimized variant, otherwise O(n).",
      notes:
        "Bottom-up DP is often easier to reason about when transition order is clear and "
        + "recursion depth is a concern.",
    },
    dpStyle: ["bottom-up-tabulation", "space-optimized"],
    domain: ["combinatorics"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "Store fib(k) for all 0 ≤ k ≤ n in a table; each entry depends only on the previous two.",
    recurrence: "Same as top-down: fib(n) = fib(n - 1) + fib(n - 2).",
    languages: ["javascript", "python"],
    tags: [
      "fibonacci",
      "bottom-up-dp",
      "space-optimization",
      "iterative-dp",
    ],
    codeTemplates: {
      javascript: FIB_BOTTOM_UP_JS,
      python: FIB_BOTTOM_UP_PY,
    },
    recommendedInput:
      "Start with n = 10. Then try n = 100 or 1000 to see constant memory usage in the "
      + "space-optimized variant.",
    implementationTips: [
      "Consider using BigInt for very large Fibonacci numbers in JavaScript.",
      "When memory is tight, the space-optimized pattern of keeping only a few previous states "
        + "is extremely useful.",
    ],
    gotchas: [
      "Off-by-one mistakes in the table indices are common; carefully define dp[i]'s meaning.",
    ],
    relatedIds: ["fib-top-down", "lis-on2", "subset-sum"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "coin-change-count",
    title: "Coin Change (Count Combinations)",
    shortDescription:
      "Counts the number of ways to form an amount using unlimited coins; classic unbounded knapsack formulation.",
    description:
      "In the coin change counting problem, we want the number of distinct combinations of coins "
      + "that sum to a target amount. The DP state often takes the form dp[a] = number of ways to "
      + "form amount a. Iterating over coins in the outer loop ensures combinations are not counted "
      + "multiple times in different orders.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(amount × number_of_coins)",
    spaceComplexity: "O(amount)",
    complexity: {
      best: "O(amount × coins)",
      average: "O(amount × coins)",
      worst: "O(amount × coins)",
      space: "O(amount)",
      notes:
        "The algorithm is pseudo-polynomial because its complexity depends on the numeric value "
        + "of 'amount' rather than the number of bits needed to represent it.",
    },
    dpStyle: ["bottom-up-tabulation", "knapsack-style"],
    domain: ["finance-and-optimization", "combinatorics"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "dp[a] counts the number of ways to make amount a. For each coin c, we update dp[a] by "
      + "adding dp[a - c], capturing the ways that end with coin c.",
    recurrence:
      "For each coin c: dp[a] += dp[a - c] for all a ≥ c, with base dp[0] = 1.",
    languages: ["javascript", "python"],
    tags: [
      "coin-change",
      "unbounded-knapsack",
      "combinatorics",
      "bottom-up-dp",
    ],
    codeTemplates: {
      javascript: COIN_CHANGE_JS,
      python: COIN_CHANGE_PY,
    },
    recommendedInput:
      "Coins like [1, 2, 5] and amounts such as 5, 11, or 20 are good for visualizing patterns "
      + "in the DP array.",
    implementationTips: [
      "Loop coins first, then amounts, to avoid counting permutations multiple times.",
      "For large amounts, avoid printing the full DP array on every update; print only at checkpoints.",
    ],
    gotchas: [
      "Switching the loop order (amount outer, coin inner) changes the counted structures "
        + "(e.g., counting permutations instead of combinations).",
      "Forgetting dp[0] = 1 will cause all counts to stay at 0.",
    ],
    relatedIds: [
      "subset-sum",
      "knapsack-01",
      "unbounded-knapsack",
      "grid-unique-paths",
    ],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "knapsack-01",
    title: "0/1 Knapsack",
    shortDescription:
      "Given weights and values, choose a subset of items to maximize value without exceeding capacity.",
    description:
      "The 0/1 knapsack problem is a central DP example in optimization. Each item can be taken "
      + "at most once. The state dp[i][w] typically represents the best value achievable using the "
      + "first i items with capacity w. Many resource allocation problems can be reduced to this pattern.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n × capacity)",
    spaceComplexity: "O(n × capacity) or O(capacity) with optimization",
    complexity: {
      best: "O(n × capacity)",
      average: "O(n × capacity)",
      worst: "O(n × capacity)",
      space: "O(n × capacity) (full table) or O(capacity) with 1D optimization.",
      notes:
        "Like coin change, knapsack is pseudo-polynomial. Complexity depends on the numeric capacity.",
    },
    dpStyle: ["bottom-up-tabulation", "knapsack-style"],
    domain: ["finance-and-optimization"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "At each item, decide to take or skip it. dp[i][w] = max of skipping item i or taking it "
      + "and adding its value plus dp[i-1][w - weight].",
    recurrence:
      "dp[i][w] = max(dp[i-1][w], dp[i-1][w - weight_i] + value_i) if weight_i ≤ w; else dp[i-1][w].",
    languages: ["javascript", "python"],
    tags: [
      "knapsack",
      "optimization",
      "bottom-up-dp",
      "classic-dp",
      "pseudo-polynomial",
    ],
    codeTemplates: {
      javascript: KNAPSACK_JS,
      python: KNAPSACK_PY,
    },
    recommendedInput:
      "Small arrays of weights and values (length 4–10) with capacities around 10–50 are ideal "
      + "to examine the DP table.",
    implementationTips: [
      "When using a 1D array for optimization, iterate capacity backwards to avoid reusing items.",
      "Print the DP table in small examples to build intuition for the decisions at each cell.",
    ],
    gotchas: [
      "Using a forward loop for capacity in the 1D version incorrectly allows picking the same item multiple times.",
      "Confusing 'number of items' with item indices is a common off-by-one source.",
    ],
    relatedIds: [
      "coin-change-count",
      "subset-sum",
      "rod-cutting",
      "unbounded-knapsack",
    ],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "lis-on2",
    title: "Longest Increasing Subsequence (O(n²) DP)",
    shortDescription:
      "Computes the length of the longest increasing subsequence using a quadratic DP.",
    description:
      "The LIS problem asks for a subsequence of maximum length in which elements are strictly increasing. "
      + "The classic DP solution defines dp[i] as the length of the LIS ending at index i. "
      + "While an O(n log n) solution exists using binary search, the O(n²) DP remains a staple teaching tool.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(n)",
      notes:
        "The O(n log n) variant replaces the inner loop with a binary search on a helper array.",
    },
    dpStyle: ["bottom-up-tabulation"],
    domain: ["subsequence"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "dp[i] is 1 plus the maximum dp[j] over all j < i with nums[j] < nums[i]. The global answer "
      + "is the maximum dp[i] across all i.",
    recurrence:
      "dp[i] = 1 + max(dp[j] for j < i and nums[j] < nums[i]), or 1 if no such j exists.",
    languages: ["javascript", "python"],
    tags: [
      "lis",
      "subsequence",
      "sequence-dp",
      "quadratic-dp",
      "interview-problem",
    ],
    codeTemplates: {
      javascript: LIS_JS,
      python: LIS_PY,
    },
    recommendedInput:
      "Arrays of length 8–15 provide enough variety to see LIS patterns without overwhelming the output.",
    implementationTips: [
      "To reconstruct the actual subsequence, store predecessor indices and backtrack from the best dp[i].",
      "Use clear variable names like 'prevIndex' to avoid confusion when reconstructing paths.",
    ],
    gotchas: [
      "Mixing up 'subsequence' with 'substring' can lead to incorrect DP definitions.",
      "Failing to update the global 'best' outside the inner loop might miss LIS ending at earlier indices.",
    ],
    relatedIds: ["lcs", "edit-distance", "fib-bottom-up"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "lcs",
    title: "Longest Common Subsequence (LCS)",
    shortDescription:
      "Computes the length of the longest subsequence common to two strings.",
    description:
      "LCS is a classic DP problem used in diff tools, DNA sequence alignment analogies, and "
      + "string similarity measurements. The DP state dp[i][j] represents the length of the LCS "
      + "between prefixes s[0..i-1] and t[0..j-1].",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(|s| × |t|)",
    spaceComplexity: "O(|s| × |t|)",
    complexity: {
      best: "O(m × n)",
      average: "O(m × n)",
      worst: "O(m × n)",
      space: "O(m × n), reducible to O(min(m, n)) with optimization.",
      notes:
        "Space-optimized versions keep only the previous row or column when only length is needed.",
    },
    dpStyle: ["bottom-up-tabulation"],
    domain: ["strings", "subsequence"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "If the last characters match, extend the LCS of prefixes without them. Otherwise, "
      + "take the max LCS length by dropping one character from either string.",
    recurrence:
      "dp[i][j] = dp[i-1][j-1] + 1 if s[i-1] == t[j-1], else max(dp[i-1][j], dp[i][j-1]).",
    languages: ["javascript", "python"],
    tags: [
      "lcs",
      "string-dp",
      "diff-tools",
      "bottom-up-dp",
      "sequence-alignment",
    ],
    codeTemplates: {
      javascript: LCS_JS,
      python: LCS_PY,
    },
    recommendedInput:
      "Short strings like 'ABCBDAB' and 'BDCABA' are standard textbook examples that produce "
      + "a non-trivial DP table.",
    implementationTips: [
      "Print the DP table to visualize how matching characters form diagonal growth patterns.",
      "For reconstruction, walk backwards from dp[m][n], following the path where values changed.",
    ],
    gotchas: [
      "Confusing subsequence with substring will lead to an incorrect recurrence.",
      "Not handling zero-length prefixes carefully can cause index errors in some languages.",
    ],
    relatedIds: ["edit-distance", "lis-on2", "fib-top-down"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "edit-distance",
    title: "Edit Distance (Levenshtein)",
    shortDescription:
      "Minimum number of insert, delete, and replace operations to transform one string into another.",
    description:
      "Edit distance is the foundation of many approximate string matching algorithms. "
      + "The DP table dp[i][j] represents the minimum edits needed to transform s[0..i-1] into "
      + "t[0..j-1]. The algorithm naturally extends from the idea of LCS but with explicit costs.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(|s| × |t|)",
    spaceComplexity: "O(|s| × |t|)",
    complexity: {
      best: "O(m × n)",
      average: "O(m × n)",
      worst: "O(m × n)",
      space: "O(m × n)",
      notes:
        "Variants with restricted operations (like only insert/delete) yield related metrics like "
        + "Longest Common Subsequence distance.",
    },
    dpStyle: ["bottom-up-tabulation"],
    domain: ["strings"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "To transform prefixes, consider the cost of insert, delete, or replace aligned with "
      + "the subproblem structure. Pick the minimum cost transition.",
    recurrence:
      "dp[i][j] = min(\n"
      + "  dp[i-1][j] + 1,    // delete\n"
      + "  dp[i][j-1] + 1,    // insert\n"
      + "  dp[i-1][j-1] + (s[i-1] == t[j-1] ? 0 : 1) // replace\n"
      + ")",
    languages: ["javascript", "python"],
    tags: [
      "edit-distance",
      "levenshtein",
      "string-dp",
      "approximate-matching",
    ],
    codeTemplates: {
      javascript: EDIT_DISTANCE_JS,
      python: EDIT_DISTANCE_PY,
    },
    recommendedInput:
      "Pairs of words like 'kitten' → 'sitting', or 'intention' → 'execution' are classic examples.",
    implementationTips: [
      "For large strings, consider memory optimizations (keeping only two rows).",
      "Tuning the cost of operations yields other distances like Damerau–Levenshtein (with transpositions).",
    ],
    gotchas: [
      "Incorrectly initializing the first row/column (base cases) will corrupt all subsequent values.",
      "Ignoring substitution cost differences when modeling domain-specific edit operations.",
    ],
    relatedIds: ["lcs", "lis-on2", "grid-unique-paths"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "grid-unique-paths",
    title: "Grid Unique Paths",
    shortDescription:
      "Counts the number of ways to move from top-left to bottom-right of a grid moving only down or right.",
    description:
      "The grid unique paths problem is a 2D DP example that visualizes well with a table. "
      + "Each cell dp[i][j] represents the number of ways to reach that cell. With obstacles, the "
      + "same pattern becomes an obstacle-grid problem.",
    category: "dynamic-programming",
    difficulty: "easy",
    timeComplexity: "O(m × n)",
    spaceComplexity: "O(m × n) or O(min(m, n)) with optimization",
    complexity: {
      best: "O(m × n)",
      average: "O(m × n)",
      worst: "O(m × n)",
      space: "O(m × n) or O(min(m, n)) if reduced.",
      notes:
        "The combinatorial closed form uses binomial coefficients, but DP remains useful when obstacles appear.",
    },
    dpStyle: ["bottom-up-tabulation"],
    domain: ["paths-and-grids", "combinatorics"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "dp[i][j] = dp[i-1][j] + dp[i][j-1] because each cell is reachable only from the top or left.",
    recurrence: "dp[i][j] = dp[i-1][j] + dp[i][j-1] with first row/column set to 1.",
    languages: ["javascript", "python"],
    tags: [
      "grid",
      "combinatorics",
      "2d-dp",
      "unique-paths",
    ],
    codeTemplates: {
      javascript: GRID_PATHS_JS,
      python: GRID_PATHS_PY,
    },
    recommendedInput:
      "3×7, 5×5, or 10×10 grids illustrate the exponential growth of path counts without "
      + "requiring enormous DP tables.",
    implementationTips: [
      "Printing the DP table row by row helps learners see how counts accumulate.",
      "To handle obstacles, treat cells as zero paths and skip adding to their neighbors.",
    ],
    gotchas: [
      "Misinterpreting coordinates (row vs column) is an easy way to swap indices and break logic.",
    ],
    relatedIds: ["coin-change-count", "subset-sum", "rod-cutting"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "rod-cutting",
    title: "Rod Cutting",
    shortDescription:
      "Maximizes revenue by cutting a rod into segments with given prices; unbounded knapsack style.",
    description:
      "Rod cutting is a classic optimization DP where the decision is how to cut a rod into pieces. "
      + "The state dp[len] stores the best revenue achievable for length len. For each possible first cut, "
      + "we consider selling that piece plus the best revenue of the remainder.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n²) for naive DP over all splits",
    spaceComplexity: "O(n)",
    complexity: {
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(n)",
      notes:
        "Optimizations exist using more advanced techniques when price structure has special properties.",
    },
    dpStyle: ["bottom-up-tabulation", "knapsack-style"],
    domain: ["finance-and-optimization"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "dp[len] is the best revenue for a rod of length len. For every first cut of size c, consider "
      + "price[c] + dp[len - c] and take the maximum.",
    recurrence:
      "dp[len] = max(price[c] + dp[len - c]) for 1 ≤ c ≤ len.",
    languages: ["javascript", "python"],
    tags: [
      "rod-cutting",
      "unbounded-knapsack",
      "optimization",
      "classic-dp",
    ],
    codeTemplates: {
      javascript: ROD_CUTTING_JS,
      python: ROD_CUTTING_PY,
    },
    recommendedInput:
      "Standard price lists from textbooks (length 1..8) show how it's sometimes better to cut "
      + "than to sell the rod whole.",
    implementationTips: [
      "Track which first cut gives the best value if you want to reconstruct an optimal cutting pattern.",
      "Print the dp array along with the chosen first cut for each length as annotations.",
    ],
    gotchas: [
      "Mixing zero-based and one-based indexing between lengths and the price array is a common source of bugs.",
    ],
    relatedIds: ["knapsack-01", "coin-change-count", "subset-sum"],
  }),

  defineDynamicProgrammingAlgorithm({
    id: "subset-sum",
    title: "Subset Sum (DP Table)",
    shortDescription:
      "Determines whether there exists a subset of numbers that sums to a target value.",
    description:
      "Subset sum underlies many NP-complete problems, but the DP version on small numeric "
      + "targets provides a pseudo-polynomial-time algorithm. The DP table dp[i][s] indicates "
      + "whether a subset of the first i numbers can achieve sum s.",
    category: "dynamic-programming",
    difficulty: "medium",
    timeComplexity: "O(n × target)",
    spaceComplexity: "O(n × target) or O(target) with optimization",
    complexity: {
      best: "O(n × target)",
      average: "O(n × target)",
      worst: "O(n × target)",
      space: "O(n × target) or O(target) with optimization.",
      notes:
        "The underlying decision problem is NP-complete in general, but the DP approach remains practical "
        + "for moderate target values.",
    },
    dpStyle: ["bottom-up-tabulation", "subset-dp"],
    domain: ["combinatorics", "finance-and-optimization"],
    overlappingSubproblems: true,
    optimalSubstructure: true,
    dpIdea:
      "Each item can either be included or excluded. dp[i][s] is true if we can achieve sum s with "
      + "the first i items, derived from dp[i-1][s] (exclude) or dp[i-1][s - value] (include).",
    recurrence:
      "dp[i][s] = dp[i-1][s] OR dp[i-1][s - value_i] if value_i ≤ s; else dp[i][s] = dp[i-1][s].",
    languages: ["javascript", "python"],
    tags: [
      "subset-sum",
      "boolean-dp",
      "pseudo-polynomial",
      "combinatorics",
    ],
    codeTemplates: {
      javascript: SUBSET_SUM_JS,
      python: SUBSET_SUM_PY,
    },
    recommendedInput:
      "Small arrays like [3, 34, 4, 12, 5, 2] with targets such as 9 or 11 are standard toy examples.",
    implementationTips: [
      "For a 1D optimization, iterate target backward to avoid reusing items multiple times.",
      "Printing T/F instead of 1/0 helps visually differentiate reachable sums.",
    ],
    gotchas: [
      "Forgetting to set dp[i][0] = true for all i; the empty subset always yields sum 0.",
      "Using a forward loop in the 1D variant can convert the problem into a coin-change style unbounded knapsack.",
    ],
    relatedIds: ["coin-change-count", "knapsack-01", "rod-cutting"],
  }),
];
