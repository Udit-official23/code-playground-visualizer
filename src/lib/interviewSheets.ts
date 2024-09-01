// src/lib/interviewSheets.ts
// -----------------------------------------------------------------------------
// Algorithm Interview Question Bank & Study Plans
//
// This module is intentionally rich in content so that the project ships with
// serious "learning value" out of the box. It is not yet wired into the UI,
// but can power future pages like /interview, /study, or contextual tips inside
// the playground and algorithm detail pages.
// -----------------------------------------------------------------------------

export type InterviewTopic =
  | "sorting"
  | "searching"
  | "graph"
  | "dynamic-programming"
  | "string"
  | "tree"
  | "math"
  | "grid"
  | "misc";

export type InterviewDifficulty = "warmup" | "easy" | "medium" | "hard";

export type InterviewPattern =
  | "two-pointers"
  | "sliding-window"
  | "binary-search"
  | "prefix-sums"
  | "greedy"
  | "bfs"
  | "dfs"
  | "topological-sort"
  | "union-find"
  | "backtracking"
  | "bitmask-dp"
  | "knapsack-dp"
  | "intervals"
  | "combinatorics"
  | "recursion";

export type InterviewTag =
  | "implementation"
  | "invariants"
  | "edge-cases"
  | "optimization"
  | "visualization"
  | "time-complexity"
  | "space-complexity"
  | "data-structure-choice"
  | "recursion-to-iteration"
  | "proof-of-correctness";

export type LanguageHint = {
  languageId: "javascript" | "python" | "pseudo";
  starterSnippet?: string;
  notes: string;
};

export type InterviewQuestion = {
  id: string;
  title: string;
  topic: InterviewTopic;
  difficulty: InterviewDifficulty;
  corePatterns: InterviewPattern[];
  tags: InterviewTag[];
  prompt: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  answerOutline: string[];
  commonPitfalls: string[];
  followUps: string[];
  languageHints: LanguageHint[];
};

export type SessionFocus =
  | "fundamentals"
  | "data-structures"
  | "problem-solving"
  | "contest-prep"
  | "interview-dry-run";

export type InterviewSessionPlan = {
  id: string;
  title: string;
  focus: SessionFocus;
  targetDurationMinutes: number;
  recommendedLevel: "beginner" | "intermediate" | "advanced";
  description: string;
  warmupQuestionIds: string[];
  coreQuestionIds: string[];
  stretchQuestionIds: string[];
  debriefChecklist: string[];
};

// Helper to construct questions with full type safety.
function q(q: InterviewQuestion): InterviewQuestion {
  return q;
}

// -----------------------------------------------------------------------------
// QUESTION BANK
// -----------------------------------------------------------------------------

