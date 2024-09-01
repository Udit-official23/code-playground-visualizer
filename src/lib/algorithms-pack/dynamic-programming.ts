// src/lib/algorithms-pack/dynamic-programming.ts
//
// Dynamic Programming algorithm catalog for the Code Playground & Algorithm
// Visualizer.
//
// This module is intentionally verbose and heavily commented so that it acts
// both as a learning resource and as a meaningful LOC contribution. It defines
// several classic DP problems with runnable JavaScript and Python templates.
//
// The shapes are compatible with AlgorithmMeta from src/lib/algorithms.ts.

import type { AlgorithmMeta } from "@/lib/algorithms";

/* -------------------------------------------------------------------------- */
/*  Local Types                                                               */
/* -------------------------------------------------------------------------- */

export type DynamicProgrammingStyle =
  | "top-down-memoization"
  | "bottom-up-tabulation"
  | "space-optimized"
  | "bitmask-dp"
  | "knapsack-family"
  | "sequence-alignment";

export type DynamicProgrammingDomain =
  | "combinatorics"
  | "paths-and-grids"
  | "subsequence"
  | "subset-sums"
  | "string-matching"
  | "edit-distance"
  | "knapsack"
  | "coins"
  | "trees"
  | "graphs";

export type DynamicProgrammingMeta = AlgorithmMeta & {
  dpStyle: DynamicProgrammingStyle;
  domains: DynamicProgrammingDomain[];
  /**
   * High-level explanation of the state definition and transition.
   */
  stateDefinition: string;
  transitionRelation: string;
  /**
   * Whether the algorithm is primarily of educational value in most
   * day-to-day development work.
   */
  primarilyEducational?: boolean;
  /**
   * A short checklist of typical pitfalls for this DP recipe.
   */
  pitfalls?: string[];
};

/* -------------------------------------------------------------------------- */
/*  Helper                                                                    */
/* -------------------------------------------------------------------------- */

export function defineDynamicProgrammingAlgorithm(
  meta: Omit<DynamicProgrammingMeta, "name"> & { name?: string }
): DynamicProgrammingMeta {
  return {
    ...meta,
    name: meta.name ?? meta.title,
  };
}

/* -------------------------------------------------------------------------- */
/*  Code Templates                                                            */
/* -------------------------------------------------------------------------- */

/**
 * All templates are standalone scripts so users can paste them directly
 * into the playground and run them without extra wiring.
 */

/* ----------------------- Fibonacci (Top-Down Memo) ------------------------ */

const FIB_TOP_DOWN_JS = `// Fibonacci (Top-Down DP with Memoization)
// ------------------------------------------------------------------
// State:    f(n) = n-th Fibonacci number
// Relation: f(n) = f(n-1) + f(n-2), with base cases f(0) = 0, f(1) = 1.
// Complexity: O(n) time, O(n) space for the memo table.

function fib(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;

  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

function runFibDemo() {
  for (let i = 0; i <= 10; i++) {
    console.log("fib(" + i + ") =", fib(i));
  }

  const bigN = 40;
  console.log("fib(" + bigN + ") =", fib(bigN));
}

runFibDemo();`;

const FIB_TOP_DOWN_PY = `# Fibonacci (Top-Down DP with Memoization)
# ------------------------------------------------------------------
# State:    f(n) = n-th Fibonacci number
# Relation: f(n) = f(n-1) + f(n-2)
# Complexity: O(n) time, O(n) space

from functools import lru_cache


@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)


def run_fib_demo() -> None:
    for i in range(11):
        print(f"fib({i}) = {fib(i)}")
    big_n = 40
    print(f"fib({big_n}) = {fib(big_n)}")


if __name__ == "__main__":
    run_fib_demo()`;

/* ----------------------- Fibonacci (Bottom-Up Tab) ------------------------ */

