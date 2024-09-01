// src/lib/snippets/interviewProblems.ts

/**
 * Mixed interview-style problems across arrays, strings, trees,
 * graphs and dynamic programming.
 *
 * These snippets are designed to be:
 *  - Displayed in a "Interview Problems" section of the snippet library
 *  - Copied into the playground editor as starting templates
 *  - Highly commented so candidates (and buyers) can learn from them
 */

export type InterviewProblemLanguage = "javascript" | "typescript";

export type InterviewProblemCategory =
  | "array"
  | "string"
  | "hashing"
  | "two-pointers"
  | "sliding-window"
  | "tree"
  | "graph"
  | "dynamic-programming"
  | "backtracking"
  | "misc";

export type InterviewProblemDifficulty =
  | "easy"
  | "medium"
  | "hard";

export interface InterviewProblemSnippet {
  id: string;
  title: string;
  summary: string;
  category: InterviewProblemCategory;
  difficulty: InterviewProblemDifficulty;
  language: InterviewProblemLanguage;
  tags: string[];
  code: string;
  explanation: string;
  followUpIdeas?: string;
}

export const interviewCategoryLabels: Record<
  InterviewProblemCategory,
  string
> = {
  array: "Arrays & Numbers",
  string: "Strings & Parsing",
  hashing: "Hashing & Maps",
  "two-pointers": "Two Pointers",
  "sliding-window": "Sliding Window",
  tree: "Trees",
  graph: "Graphs",
  "dynamic-programming": "Dynamic Programming",
  backtracking: "Backtracking & Search",
  misc: "Miscellaneous",
};

export const interviewDifficultyLabels: Record<
  InterviewProblemDifficulty,
  string
> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/**
 * The main collection of interview problems.
 * Each snippet intentionally includes an entire solution with comments.
 */
export const interviewProblemSnippets: InterviewProblemSnippet[] = [
  {
    id: "two-sum-hash-map",
    title: "Two Sum Using Hash Map",
    summary:
      "Classic array + hash map problem: find two indices whose values add up to a target.",
    category: "array",
    difficulty: "easy",
    language: "typescript",
    tags: ["two-sum", "hash map", "array", "O(n)"],
    code: `// Two Sum (LeetCode style)
//
// Given an array of integers nums and an integer target, return indices of the
// two numbers such that they add up to target. Assume exactly one solution.
//
// This version returns the first pair of indices it finds. If there is no
// solution, it returns [-1, -1]. For production code we would likely throw or
// return null, but this keeps the function easy to experiment with.

export function twoSum(nums: number[], target: number): [number, number] {
  // key   -> value we saw
  // value -> index in the array
  const seen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const value = nums[i];
    const needed = target - value;

    // Check if we have already seen the complement.
    if (seen.has(needed)) {
      const j = seen.get(needed)!;
      return [j, i];
    }

    // Otherwise remember value -> index for future elements.
    seen.set(value, i);
  }

  // Fallback for "no solution" cases.
  return [-1, -1];
}

// Example:
// console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
    explanation:
      "This is the canonical linear-time solution for Two Sum. The hash-map allows constant-time lookups of complements, turning a naive O(n²) double loop into O(n). This snippet makes a perfect warm-up question or a starting point for teaching hash maps.",
    followUpIdeas:
      "Ask candidates to return all unique pairs; or to solve the variant where the array is already sorted and must use the two-pointer pattern instead of a map.",
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    summary:
      "Sliding-window string problem that tracks the longest substring with all unique characters.",
    category: "sliding-window",
    difficulty: "medium",
    language: "typescript",
    tags: ["sliding window", "string", "hash map", "indices"],
    code: `// Longest Substring Without Repeating Characters
//
// Given a string s, find the length of the longest substring
// without repeating characters.
//
// We use the classic sliding-window approach with a hash map
// storing the last index at which each character appeared.

export function lengthOfLongestSubstring(s: string): number {
  const lastSeen = new Map<string, number>();

  let left = 0;     // Start index of current window (inclusive)
  let best = 0;     // Best window length so far

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];

    if (lastSeen.has(ch)) {
      // Move left pointer to one past the previous index of ch
      // but never move it backwards.
      const prevIndex = lastSeen.get(ch)!;
      if (prevIndex >= left) {
        left = prevIndex + 1;
      }
    }

    // Update last seen index for current character.
    lastSeen.set(ch, right);

    // Window is [left, right].
    const windowLen = right - left + 1;
    if (windowLen > best) {
      best = windowLen;
    }
  }

  return best;
}