export const interviewQuestions: InterviewQuestion[] = [
  // ---------------------------------------------------------------------------
  // SORTING
  // ---------------------------------------------------------------------------
  q({
    id: "q-sorting-01",
    title: "Stable vs Unstable Sorting in Practice",
    topic: "sorting",
    difficulty: "easy",
    corePatterns: [],
    tags: ["implementation", "time-complexity", "space-complexity"],
    prompt:
      "You are given a list of student records (name, grade, originalIndex). " +
      "You must sort the students by grade in non-decreasing order while preserving the " +
      "relative order of students who have the same grade. Explain what stability means in " +
      "this context, implement a stable sort, and discuss why some naive approaches break stability.",
    examples: [
      {
        input:
          "[(\"Arjun\", 90, 0), (\"Bina\", 95, 1), (\"Chirag\", 90, 2)]",
        output:
          "[(\"Arjun\", 90, 0), (\"Chirag\", 90, 2), (\"Bina\", 95, 1)]",
        explanation:
          "Arjun and Chirag both have grade 90, and Arjun appears before Chirag in the input. " +
          "A stable sort must keep that relative order in the output."
      }
    ],
    constraints: [
      "Number of records n can be up to 10^5.",
      "Grades are integers between 0 and 100.",
      "You may assume enough memory to store an auxiliary array of size n.",
      "Focus on conceptual clarity rather than micro-optimizations."
    ],
    answerOutline: [
      "Define stability in your own words: equal keys preserve relative order.",
      "Explain an example where instability changes the meaning of results (e.g. multi-pass sorting by different keys).",
      "Show how to implement a stable sort using Merge Sort or by tagging with original indices.",
      "Argue about time complexity: O(n log n) for comparison-based sorting.",
      "Discuss memory trade-offs between in-place unstable sorts and stable sorts that use extra storage."
    ],
    commonPitfalls: [
      "Using built-in sort with a comparator that is not guaranteed to be stable.",
      "Assuming that 'same grade' automatically preserves input order without verifying.",
      "Trying to patch instability by post-processing instead of using a stable algorithm.",
      "Ignoring the impact of large n on naive O(n^2) stable algorithms like insertion sort."
    ],
    followUps: [
      "How would you perform a multi-key sort, e.g. by grade then by name?",
      "Can you convert an unstable sort into a stable one by preprocessing the input?",
      "In which real-world systems does stability matter the most (e.g. UI tables, database query results)?"
    ],
    languageHints: [
      {
        languageId: "javascript",
        starterSnippet:
          "type Student = { name: string; grade: number; index: number };\n" +
          "function stableSortByGrade(students: Student[]): Student[] {\n" +
          "  // implement using a merge-based approach\n" +
          "}\n",
        notes:
          "Most modern JS engines implement a stable Array.prototype.sort, but do not rely on it blindly in interviews. " +
          "Demonstrating a merge-based stable sort shows that you understand the underlying concept."
      },
      {
        languageId: "python",
        notes:
          "Python's built-in sort is guaranteed to be stable. Show both: a direct solution using 'key=' " +
          "and a conceptual explanation of how a stable merge sort would work internally."
      }
    ]
  }),

  q({
    id: "q-sorting-02",
    title: "Sort an Array by Parity and Value",
    topic: "sorting",
    difficulty: "easy",
    corePatterns: [],
    tags: ["implementation", "edge-cases"],
    prompt:
      "Reorder an array of integers so that all even numbers appear before all odd numbers. " +
      "Among the even numbers, sort them in ascending order. Among the odd numbers, sort them " +
      "in descending order. You must return a new array without modifying the original.",
    examples: [
      {
        input: "[5, 2, 8, 3, 1, 4]",
        output: "[2, 4, 8, 5, 3, 1]",
        explanation:
          "Evens: [2, 8, 4] → [2, 4, 8]; Odds: [5, 3, 1] → [5, 3, 1] sorted descending."
      },
      {
        input: "[1, 3, 5]",
        output: "[5, 3, 1]"
      }
    ],
    constraints: [
      "1 ≤ n ≤ 2 * 10^5",
      "-10^9 ≤ A[i] ≤ 10^9",
      "O(n log n) total time is acceptable.",
      "Stability is not required as long as the parity and order constraints hold."
    ],
    answerOutline: [
      "Split the input into two lists: evens and odds.",
      "Sort evens ascending, odds descending.",
      "Concatenate evens followed by odds and return the result.",
      "Discuss time complexity: O(n log n) dominated by the sort steps.",
      "Note that you can keep the original array unchanged by working on copies."
    ],
    commonPitfalls: [
      "Attempting to hand-write a custom comparator that mixes multiple conditions and gets sign wrong.",
      "Forgetting to handle negative numbers when checking parity.",
      "Modifying the input array in-place when the problem explicitly says not to.",
      "Not considering corner cases like empty array or all-even/all-odd."
    ],
    followUps: [
      "How would you solve it in-place if mutation were allowed?",
      "Can you do it in O(n) time if the integers are in a small bounded range?",
      "How would you extend this to three categories instead of two?"
    ],
    languageHints: [
      {
        languageId: "javascript",
        starterSnippet:
          "function reorderByParity(arr: number[]): number[] {\n" +
          "  const evens: number[] = [];\n" +
          "  const odds: number[] = [];\n" +
          "  for (const x of arr) {\n" +
          "    (x % 2 === 0 ? evens : odds).push(x);\n" +
          "  }\n" +
          "  // TODO: sort and concatenate\n" +
          "  return [];\n" +
          "}\n",
        notes:
          "Be explicit about not mutating 'arr'. Using spread syntax to create copies is fine in interviews."
      },
      {
        languageId: "python",
        notes:
          "List comprehensions keep the solution concise: evens = [x for x in arr if x % 2 == 0]. " +
          "Be prepared to explain the asymptotic complexity even if the code is short."
      }
    ]
  }),

  q({
    id: "q-sorting-03",
    title: "Merge K Sorted Arrays",
    topic: "sorting",
    difficulty: "medium",
    corePatterns: ["greedy"],
    tags: ["time-complexity", "data-structure-choice"],
    prompt:
      "You are given k sorted arrays of integers. Merge them into a single sorted array. " +
      "Discuss at least two different approaches and analyze their time and space complexity.",
    examples: [
      {
        input: "[[1,4,5], [1,3,4], [2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation:
          "This is a classic multi-way merge problem. Some languages provide helpers, " +
          "but you should be able to implement it manually using a heap."
      }
    ],
    constraints: [
      "Total number of elements across all arrays is N.",
      "Number of arrays k can be large (up to 10^4).",
      "You must handle empty arrays gracefully.",
      "All arrays are sorted in non-decreasing order."
    ],
    answerOutline: [
      "Naive approach: concatenate all arrays and sort → O(N log N) time, O(N) space.",
      "Heap-based approach: push first element of each array into a min-heap with array index and element index.",
      "Pop the smallest element, append to result, push the next element from the same array.",
      "Analyze: O(N log k) time because the heap has at most k elements at any time.",
      "Discuss memory usage: O(k) for the heap plus O(N) for the output."
    ],
    commonPitfalls: [
      "Ignoring the possibility that some arrays are empty.",
      "Using an O(k) scan to find the minimum each time instead of a heap.",
      "Confusing log N and log k when analyzing complexity.",
      "Forgetting to include the array index along with the value in the heap."
    ],
    followUps: [
      "How would your implementation change if the arrays were sorted in descending order?",
      "In languages with generators/iterators, how would you design an API that lazily merges streams?",
      "How would you modify the algorithm if you only needed the smallest M elements overall?"
    ],
    languageHints: [
      {
        languageId: "javascript",
        notes:
          "There is no built-in heap, so you may discuss implementing a simple binary heap class " +
          "or using a third-party library in real-world code. In interviews, focus on the idea, not the boilerplate."
      },
      {
        languageId: "python",
        notes:
          "Python's 'heapq' module is ideal here. Show that you know how to push tuples " +
          "like (value, array_index, element_index) to keep track of origin."
      }
    ]
  }),

  // ---------------------------------------------------------------------------
  // SEARCHING
  // ---------------------------------------------------------------------------
  q({
    id: "q-search-01",
    title: "First and Last Position of Element in Sorted Array",
    topic: "searching",
    difficulty: "medium",
    corePatterns: ["binary-search"],
    tags: ["edge-cases", "time-complexity"],
    prompt:
      "Given a sorted array of integers and a target value, return the first and last index " +
      "of the target in the array. If the target is not found, return [-1, -1]. The solution " +
      "must run in O(log n) time.",
    examples: [
      {
        input: "nums = [5,7,7,8,8,10], target = 8",
        output: "[3, 4]"
      },
      {
        input: "nums = [5,7,7,8,8,10], target = 6",
        output: "[-1, -1]"
      }
    ],
    constraints: [
      "1 ≤ n ≤ 10^5",
      "Array is sorted in non-decreasing order.",
      "You must not linearly scan the array."
    ],
    answerOutline: [
      "Use two modified binary searches: lower_bound and upper_bound.",
      "First search finds the first index where nums[i] >= target.",
      "Second search finds the last index where nums[i] <= target.",
      "Check if the target actually exists at the found indices.",
      "Discuss off-by-one pitfalls when computing mid and updating bounds."
    ],
    commonPitfalls: [
      "Trying to expand from a single found index linearly, violating O(log n) time.",
      "Not handling arrays where all elements are smaller/greater than target.",
      "Infinite loops caused by incorrect mid or bound updates.",
      "Confusing left-closed vs right-open intervals."
    ],
    followUps: [
      "How would you adapt this to work with a predicate instead of equality (e.g. first index where nums[i] >= x)?",
      "Can you generalize this approach to multi-dimensional search problems?",
      "How could you detect overflow when computing mid in languages with fixed-width integers?"
    ],
    languageHints: [
      {
        languageId: "javascript",
        notes:
          "Even though JavaScript numbers are doubles, mention the classic overflow-safe pattern: " +
          "mid = left + Math.floor((right - left) / 2)."
      },
      {
        languageId: "python",
        notes:
          "You can mention the 'bisect' module but still show that you understand how the underlying " +
          "binary search works by writing it manually."
      }
    ]
  }),

  q({
    id: "q-search-02",
    title: "Search in Rotated Sorted Array",
    topic: "searching",
    difficulty: "medium",
    corePatterns: ["binary-search"],
    tags: ["invariants", "time-complexity"],
    prompt:
      "You are given a sorted array that has been rotated at some pivot unknown to you " +
      "beforehand (e.g. [0,1,2,4,5,6,7] → [4,5,6,7,0,1,2]). Search for a target value in the array " +
      "in O(log n) time.",
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4"
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1"
      }
    ],
    constraints: [
      "No duplicate elements.",
      "Array length up to 10^5.",
      "O(log n) time, O(1) extra space."
    ],
    answerOutline: [
      "Modify binary search by determining which side of mid is sorted.",
      "If left half is sorted, check if target lies in [left, mid); otherwise search right half.",
      "If right half is sorted, check if target lies in (mid, right]; otherwise search left half.",
      "Maintain loop invariants to avoid infinite loops.",
      "Explain why each step discards half of the array."
    ],
    commonPitfalls: [
      "Trying to 'rotate back' the array using O(n) operations.",
      "Mis-handling boundaries when checking which half is sorted.",
      "Forgetting that the array halves cannot both be unsorted.",
      "Not considering corner cases like arrays of length 1 or 2."
    ],
    followUps: [
      "How would you handle duplicates where determining the sorted side is ambiguous?",
      "Can you first find the pivot index and then run normal binary search in the correct segment?",
      "What happens if the array is rotated by its length (i.e. not rotated at all)?"
    ],
    languageHints: [
      {
        languageId: "pseudo",
        notes:
          "This is a logic-heavy question; using language-agnostic pseudocode helps the interviewer " +
          "focus on your reasoning about invariants and cases."
      }
    ]
  }),

  // ---------------------------------------------------------------------------
  // STRING
  // ---------------------------------------------------------------------------
  q({
    id: "q-string-01",
    title: "Longest Substring Without Repeating Characters",
    topic: "string",
    difficulty: "medium",
    corePatterns: ["sliding-window"],
    tags: ["time-complexity", "edge-cases"],
    prompt:
      "Given a string, find the length of the longest substring without repeating characters. " +
      "Explain both the brute-force solution and the optimized sliding-window approach.",
    examples: [
      {
        input: "\"abcabcbb\"",
        output: "3 (\"abc\")"
      },
      {
        input: "\"bbbbb\"",
        output: "1 (\"b\")"
      }
    ],
    constraints: [
      "String length up to 10^5.",
      "Characters are standard ASCII.",
      "O(n) solution is expected for full credit."
    ],
    answerOutline: [
      "Describe the brute-force O(n^3) or O(n^2) approach and why it is too slow.",
      "Introduce the sliding-window idea with two pointers (left/right).",
      "Maintain a map from character to last seen index.",
      "Move the left pointer to max(left, lastSeen[ch] + 1) when a repeat is found.",
      "Track and update the maximum window length throughout the scan."
    ],
    commonPitfalls: [
      "Moving the left pointer backwards, breaking the window invariant.",
      "Forgetting to update last-seen positions when characters reappear.",
      "Not handling empty string input.",
      "Off-by-one errors when computing current window length."
    ],
    followUps: [
      "How would you adapt the solution to support Unicode characters?",
      "Can you modify the problem to return the substring itself, not just the length?",
      "What if we care about at most K distinct characters instead of all distinct characters?"
    ],
    languageHints: [
      {
        languageId: "javascript",
        notes:
          "Using a Map from character → index keeps operations O(1) on average. " +
          "Be explicit about updating the left index using Math.max to maintain the invariant."
      },
      {
        languageId: "python",
        notes:
          "You can use a dictionary or an array of size 128 for ASCII characters. " +
          "Emphasize the O(n) complexity and how each character is processed at most twice."
      }
    ]
  }),

  // ---------------------------------------------------------------------------
  // TREE
  // ---------------------------------------------------------------------------
  q({
    id: "q-tree-01",
    title: "Lowest Common Ancestor in a Binary Tree",
    topic: "tree",
    difficulty: "medium",
    corePatterns: ["dfs", "recursion"],
    tags: ["proof-of-correctness", "edge-cases"],
    prompt:
      "Given a binary tree and two nodes p and q, find their lowest common ancestor (LCA). " +
      "The lowest common ancestor of two nodes is the lowest node in the tree that has both " +
      "p and q as descendants (where a node can be a descendant of itself).",
    examples: [
      {
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
        output: "3"
      },
      {
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
        output: "5"
      }
    ],
    constraints: [
      "Tree has up to 10^5 nodes.",
      "Values are not necessarily unique; you may be given node references instead.",
      "You may assume both nodes exist in the tree."
    ],
    answerOutline: [
      "Explain the recursive approach: search left and right subtrees for p and q.",
      "If both sides return non-null, current node is the LCA.",
      "If only one side returns non-null, propagate that result upwards.",
      "If the current node is p or q, return it directly.",
      "Discuss time complexity: O(n), space complexity: O(h) for recursion depth."
    ],
    commonPitfalls: [
      "Assuming values are unique when the problem might use node references.",
      "Not handling the case where one node is ancestor of the other.",
      "Forgetting to propagate non-null results correctly in the recursion.",
      "Confusing LCA in binary tree vs binary search tree."
    ],
    followUps: [
      "How would you change the solution if the tree were a Binary Search Tree?",
      "What if you had to support LCA queries repeatedly and the tree were static?",
      "Can you implement an iterative solution without recursion?"
    ],
    languageHints: [
      {
        languageId: "pseudo",
        notes:
          "This is primarily a recursion and reasoning problem; pseudocode often keeps the focus " +
          "on the decision logic instead of syntax details."
      }
    ]
  }),

  // ---------------------------------------------------------------------------
  // DYNAMIC PROGRAMMING
  // ---------------------------------------------------------------------------
  q({
    id: "q-dp-01",
    title: "House Robber (Linear Street)",
    topic: "dynamic-programming",
    difficulty: "easy",
    corePatterns: ["knapsack-dp"],
    tags: ["time-complexity", "recursion-to-iteration"],
    prompt:
      "You are given an array representing the amount of money at each house along a street. " +
      "You cannot rob two adjacent houses. Compute the maximum amount of money you can rob.",
    examples: [
      {
        input: "[2,7,9,3,1]",
        output: "12",
        explanation: "Rob houses 2 and 4 (7 + 3) or 1 and 3 and 5 (2 + 9 + 1) depending on layout."
      }
    ],
    constraints: [
      "1 ≤ n ≤ 10^5",
      "0 ≤ nums[i] ≤ 10^9",
      "O(n) time and O(1) or O(n) space are acceptable."
    ],
    answerOutline: [
      "Describe the naive exponential recursion: at each house, choose to rob or skip.",
      "Define dp[i] as the best we can do considering houses up to index i.",
      "Transition: dp[i] = max(dp[i-1], dp[i-2] + nums[i]).",
      "Implement iterative solution with two rolling variables prev2, prev1.",
      "Explain why the choice structure resembles a 1D knapsack."
    ],
    commonPitfalls: [
      "Forgetting base cases for n = 1 or n = 2.",
      "Indexing mistakes when converting from recursion to iteration.",
      "Trying to store decisions for every subset instead of using the simple recurrence.",
      "Not handling arrays with zeros correctly (e.g. all zeros)."
    ],
    followUps: [
      "What changes when the houses are arranged in a circle (first and last are adjacent)?",
      "How would you recover the actual set of houses robbed, not just the maximum value?",
      "Can this approach generalize to weighted independent set problems on path graphs?"
    ],
    languageHints: [
      {
        languageId: "javascript",
        notes:
          "Using two variables prev2 and prev1 keeps memory O(1). Show the DP table version first " +
          "if the interviewer values clarity, then optimize."
      }
    ]
  }),

  // ---------------------------------------------------------------------------
  // MISC / META
  // ---------------------------------------------------------------------------
  q({
    id: "q-meta-01",
    title: "Explain an Algorithm Using the Visualizer",
    topic: "misc",
    difficulty: "warmup",
    corePatterns: [],
    tags: ["visualization", "proof-of-correctness"],
    prompt:
      "Pick any algorithm from the library (e.g. Bubble Sort, Binary Search, BFS on a grid) " +
      "and use the visualizer to explain it to a beginner. Pretend that the interviewer does " +
      "not know the algorithm and is only allowed to see the trace.",
    examples: [
      {
        input: "Algorithm: Bubble Sort, Input: [5, 1, 4, 2]",
        output:
          "A step-by-step narrative where you describe which elements are compared and swapped at each step."
      }
    ],
    constraints: [
      "Focus on clarity of explanation, not on code.",
      "Assume the other person can see the visualizer but not read the code.",
      "Your goal is to make them comfortable implementing the algorithm afterwards."
    ],
    answerOutline: [
      "Introduce the problem in plain language before diving into steps.",
      "Point to the visual elements: highlight indices, array snapshots, or queue contents.",
      "Relate each visual step back to the underlying idea (e.g. shrinking search range).",
      "Conclude with a summary of time/space complexity and key invariants.",
      "Optionally, discuss how the trace would differ on another input."
    ],
    commonPitfalls: [
      "Reading code line-by-line instead of telling a story with the visualization.",
      "Using jargon without checking if the audience understands it.",
      "Skipping the big picture and focusing only on micro-steps.",
      "Not mentioning complexity or why the algorithm is correct."
    ],
    followUps: [
      "How could you improve the visualizer to make your explanation easier?",
      "What would you change in the trace model to support tree or graph visuals?",
      "Can you think of a bug that would be easy to spot using the visualizer but not from code alone?"
    ],
    languageHints: [
      {
        languageId: "pseudo",
        notes:
          "This is intentionally language-agnostic. The key is narrative clarity, not syntax. " +
          "Practice describing invariants and state transitions while the trace is running."
      }
    ]
  })
];