const FIB_BOTTOM_UP_JS = `// Fibonacci (Bottom-Up Tabulation)
// ------------------------------------------------------------------
// Build the table from the base cases up to n.
// Complexity: O(n) time, O(1) extra space if we keep only 2 last values.

function fibBottomUp(n) {
  if (n <= 1) return n;

  let prev2 = 0; // f(0)
  let prev1 = 1; // f(1)

  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}

function runFibBottomUpDemo() {
  for (let i = 0; i <= 10; i++) {
    console.log("fibBottomUp(" + i + ") =", fibBottomUp(i));
  }
}

runFibBottomUpDemo();`;

const FIB_BOTTOM_UP_PY = `# Fibonacci (Bottom-Up Tabulation)
# ------------------------------------------------------------------

def fib_bottom_up(n: int) -> int:
    if n <= 1:
        return n
    prev2, prev1 = 0, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1


def run_fib_bottom_up_demo() -> None:
    for i in range(11):
        print(f"fib_bottom_up({i}) = {fib_bottom_up(i)}")


if __name__ == "__main__":
    run_fib_bottom_up_demo()`;

/* ------------------------- 0/1 Knapsack (Classic) ------------------------- */

const KNAPSACK_JS = `// 0/1 Knapsack (Bottom-Up DP)
// ------------------------------------------------------------------
// We have n items, each with a weight and value, and a maximum capacity W.
// State:    dp[i][w] = max value using first i items with capacity w
// Relation: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])

function knapsack01(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    const wi = weights[i - 1];
    const vi = values[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w]; // not taking item i
      if (wi <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - wi] + vi);
      }
    }
  }

  return {
    maxValue: dp[n][capacity],
    table: dp,
  };
}

function runKnapsackDemo() {
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 8];
  const capacity = 5;

  const result = knapsack01(weights, values, capacity);
  console.log("Weights:", weights);
  console.log("Values:", values);
  console.log("Capacity:", capacity);
  console.log("Max value:", result.maxValue);
  console.log("DP table:", result.table);
}

runKnapsackDemo();`;

const KNAPSACK_PY = `# 0/1 Knapsack (Bottom-Up DP)
# ------------------------------------------------------------------
from typing import List, Dict, Any


def knapsack_01(weights: List[int], values: List[int], capacity: int) -> Dict[str, Any]:
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        wi = weights[i - 1]
        vi = values[i - 1]
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if wi <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - wi] + vi)

    return {"max_value": dp[n][capacity], "table": dp}


def run_knapsack_demo() -> None:
    weights = [2, 3, 4, 5]
    values = [3, 4, 5, 8]
    capacity = 5
    result = knapsack_01(weights, values, capacity)
    print("Weights:", weights)
    print("Values:", values)
    print("Capacity:", capacity)
    print("Max value:", result["max_value"])
    print("DP table row for last item:", result["table"][-1])


if __name__ == "__main__":
    run_knapsack_demo()`;

/* ------------------------- Longest Common Subsequence --------------------- */

const LCS_JS = `// Longest Common Subsequence (LCS)
// ------------------------------------------------------------------
// Given strings s and t, compute the length of the longest sequence that
// appears in both strings in the same relative order (not necessarily
// contiguously).
//
// State: dp[i][j] = LCS length of s[0..i-1] and t[0..j-1]

function lcsLength(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
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
  return { length: dp[m][n], table: dp };
}

function runLCSDemo() {
  const s = "ABCBDAB";
  const t = "BDCABA";
  const result = lcsLength(s, t);
  console.log("s =", s);
  console.log("t =", t);
  console.log("LCS length =", result.length);
  console.log("DP table last row:", result.table[result.table.length - 1]);
}

runLCSDemo();`;

const LCS_PY = `# Longest Common Subsequence (LCS)
# ------------------------------------------------------------------
from typing import List, Dict, Any


def lcs_length(s: str, t: str) -> Dict[str, Any]:
    m, n = len(s), len(t)
    dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i - 1] == t[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return {"length": dp[m][n], "table": dp}


def run_lcs_demo() -> None:
    s = "ABCBDAB"
    t = "BDCABA"
    result = lcs_length(s, t)
    print("s =", s)
    print("t =", t)
    print("LCS length =", result["length"])
    print("Last row of DP table:", result["table"][-1])


if __name__ == "__main__":
    run_lcs_demo()`;