// Example:
// console.log(lengthOfLongestSubstring("abcabcbb")); // 3 (\"abc\")
// console.log(lengthOfLongestSubstring("bbbbb"));    // 1 (\"b\")`,
    explanation:
      "The sliding-window idea is to keep a window with no duplicates and expand it greedily while shrinking from the left only when we violate the constraint. The map tracks the last seen index of each character so we can jump `left` directly past duplicates rather than moving one step at a time.",
    followUpIdeas:
      "Extend the function to return the substring itself instead of just the length; or modify it to work with arbitrary Unicode code points rather than simple ASCII characters.",
  },
  {
    id: "three-sum-sorted-two-pointers",
    title: "Three Sum with Sorting + Two Pointers",
    summary:
      "Find all unique triplets in the array which give the sum of zero using sorting and two pointers.",
    category: "two-pointers",
    difficulty: "medium",
    language: "typescript",
    tags: ["three-sum", "sorting", "two pointers", "deduplication"],
    code: `// Three Sum (sum = 0)
//
// Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]]
// such that i != j, i != k, j != k, and nums[i] + nums[j] + nums[k] == 0.
// Notice that the solution set must not contain duplicate triplets.
//
// Algorithm:
//   1. Sort the array to handle duplicates and to use two pointers.
//   2. Fix one number (i), then use two-pointer search on the remainder (lo, hi).
//   3. Skip duplicate values for i, lo, and hi.

export function threeSum(nums: number[]): number[][] {
  const result: number[][] = [];

  // Step 1: sort array in ascending order.
  nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    // Skip duplicates of the first element.
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let lo = i + 1;
    let hi = nums.length - 1;

    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];

      if (sum === 0) {
        result.push([nums[i], nums[lo], nums[hi]]);

        // Skip duplicate lo values.
        const loValue = nums[lo];
        while (lo < hi && nums[lo] === loValue) lo++;

        // Skip duplicate hi values.
        const hiValue = nums[hi];
        while (lo < hi && nums[hi] === hiValue) hi--;
      } else if (sum < 0) {
        lo++;
      } else {
        hi--;
      }
    }
  }

  return result;
}

// Example:
// console.log(threeSum([-1, 0, 1, 2, -1, -4]));
// => [[-1, -1, 2], [-1, 0, 1]] (order may vary)`,
    explanation:
      "Sorting plus the two-pointer technique is a powerful combination for sum problems. The sorted property lets us increment or decrement pointers based on the current sum, while deduplication logic ensures that each distinct triplet appears at most once in the output.",
    followUpIdeas:
      "Ask candidates to adapt this for k-sum with k > 3; or require the triplets to sum to an arbitrary target rather than zero.",
  },
  {
    id: "group-anagrams-hash-map",
    title: "Group Anagrams by Sorted Signature",
    summary:
      "Group words that are anagrams using a hash map keyed by sorted characters.",
    category: "hashing",
    difficulty: "medium",
    language: "typescript",
    tags: ["anagrams", "hash map", "grouping", "strings"],
    code: `// Group Anagrams
//
// Given an array of strings, group the anagrams together.
//   Input: ["eat", "tea", "tan", "ate", "nat", "bat"]
//   Output: [["eat","tea","ate"],["tan","nat"],["bat"]]
//
// Strategy: for each word, sort its characters alphabetically to form
// a "signature". All anagrams share the same signature.

export function groupAnagrams(words: string[]): string[][] {
  const groups = new Map<string, string[]>();

  for (const word of words) {
    const signature = word.split("").sort().join("");

    if (!groups.has(signature)) {
      groups.set(signature, []);
    }

    groups.get(signature)!.push(word);
  }

  return Array.from(groups.values());
}

// Example:
// console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));`,
    explanation:
      "Sorting each word gives a canonical representation that is identical for all anagrams. The map groups words by this representation. For interviews, it’s often useful to discuss the trade-off between sorting each word (O(m log m) per word) vs using a frequency-count signature.",
    followUpIdeas:
      "Switch to a 26-length frequency vector for lowercase letters and use it as the map key (stringified) to achieve O(m) per word; or support Unicode anagrams.",
  },
  {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements (Bucket Sort Variant)",
    summary:
      "Return the k most frequent elements using a frequency map and bucket sort.",
    category: "hashing",
    difficulty: "medium",
    language: "typescript",
    tags: ["top-k", "bucket sort", "frequency", "map"],
    code: `// Top K Frequent Elements
//
// Given an integer array nums and an integer k, return the k most frequent
// elements. Complexity target is better than O(n log n), so we avoid fully
// sorting the array by using bucket sort on frequencies instead.

export function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();

  for (const value of nums) {
    freq.set(value, (freq.get(value) ?? 0) + 1);
  }

  // Buckets where index = frequency, value = list of numbers.
  const buckets: number[][] = [];
  let maxFreq = 0;

  for (const [value, count] of freq.entries()) {
    if (!buckets[count]) {
      buckets[count] = [];
    }
    buckets[count].push(value);
    if (count > maxFreq) maxFreq = count;
  }

  const result: number[] = [];

  // Traverse buckets from highest frequency down.
  for (let f = maxFreq; f >= 1 && result.length < k; f--) {
    const bucket = buckets[f];
    if (!bucket) continue;

    for (const value of bucket) {
      result.push(value);
      if (result.length === k) break;
    }
  }

  return result;
}

// Example:
// console.log(topKFrequent([1,1,1,2,2,3], 2)); // [1,2] (order may vary)`,
    explanation:
      "Bucket sort is a neat trick whenever the range of frequencies is small (at most n here). Instead of sorting by frequency, we place elements into buckets keyed by their count, then scan buckets from high to low to collect the top k elements in linear time.",
    followUpIdeas:
      "Replace bucket sort with a min-heap of size k and compare complexities; or adapt the solution to streams of data where counts are changing over time.",
  },
  {
    id: "binary-tree-level-order-iterative",
    title: "Binary Tree Level-Order Traversal Template",
    summary:
      "Generic level-order traversal template that can be adapted for many tree problems.",
    category: "tree",
    difficulty: "easy",
    language: "typescript",
    tags: ["tree", "bfs", "level order", "template"],
    code: `// Level-order traversal template often used in interview problems.
// Instead of hard-coding what we do at each node, we simply collect
// values by level, then highlight the key extension points in comments.

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function levelOrderTemplate(root: TreeNode | null): number[][] {
  const levels: number[][] = [];

  if (!root) return levels;

  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const levelValues: number[] = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      levelValues.push(node.val);

      // Extension point: we could count nodes, track depth,
      // compute averages, etc. For now, we simply enqueue children.
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    levels.push(levelValues);
  }

  return levels;
}`,
    explanation:
      "Many tree problems are small variations on level-order traversal: computing averages per level, finding the leftmost or rightmost value, detecting completeness, etc. This snippet encodes the reusable BFS skeleton so you can adapt it quickly during interviews.",
    followUpIdeas:
      "Ask candidates to modify the template to return the largest value on each level, or the sum / average; or to detect the first null child and decide whether the tree is complete.",
  },
  {
    id: "num-islands-dfs",
    title: "Number of Islands (DFS on Grid)",
    summary:
      "Count connected components of '1's in a 2D grid using DFS or BFS.",
    category: "graph",
    difficulty: "medium",
    language: "typescript",
    tags: ["grid", "dfs", "bfs", "islands", "graph"],
    code: `// Number of Islands
//
// Given an m x n 2D binary grid grid which represents a map of '1's (land)
// and '0's (water), return the number of islands. An island is surrounded by
// water and is formed by connecting adjacent lands horizontally or vertically.
// Assume the grid is mutable; we will mark visited cells in-place.

const DIRS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function numIslands(grid: string[][]): number {
  if (grid.length === 0 || grid[0].length === 0) return 0;

  const rows = grid.length;
  const cols = grid[0].length;

  function dfs(r: number, c: number): void {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (grid[r][c] !== "1") return;

    // Mark as visited by turning land into water.
    grid[r][c] = "0";

    for (const [dr, dc] of DIRS) {
      dfs(r + dr, c + dc);
    }
  }

  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(r, c);
      }
    }
  }

  return count;
}

// Example usage:
// const grid = [
//   ["1","1","0","0","0"],
//   ["1","1","0","0","0"],
//   ["0","0","1","0","0"],
//   ["0","0","0","1","1"],
// ];
// console.log(numIslands(grid)); // 3`,
    explanation:
      "This is the archetypal flood-fill / connected-components question. DFS marks all cells in the current island before returning to the outer loop. The pattern generalises easily to 8-direction movement, different terrain types, or BFS with a queue.",
    followUpIdeas:
      "Switch to an iterative BFS implementation; or modify the function to compute the size of the largest island instead of just counting them.",
  },
  {
    id: "climbing-stairs-dp",
    title: "Climbing Stairs (1D DP / Fibonacci Variant)",
    summary:
      "Count the number of ways to climb n steps when you can jump 1 or 2 steps at a time.",
    category: "dynamic-programming",
    difficulty: "easy",
    language: "typescript",
    tags: ["dp", "fibonacci", "1D dp", "bottom-up"],
    code: `// Climbing Stairs
//
// You are climbing a staircase. It takes n steps to reach the top.
// Each time you can climb either 1 or 2 steps.
// In how many distinct ways can you climb to the top?
//
// The recurrence is identical to Fibonacci:
//   ways[n] = ways[n-1] + ways[n-2]
//
// We implement the space-optimised bottom-up version.

export function climbStairs(n: number): number {
  if (n <= 1) return 1;

  let prev2 = 1; // ways(0)
  let prev1 = 1; // ways(1)

  for (let step = 2; step <= n; step++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example:
// console.log(climbStairs(2)); // 2
// console.log(climbStairs(3)); // 3`,
    explanation:
      "This is a gentle introduction to dynamic programming. It demonstrates how a simple recurrence can be turned into an iterative solution with constant space, providing a nice bridge between recursion and DP thinking.",
    followUpIdeas:
      "Allow variable step sizes (e.g. 1, 3, 5) and generalise the recurrence; or track the actual paths, not just the count.",
  },
  {
    id: "house-robber-dp",
    title: "House Robber (1D DP with Choice at Each Index)",
    summary:
      "Maximise money robbed from non-adjacent houses using a simple DP recurrence.",
    category: "dynamic-programming",
    difficulty: "medium",
    language: "typescript",
    tags: ["dp", "1D", "optimisation", "non-adjacent"],
    code: `// House Robber
//
// You are a professional robber planning to rob houses along a street.
// Each house has a certain amount of money. Adjacent houses have security
// systems: robbing both triggers an alarm. Determine the maximum amount that
// can be robbed without alerting the police.
//
// Recurrence:
//   dp[i] = max(dp[i-1], nums[i] + dp[i-2])
//
// meaning: at house i, either skip it (dp[i-1]) or rob it plus best up to i-2.

export function rob(nums: number[]): number {
  const n = nums.length;
  if (n === 0) return 0;
  if (n === 1) return nums[0];

  let prev2 = nums[0];                    // dp[0]
  let prev1 = Math.max(nums[0], nums[1]); // dp[1]

  for (let i = 2; i < n; i++) {
    const robCurrent = nums[i] + prev2;
    const skipCurrent = prev1;
    const current = robCurrent > skipCurrent ? robCurrent : skipCurrent;

    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// Example:
// console.log(rob([1,2,3,1]));    // 4
// console.log(rob([2,7,9,3,1]));  // 12`,
    explanation:
      "This problem illustrates the 'include or exclude' DP pattern where each state represents the best value up to index i. The space-optimized version keeps only the last two states, reflecting how local the recurrence is.",
    followUpIdeas:
      "Extend to 'House Robber II' where houses are arranged in a circle, or to a 2D grid where adjacency rules become more complex.",
  },
  {
    id: "subsets-backtracking",
    title: "Generate All Subsets (Power Set) via Backtracking",
    summary:
      "Backtracking template that generates the power set of a given array.",
    category: "backtracking",
    difficulty: "medium",
    language: "typescript",
    tags: ["backtracking", "subsets", "power set", "recursion"],
    code: `// Generate all subsets (the power set) of a given array of numbers.
//
// Backtracking pattern:
//   - Maintain a 'path' representing the subset built so far.
//   - At each index, choose to include the current element or skip it.
//   - Push a snapshot of the path to the result at every recursion level.

export function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  function backtrack(index: number): void {
    // Every position represents a valid subset (path).
    result.push([...path]);

    for (let i = index; i < nums.length; i++) {
      // Choose nums[i].
      path.push(nums[i]);

      // Explore further with this choice fixed.
      backtrack(i + 1);

      // Undo the choice (backtrack).
      path.pop();
    }
  }

  backtrack(0);
  return result;
}

// Example:
// console.log(subsets([1,2,3]));`,
    explanation:
      "Backtracking is essentially a DFS over the decision tree of choices. The subsets problem is a minimal example where the pattern is easy to see: choose or skip each element. The template can later be adapted to permutations, combinations, and other search problems.",
    followUpIdeas:
      "Add constraints (e.g. subsets of size k, or subsets whose sum equals a target) to show how pruning can dramatically reduce the search space.",
  },
];

/**
 * Map id -> snippet for quick lookup.
 */
export const interviewProblemSnippetsById: Record<
  string,
  InterviewProblemSnippet
> = (() => {
  const map: Record<string, InterviewProblemSnippet> = {};
  for (const snippet of interviewProblemSnippets) {
    map[snippet.id] = snippet;
  }
  return map;
})();

/**
 * Helper to fetch a snippet by id.
 */
export function getInterviewProblemSnippetById(
  id: string
): InterviewProblemSnippet | undefined {
  return interviewProblemSnippetsById[id];
}