// -----------------------------------------------------------------------------
// SESSION PLANS
// -----------------------------------------------------------------------------

function plan(plan: InterviewSessionPlan): InterviewSessionPlan {
  return plan;
}

export const interviewSessionPlans: InterviewSessionPlan[] = [
  plan({
    id: "session-beginner-01",
    title: "Beginner Algorithms Warmup (60 Minutes)",
    focus: "fundamentals",
    targetDurationMinutes: 60,
    recommendedLevel: "beginner",
    description:
      "A gentle introduction session focused on basic sorting and searching problems. " +
      "Ideal for students who are just starting algorithm practice and want to use the " +
      "Playground as a safe space to experiment with code and visualizations.",
    warmupQuestionIds: ["q-meta-01"],
    coreQuestionIds: ["q-sorting-01", "q-sorting-02", "q-search-01"],
    stretchQuestionIds: ["q-search-02"],
    debriefChecklist: [
      "Can the learner explain what stability in sorting means with an example?",
      "Can they implement at least one O(log n) binary search variant without help?",
      "Do they understand how visual traces correspond to code execution?",
      "Did they reflect on at least one common pitfall per question?"
    ]
  }),

  plan({
    id: "session-intermediate-graph-dp",
    title: "Graph & DP Problem-Solving (90 Minutes)",
    focus: "problem-solving",
    targetDurationMinutes: 90,
    recommendedLevel: "intermediate",
    description:
      "A mixed session that combines graph traversal with a classic dynamic programming problem. " +
      "Use it when the learner already knows the syntax and wants to deepen reasoning skills.",
    warmupQuestionIds: ["q-search-01"],
    coreQuestionIds: ["q-tree-01", "q-dp-01"],
    stretchQuestionIds: ["q-search-02"],
    debriefChecklist: [
      "Can the learner articulate why BFS/DFS are O(V+E)?",
      "Can they walk through a recursion tree for House Robber and derive the DP recurrence?",
      "Are they comfortable arguing about correctness using invariants or structural induction?",
      "Did they identify at least one way to optimize memory usage in a DP solution?"
    ]
  }),

  plan({
    id: "session-sliding-window",
    title: "Sliding Window & Strings (75 Minutes)",
    focus: "contest-prep",
    targetDurationMinutes: 75,
    recommendedLevel: "intermediate",
    description:
      "A focused session on sliding-window techniques for string problems. The goal is to " +
      "automate the thought process: from brute-force ideas to efficient window-based solutions.",
    warmupQuestionIds: ["q-sorting-02"],
    coreQuestionIds: ["q-string-01"],
    stretchQuestionIds: ["q-dp-01"],
    debriefChecklist: [
      "Did the learner clearly identify the window invariant for the string problem?",
      "Can they describe how and why the left pointer moves forward?",
      "Did they handle edge cases such as empty strings or all identical characters?",
      "Can they generalize the technique to 'at most K distinct characters' problems?"
    ]
  })
];