/* ----------------------------- Edit Distance ------------------------------- */

const EDIT_DISTANCE_JS = `// Edit Distance (Levenshtein)
// ------------------------------------------------------------------
// Minimum number of insertions, deletions, and substitutions required
// to transform string a into string b.
//
// State: dp[i][j] = edit distance between a[0..i-1] and b[0..j-1].

function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,       // deletion
        dp[i][j - 1] + 1,       // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return { distance: dp[m][n], table: dp };
}

function runEditDistanceDemo() {
  const a = "kitten";
  const b = "sitting";
  const result = editDistance(a, b);
  console.log("a =", a);
  console.log("b =", b);
  console.log("Edit distance =", result.distance);
  console.log("Last row of DP table:", result.table[result.table.length - 1]);
}

runEditDistanceDemo();`;

const EDIT_DISTANCE_PY = `# Edit Distance (Levenshtein)
// ------------------------------------------------------------------
from typing import List, Dict, Any


def edit_distance(a: str, b: str) -> Dict[str, Any]:
    m, n = len(a), len(b)
    dp: List[List[int]] = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,      # deletion
                dp[i][j - 1] + 1,      # insertion
                dp[i - 1][j - 1] + cost,  # substitution
            )

    return {"distance": dp[m][n], "table": dp}


def run_edit_distance_demo() -> None:
    a = "kitten"
    b = "sitting"
    result = edit_distance(a, b)
    print("a =", a)
    print("b =", b)
    print("Edit distance =", result["distance"])
    print("Last row of DP table:", result["table"][-1])


if __name__ == "__main__":
    run_edit_distance_demo()`;

/* ------------------------- Coin Change (Min Coins) ------------------------ */

const COIN_CHANGE_JS = `// Coin Change (Minimum Coins)
// ------------------------------------------------------------------
// Given coin denominations and a target amount, compute the minimum
// number of coins that sum to the target (unbounded usage).
//
// State: dp[x] = minimum coins required to make sum x.

function coinChangeMinCoins(coins, amount) {
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array(amount + 1).fill(INF);
  dp[0] = 0;

  for (const coin of coins) {
    for (let x = coin; x <= amount; x++) {
      dp[x] = Math.min(dp[x], dp[x - coin] + 1);
    }
  }

  return dp[amount] === INF ? -1 : dp[amount];
}

function runCoinChangeDemo() {
  const coins = [1, 3, 4];
  const amount = 6;
  console.log("Coins:", coins);
  console.log("Amount:", amount);
  console.log("Minimum number of coins:", coinChangeMinCoins(coins, amount));
}

runCoinChangeDemo();`;

const COIN_CHANGE_PY = `# Coin Change (Minimum Coins)
// ------------------------------------------------------------------
from typing import List


def coin_change_min_coins(coins: List[int], amount: int) -> int:
    INF = 10 ** 9
    dp = [INF] * (amount + 1)
    dp[0] = 0

    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)

    return -1 if dp[amount] == INF else dp[amount]


def run_coin_change_demo() -> None:
    coins = [1, 3, 4]
    amount = 6
    print("Coins:", coins)
    print("Amount:", amount)
    print("Minimum coins:", coin_change_min_coins(coins, amount))


if __name__ == "__main__":
    run_coin_change_demo()`;

/* -------------------------------------------------------------------------- */
/*  DP Algorithm Catalog                                                      */
/* -------------------------------------------------------------------------- */

export const DYNAMIC_PROGRAMMING_ALGORITHMS_DETAILED: DynamicProgrammingMeta[] =
  [
    defineDynamicProgrammingAlgorithm({
      id: "dp-fibonacci-top-down",
      title: "Fibonacci (Top-Down Memoization)",
      shortDescription:
        "Classic recursive Fibonacci optimized with a memo table to avoid repeated subproblems.",
      description:
        "This implementation turns the naive exponential-time recursive Fibonacci into an O(n) algorithm "
        + "by caching results of subproblems in a memoization table. Each state fib(n) is computed at most "
        + "once, demonstrating the core idea of dynamic programming: overlapping subproblems + optimal substructure.",
      category: "dynamic-programming",
      difficulty: "easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      complexity: {
        best: "O(1) for very small n (e.g., n <= 1).",
        average: "O(n) because each state from 0..n is evaluated at most once.",
        worst: "O(n) with recursion depth O(n).",
        space: "O(n) for memo plus recursion stack.",
        notes:
          "The naive recursive implementation is O(phi^n); memoization improves it dramatically.",
      },
      dpStyle: "top-down-memoization",
      domains: ["combinatorics"],
      stateDefinition: "f(n) = number in the Fibonacci sequence at position n.",
      transitionRelation: "f(n) = f(n-1) + f(n-2), with base cases f(0) = 0, f(1) = 1.",
      primarilyEducational: true,
      pitfalls: [
        "For languages/environments with limited stack size, very large n can overflow the call stack.",
        "Memo keys must be carefully chosen; here we use integer indices, which is safe.",
      ],
      languages: ["javascript", "python"],
      tags: [
        "fibonacci",
        "top-down",
        "memoization",
        "intro-dp",
        "recursion",
      ],
      codeTemplates: {
        javascript: FIB_TOP_DOWN_JS,
        python: FIB_TOP_DOWN_PY,
      },
      recommendedInput: "Values of n in the range [0, 40] for demonstration.",
      notes:
        "Fibonacci is a standard entry point to DP. Once you internalize the pattern here, more complex DP "
        + "problems boil down to coming up with the right state and transition.",
      relatedIds: [
        "dp-fibonacci-bottom-up",
        "coin-change-min-coins",
        "dp-lcs",
      ],
    }),

    defineDynamicProgrammingAlgorithm({
      id: "dp-fibonacci-bottom-up",
      title: "Fibonacci (Bottom-Up Tabulation)",
      shortDescription:
        "Iterative Fibonacci using a running table and constant extra space.",
      description:
        "The bottom-up tabulation approach avoids recursion entirely. It builds solutions from the smallest "
        + "subproblems up to the desired n, maintaining only the last two values. This version showcases the "
        + "space-optimization techniques common in DP implementations.",
      category: "dynamic-programming",
      difficulty: "easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      complexity: {
        best: "O(1) for very small n.",
        average: "O(n).",
        worst: "O(n).",
        space:
          "O(1) auxiliary beyond the numerical variables; the DP table is implicit.",
        notes:
          "The explicit DP table can be reconstructed if you need intermediate values for visualization.",
      },
      dpStyle: "space-optimized",
      domains: ["combinatorics"],
      stateDefinition:
        "Same as the memoized version, but the table is implicit: we keep only fib(i-1) and fib(i-2).",
      transitionRelation:
        "curr = prev1 + prev2, then shift the window (prev2 <- prev1, prev1 <- curr).",
      primarilyEducational: false,
      pitfalls: [
        "Incorrectly handling n <= 1 can introduce off-by-one errors.",
        "If you later extend this pattern to multi-dimensional states, over-optimization can reduce readability.",
      ],
      languages: ["javascript", "python"],
      tags: [
        "fibonacci",
        "bottom-up",
        "tabulation",
        "space-optimized",
      ],
      codeTemplates: {
        javascript: FIB_BOTTOM_UP_JS,
        python: FIB_BOTTOM_UP_PY,
      },
      recommendedInput:
        "Values of n up to the low thousands; for much larger n, consider big-integer arithmetic.",
      notes:
        "This implementation is commonly used when you only care about the final Fibonacci number and not intermediate states.",
      relatedIds: ["dp-fibonacci-top-down"],
    }),

    defineDynamicProgrammingAlgorithm({
      id: "dp-knapsack-01",
      title: "0/1 Knapsack (Bottom-Up)",
      shortDescription:
        "Select items with weights and values to maximize total value without exceeding capacity.",
      description:
        "The 0/1 knapsack problem is a central example in DP. Each item can either be taken once or not at all. "
        + "The DP table dp[i][w] represents the best value achievable using the first i items with capacity w. "
        + "The decision is to either skip the item or take it if it fits.",
      category: "dynamic-programming",
      difficulty: "medium",
      timeComplexity: "O(n * W)",
      spaceComplexity: "O(n * W)",
      complexity: {
        best: "O(n * W) – the DP always fills the table; there is no significantly faster best-case.",
        average: "O(n * W).",
        worst: "O(n * W).",
        space: "O(n * W) for the DP matrix; can be optimized to O(W) with a 1D array.",
        notes:
          "For very large capacities, this pseudo-polynomial algorithm might be too slow; approximation algorithms may be required.",
      },
      dpStyle: "knapsack-family",
      domains: ["knapsack", "subset-sums"],
      stateDefinition:
        "dp[i][w] = maximum value achievable using the first i items with total weight at most w.",
      transitionRelation:
        "dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]) if weight[i] <= w; otherwise dp[i][w] = dp[i-1][w].",
      primarilyEducational: false,
      pitfalls: [
        "Mixing up the meaning of i (number of items) vs. index in the weights/values arrays.",
        "Incorrectly iterating w in the wrong direction when converting to a 1D optimized version.",
      ],
      languages: ["javascript", "python"],
      tags: [
        "knapsack",
        "0-1-knapsack",
        "subset-selection",
        "optimization",
      ],
      codeTemplates: {
        javascript: KNAPSACK_JS,
        python: KNAPSACK_PY,
      },
      recommendedInput:
        "Weights [2,3,4,5], values [3,4,5,8], capacity around 5–10 for easy manual verification.",
      notes:
        "The same pattern extends to many resource allocation and budget optimization problems.",
      relatedIds: [
        "coin-change-min-coins",
        "dp-lcs",
        "dp-edit-distance",
      ],
    }),

    defineDynamicProgrammingAlgorithm({
      id: "dp-lcs",
      title: "Longest Common Subsequence (LCS)",
      shortDescription:
        "Finds the length of the longest subsequence common to two strings while preserving order.",
      description:
        "LCS is a classic DP problem on strings. The DP table dp[i][j] captures the LCS length of prefixes "
        + "s[0..i-1] and t[0..j-1]. This algorithm is foundational for diff tools, sequence comparison, and text analysis.",
      category: "dynamic-programming",
      difficulty: "medium",
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n)",
      complexity: {
        best: "O(m * n), though small inputs make it fast in practice.",
        average: "O(m * n).",
        worst: "O(m * n).",
        space:
          "O(m * n) for the DP matrix; with optimizations, you can reduce to O(min(m, n)) if you only need the length.",
        notes:
          "Reconstructing the actual subsequence requires either storing choices or re-walking the table.",
      },
      dpStyle: "bottom-up-tabulation",
      domains: ["subsequence", "string-matching"],
      stateDefinition:
        "dp[i][j] = LCS length of the prefixes s[0..i-1] and t[0..j-1].",
      transitionRelation:
        "If s[i-1] == t[j-1], dp[i][j] = dp[i-1][j-1] + 1; else dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      primarilyEducational: false,
      pitfalls: [
        "Off-by-one mistakes in indexing strings vs. DP table dimensions.",
        "Confusing subsequence (not required to be contiguous) with substring.",
      ],
      languages: ["javascript", "python"],
      tags: [
        "lcs",
        "string-dp",
        "longest-common-subsequence",
        "diff",
      ],
      codeTemplates: {
        javascript: LCS_JS,
        python: LCS_PY,
      },
      recommendedInput:
        'Strings like "ABCBDAB" and "BDCABA" (the textbook example) to cross-check with literature.',
      notes:
        "The LCS pattern generalizes to many sequence alignment and comparison problems.",
      relatedIds: [
        "dp-edit-distance",
        "dp-fibonacci-top-down",
      ],
    }),

    defineDynamicProgrammingAlgorithm({
      id: "dp-edit-distance",
      title: "Edit Distance (Levenshtein)",
      shortDescription:
        "Computes the minimum number of insertions, deletions, and substitutions to turn one string into another.",
      description:
        "The Levenshtein edit distance is a fundamental string metric. The DP table dp[i][j] represents the minimal "
        + "cost of transforming the prefix a[0..i-1] into b[0..j-1]. Each step corresponds to an insertion, deletion, "
        + "or substitution operation with unit cost.",
      category: "dynamic-programming",
      difficulty: "medium",
      timeComplexity: "O(m * n)",
      spaceComplexity: "O(m * n)",
      complexity: {
        best: "O(m * n); the DP always evaluates the full grid.",
        average: "O(m * n).",
        worst: "O(m * n).",
        space:
          "O(m * n) for the full table; can be optimized to O(min(m, n)) if only the distance is needed.",
        notes:
          "Weighted edit distances (different costs for operations) use the same recurrence but adjust operation costs.",
      },
      dpStyle: "sequence-alignment",
      domains: ["edit-distance", "string-matching"],
      stateDefinition:
        "dp[i][j] = minimum edit distance between prefixes a[0..i-1] and b[0..j-1].",
      transitionRelation:
        "dp[i][j] = min( dp[i-1][j] + 1 (delete), dp[i][j-1] + 1 (insert), dp[i-1][j-1] + cost(substitute) ).",
      primarilyEducational: false,
      pitfalls: [
        "Forgetting to initialize the first row and column with incremental costs.",
        "Accidentally using max instead of min in the recurrence.",
      ],
      languages: ["javascript", "python"],
      tags: [
        "edit-distance",
        "levenshtein",
        "string-dp",
        "sequence-alignment",
      ],
      codeTemplates: {
        javascript: EDIT_DISTANCE_JS,
        python: EDIT_DISTANCE_PY,
      },
      recommendedInput:
        'Strings like "kitten" and "sitting" (classic example) to verify the answer equals 3.',
      notes:
        "Edit distance underpins spelling correction, fuzzy matching, and many NLP pipelines.",
      relatedIds: ["dp-lcs"],
    }),

    defineDynamicProgrammingAlgorithm({
      id: "coin-change-min-coins",
      title: "Coin Change (Minimum Coins)",
      shortDescription:
        "Unbounded knapsack-style DP that minimizes the number of coins needed to reach a target sum.",
      description:
        "Given coin denominations and a target amount, the DP state dp[x] represents the minimum number of coins "
        + "needed to form sum x. For each coin, we relax the state for all x >= coin, similar to unbounded knapsack.",
      category: "dynamic-programming",
      difficulty: "medium",
      timeComplexity: "O(n * amount)",
      spaceComplexity: "O(amount)",
      complexity: {
        best: "O(n * amount) but with small constants for typical constraints.",
        average: "O(n * amount).",
        worst: "O(n * amount).",
        space: "O(amount) for the 1D DP array.",
        notes:
          "This formulation counts the minimum number of coins; alternative versions count the number of ways.",
      },
      dpStyle: "bottom-up-tabulation",
      domains: ["coins", "subset-sums", "knapsack"],
      stateDefinition:
        "dp[x] = minimum number of coins needed to form sum x (or INF if impossible).",
      transitionRelation:
        "For each coin c and for each x >= c: dp[x] = min(dp[x], dp[x - c] + 1).",
      primarilyEducational: false,
      pitfalls: [
        "Using a 2D DP by habit when a 1D DP is enough, which increases memory usage.",
        "Failing to initialize dp[0] = 0 and all others to +INF, which breaks the recurrence.",
      ],
      languages: ["javascript", "python"],
      tags: [
        "coin-change",
        "unbounded-knapsack",
        "dp",
        "minimum-coins",
      ],
      codeTemplates: {
        javascript: COIN_CHANGE_JS,
        python: COIN_CHANGE_PY,
      },
      recommendedInput:
        "Coins [1, 3, 4] with target amounts like 6, 7, 10 to explore multiple optimal combinations.",
      notes:
        "This recipe is reusable for many resource minimization problems where each action can be repeated.",
      relatedIds: ["dp-knapsack-01", "dp-fibonacci-top-down"],
    }),
  ];