// -----------------------------------------------------------------------------
// QUERY HELPERS
// -----------------------------------------------------------------------------

/**
 * Return all questions for a given topic. This is convenient for UI pages
 * that want to render filters like “Show all graph questions”.
 */
export function getQuestionsByTopic(topic: InterviewTopic): InterviewQuestion[] {
  return interviewQuestions.filter((q) => q.topic === topic);
}

/**
 * Filter questions by difficulty level.
 */
export function getQuestionsByDifficulty(
  difficulty: InterviewDifficulty
): InterviewQuestion[] {
  return interviewQuestions.filter((q) => q.difficulty === difficulty);
}

/**
 * Find a specific question by id. Returns undefined if not found so callers
 * can handle missing ids gracefully.
 */
export function findInterviewQuestion(
  id: string
): InterviewQuestion | undefined {
  return interviewQuestions.find((q) => q.id === id);
}

/**
 * Get a session plan by id.
 */
export function findSessionPlan(
  id: string
): InterviewSessionPlan | undefined {
  return interviewSessionPlans.find((plan) => plan.id === id);
}

/**
 * Convenience helper: expand a session plan into the full question objects.
 * This can be useful for server components or API handlers that want to
 * return a fully hydrated view of a study session.
 */
export function expandSessionPlan(planId: string): {
  plan: InterviewSessionPlan | undefined;
  warmup: InterviewQuestion[];
  core: InterviewQuestion[];
  stretch: InterviewQuestion[];
} {
  const plan = findSessionPlan(planId);

  if (!plan) {
    return {
      plan: undefined,
      warmup: [],
      core: [],
      stretch: []
    };
  }

  const map = new Map(interviewQuestions.map((q) => [q.id, q]));

  const resolve = (ids: string[]): InterviewQuestion[] =>
    ids
      .map((id) => map.get(id))
      .filter((q): q is InterviewQuestion => Boolean(q));

  return {
    plan,
    warmup: resolve(plan.warmupQuestionIds),
    core: resolve(plan.coreQuestionIds),
    stretch: resolve(plan.stretchQuestionIds)
  };
}
