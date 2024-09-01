// src/lib/interviewQuestionBank.ts
/**
 * Structured, strongly-typed question bank used to enrich the project for:
 * - Study & Interview Planner
 * - Future AI-assisted prompts
 * - Demo content for buyers to see how the app can be extended
 *
 * This module is intentionally verbose and well-documented to:
 * 1. Provide realistic sample content for coding & system design interviews.
 * 2. Serve as a reference for how to model rich metadata in TypeScript.
 */

export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionFormat =
  | "coding"
  | "conceptual"
  | "system-design"
  | "debugging"
  | "refactor";

export interface InterviewQuestion {
  /** Stable identifier, can be used as a database key later. */
  id: string;
  /** URL-friendly slug, can be used in routes or query params. */
  slug: string;
  /** Short human-readable name of the problem. */
  title: string;
  /** Basic difficulty level tag. */
  difficulty: QuestionDifficulty;
  /** High-level format of the question (coding, SD, etc.). */
  format: QuestionFormat;
  /** Free-form topic tags (arrays, DP, BFS, etc.). */
  topics: string[];
  /** Primary languages the question is usually asked in. */
  languages: string[];
  /** Rough estimate of minutes needed in an interview. */
  estimatedMinutes: number;
  /** Full prompt that can be shown to a candidate. */
  prompt: string;
  /** Description of what inputs / outputs the function should handle. */
  inputOutputDescription: string;
  /** Clear bullet-point acceptance criteria for evaluation. */
  acceptanceCriteria: string[];
  /** Optional hint bullets to progressively unblock a candidate. */
  hints: string[];
  /** Follow-up prompts for deeper exploration. */
  followUps: string[];
  /** Optional notes for interviewer / self-study. */
  notes?: string;
}

/**
 * A reusable, strongly-typed question bank.
 * In a future version, this could be pulled from a database or CMS.
 */
export const interviewQuestionBank: InterviewQuestion[] = [
  {
    id: "arrays-two-sum-basic",
    slug: "two-sum-basic",
    title: "Two Sum (Basic Version)",
    difficulty: "easy",
    format: "coding",
    topics: ["arrays", "hash-map", "implementation"],
    languages: ["javascript", "typescript", "python"],
    estimatedMinutes: 20,
    prompt:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n" +
      "Assume that each input would have exactly one solution, and you may not use the same element twice.",
    inputOutputDescription:
      "Input: nums: number[], target: number.\n" +
      "Output: [i, j] such that nums[i] + nums[j] === target.\n" +
      "If no solution exists, you can return an empty array or [-1, -1] depending on your design.",
    acceptanceCriteria: [
      "Uses an efficient approach (hash map) with O(n) time in the ideal solution.",
      "Handles negative numbers and duplicates correctly.",
      "Does not reuse the same element twice.",
      "Includes at least a couple of basic test cases.",
    ],
    hints: [
      "Think about storing numbers you have seen so far in a map keyed by value.",
      "At each step, compute complement = target - current and ask: have I seen complement before?",
      "Be careful with indices when the same number appears multiple times.",
    ],
    followUps: [
      "How would you handle the case where there may be multiple valid pairs?",
      "How would you adapt this for a streaming input where you cannot store all numbers?",
    ],
    notes:
      "This is a classic warmup problem that reveals basic comfort with arrays, loops, and hash maps.",
  },
  {
    id: "strings-longest-substring-without-repeating",
    slug: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    format: "coding",
    topics: ["strings", "sliding-window", "hash-map"],
    languages: ["javascript", "typescript", "python"],
    estimatedMinutes: 35,
    prompt:
      "Given a string s, find the length of the longest substring without repeating characters.\n" +
      "A substring is a contiguous sequence of characters within the string.",
    inputOutputDescription:
      "Input: a string s.\n" +
      "Output: a number representing the length of the longest substring without repeated characters.\n" +
      "Example: s = \"abcabcbb\" → 3 because \"abc\" is the longest substring without repeated characters.",
    acceptanceCriteria: [
      "Algorithm runs in O(n) time using a sliding window technique.",
      "Correctly handles edge cases like empty string, single character, or all-identical characters.",
      "Code is clearly structured and uses descriptive variable names.",
    ],
    hints: [
      "Maintain a sliding window [left, right] and a map from character to last seen index.",
      "When you see a repeated character at index i, you may need to move the left pointer.",
      "The answer can be updated at each step as right - left + 1.",
    ],
    followUps: [
      "How would you modify the solution for the longest substring with at most K distinct characters?",
      "What changes if the input is a stream and you can only see characters once?",
    ],
    notes:
      "Tests sliding window understanding plus their ability to reason about indices and invariants.",
  },
  {
    id: "arrays-merge-intervals",
    slug: "merge-intervals",
    title: "Merge Overlapping Intervals",
    difficulty: "medium",
    format: "coding",
    topics: ["arrays", "sorting", "intervals"],
    languages: ["javascript", "typescript", "python"],
    estimatedMinutes: 30,
    prompt:
      "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals\n" +
      "and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    inputOutputDescription:
      "Input: intervals: [number, number][]. Each interval is [start, end] with start <= end.\n" +
      "Output: merged intervals sorted by start.",
    acceptanceCriteria: [
      "Sorts intervals by start in O(n log n) time.",
      "Correctly merges overlapping intervals into a single interval.",
      "Handles edge cases like a single interval, already non-overlapping list, or fully nested intervals.",
    ],
    hints: [
      "Sort intervals by start, then sweep through them from left to right.",
      "Keep a current interval and attempt to merge with the next if overlapping.",
      "Overlap check: next.start <= current.end.",
    ],
    followUps: [
      "How would you handle open intervals (start, end) vs closed intervals [start, end]?",
      "What if intervals come from a stream and must be merged in near real-time?",
    ],
  },
  {
    id: "linked-list-reverse",
    slug: "reverse-linked-list",
    title: "Reverse a Singly Linked List",
    difficulty: "easy",
    format: "coding",
    topics: ["linked-list", "pointers"],
    languages: ["typescript", "javascript", "python"],
    estimatedMinutes: 20,
    prompt:
      "Given the head of a singly linked list, reverse the list and return the new head.",
    inputOutputDescription:
      "Input: head of a singly linked list.\n" +
      "Output: new head of the reversed list.\n" +
      "You may assume nodes have the shape { val: number, next: ListNode | null }.",
    acceptanceCriteria: [
      "Uses O(1) extra space (iterative reversal preferred).",
      "Handles empty list and single-node list correctly.",
      "Produces the reverse order without losing nodes.",
    ],
    hints: [
      "Use three pointers: prev, current, and next.",
      "At each step, store next = current.next, then point current.next to prev.",
      "Move prev and current forward until current becomes null.",
    ],
    followUps: [
      "How would you reverse a sublist between positions left and right?",
      "Can you reverse the list using recursion? What are the trade-offs?",
    ],
  },
  {
    id: "trees-level-order-traversal",
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    format: "coding",
    topics: ["trees", "bfs", "queues"],
    languages: ["typescript", "javascript", "python"],
    estimatedMinutes: 30,
    prompt:
      "Given the root of a binary tree, return the level order traversal of its nodes' values.\n" +
      "That is, return its values level by level from left to right.",
    inputOutputDescription:
      "Input: root of a binary tree.\n" +
      "Output: number[][] where each inner array contains the values at a specific depth.\n" +
      "Empty tree should produce an empty array.",
    acceptanceCriteria: [
      "Uses a queue-based breadth-first search.",
      "Correctly groups nodes by their level in the tree.",
      "Handles skewed trees and balanced trees.",
    ],
    hints: [
      "Use a queue initialized with the root, and process nodes level by level.",
      "Track the number of nodes in the current level before processing.",
      "For each node, push its children into the queue for the next level.",
    ],
    followUps: [
      "How would you modify the traversal to return a zig-zag (alternating) order?",
      "How would you compute the average value of nodes at each level?",
    ],
  },
  {
    id: "graphs-number-of-islands",
    slug: "number-of-islands",
    title: "Number of Islands in a Grid",
    difficulty: "medium",
    format: "coding",
    topics: ["graphs", "dfs", "bfs", "grid"],
    languages: ["typescript", "javascript", "python"],
    estimatedMinutes: 35,
    prompt:
      "Given an m x n 2D binary grid representing a map of '1's (land) and '0's (water),\n" +
      "return the number of islands. An island is surrounded by water and is formed by\n" +
      "connecting adjacent lands horizontally or vertically.",
    inputOutputDescription:
      "Input: grid: string[][] or number[][] where '1' / 1 is land and '0' / 0 is water.\n" +
      "Output: a single integer count of islands.",
    acceptanceCriteria: [
      "Uses DFS or BFS to explore connected components.",
      "Marks visited cells to avoid recounting the same island.",
      "Handles edge cases like no land, all land, and thin strip islands.",
    ],
    hints: [
      "Iterate over every cell, and whenever you see an unvisited land cell, begin a DFS/BFS.",
      "Mark cells as visited by mutating the grid or using a separate visited set.",
      "Be careful with grid boundaries when exploring neighbors.",
    ],
    followUps: [
      "How would the solution change if diagonals also counted as adjacency?",
      "How can we optimize memory usage for very large grids?",
    ],
  },
  {
    id: "dp-climbing-stairs",
    slug: "climbing-stairs",
    title: "Climbing Stairs (Classic DP)",
    difficulty: "easy",
    format: "coding",
    topics: ["dynamic-programming", "combinatorics"],
    languages: ["typescript", "javascript", "python"],
    estimatedMinutes: 20,
    prompt:
      "You are climbing a staircase. It takes n steps to reach the top.\n" +
      "Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    inputOutputDescription:
      "Input: n (integer, n >= 0).\n" +
      "Output: number of distinct ways to climb to the top.\n" +
      "This is equivalent to computing the (n+1)th Fibonacci number.",
    acceptanceCriteria: [
      "Uses an O(n) dynamic programming solution or O(1) space optimized variant.",
      "Handles small values like n = 0, n = 1 correctly.",
      "Demonstrates understanding of DP state transitions.",
    ],
    hints: [
      "Define ways[i] as the number of ways to reach step i.",
      "Recurrence: ways[i] = ways[i-1] + ways[i-2].",
      "You can keep only the last two values instead of the full array.",
    ],
    followUps: [
      "What if you could climb up to k steps at a time instead of just 1 or 2?",
      "How would you adapt the solution if some steps were broken and could not be stepped on?",
    ],
  },
  {
    id: "system-design-url-shortener",
    slug: "system-design-url-shortener",
    title: "Design a URL Shortener",
    difficulty: "medium",
    format: "system-design",
    topics: ["system-design", "databases", "caching", "api-design"],
    languages: ["language-agnostic"],
    estimatedMinutes: 40,
    prompt:
      "Design a URL shortening service like bit.ly. The system should be able to:\n" +
      "- Accept a long URL and return a short URL.\n" +
      "- Redirect from the short URL to the original URL.\n" +
      "- Handle a large volume of read traffic with low latency.",
    inputOutputDescription:
      "Input: long URLs submitted via HTTP API or web form.\n" +
      "Output: short URLs, which when visited, redirect to the original long URL.",
    acceptanceCriteria: [
      "Covers high-level API design and core entities.",
      "Discusses storage strategy for mapping short codes to long URLs.",
      "Addresses scale (read-heavy), caching, and potential bottlenecks.",
    ],
    hints: [
      "Think about using a base-62 encoded ID as the short code.",
      "Discuss relational vs NoSQL storage and trade-offs.",
      "Consider cache layers like Redis near the application.",
    ],
    followUps: [
      "How would you support custom aliases or expiration times?",
      "How would you detect and mitigate abuse or malicious URLs?",
    ],
    notes:
      "This question checks basic system design vocabulary and the ability to reason about scale.",
  },
  {
    id: "system-design-rate-limiter",
    slug: "design-rate-limiter",
    title: "Design an API Rate Limiter",
    difficulty: "hard",
    format: "system-design",
    topics: ["system-design", "distributed-systems", "caching"],
    languages: ["language-agnostic"],
    estimatedMinutes: 45,
    prompt:
      "Design a rate limiting system that can throttle incoming API requests per user or API key.\n" +
      "The system should work in a distributed environment with multiple application servers.",
    inputOutputDescription:
      "Input: incoming API requests with an associated user identifier or API key.\n" +
      "Output: allow/deny decision plus appropriate HTTP status codes.",
    acceptanceCriteria: [
      "Mentions fixed window, sliding window, or token bucket strategies.",
      "Discusses how to store counters in a centralized or semi-centralized cache (e.g., Redis).",
      "Addresses race conditions and distribution across multiple app instances.",
    ],
    hints: [
      "Think about an in-memory token bucket for a single node, then extend to multiple nodes.",
      "Consider using Redis INCR with TTL for atomic operations.",
      "Explore different granularity: per-user, per-IP, per-endpoint.",
    ],
    followUps: [
      "How would you expose rate limit information back to clients (headers, dashboards)?",
      "How would you design alerting and monitoring around rate limits?",
    ],
  },
  {
    id: "debugging-off-by-one",
    slug: "debug-off-by-one-array",
    title: "Debug an Off-by-One Error in an Array Loop",
    difficulty: "easy",
    format: "debugging",
    topics: ["arrays", "off-by-one", "bug-fixing"],
    languages: ["typescript", "javascript"],
    estimatedMinutes: 15,
    prompt:
      "You are given a function that aims to compute the sum of all elements in an array,\n" +
      "but it returns the wrong result for some inputs. Identify and fix the bug.",
    inputOutputDescription:
      "Input: an array of numbers.\n" +
      "Output: a single number representing the sum of all elements.",
    acceptanceCriteria: [
      "Candidate is able to read and reason about the buggy code.",
      "Identifies the off-by-one error or incorrect comparison in the loop.",
      "Produces a corrected implementation and explains the fix.",
    ],
    hints: [
      "Check loop boundaries carefully.",
      "Make sure the initial value for the accumulator is correct.",
      "Add console.log statements or test with simple arrays like [1], [1,2].",
    ],
    followUps: [
      "How would you write unit tests to guard against this class of bugs?",
      "What tools or techniques do you use to debug logic errors quickly?",
    ],
  },
  {
    id: "refactor-long-function",
    slug: "refactor-long-function",
    title: "Refactor an Overly Long Function",
    difficulty: "medium",
    format: "refactor",
    topics: ["clean-code", "refactoring", "readability"],
    languages: ["typescript", "javascript"],
    estimatedMinutes: 30,
    prompt:
      "You are given a long, monolithic function that performs multiple loosely-related operations\n" +
      "such as validation, transformation, logging, and persistence. The function is hard to read,\n" +
      "difficult to test, and error-prone. Refactor the function to improve readability and maintainability\n" +
      "without changing its external behavior.",
    inputOutputDescription:
      "Input: existing function implementation (provided in the codebase or a code snippet).\n" +
      "Output: a set of smaller, cohesive functions with clear names and minimal side-effects.",
    acceptanceCriteria: [
      "Extracts well-named helper functions for distinct responsibilities.",
      "Reduces nesting and deeply-indented conditionals where possible.",
      "Improves testability by decoupling logic from IO or framework-specific calls.",
    ],
    hints: [
      "Look for natural seams where you can split the function (e.g., parsing vs validation).",
      "Apply the Single Responsibility Principle to identify sub-tasks.",
      "Consider pure functions where inputs and outputs are explicit.",
    ],
    followUps: [
      "How would you introduce these changes safely in a production codebase?",
      "What metrics or code smells do you look for when deciding to refactor?",
    ],
  },
];

/**
 * Returns all questions filtered by a given difficulty level.
 *
 * @param difficulty - difficulty string ('easy', 'medium', 'hard').
 */
export function getQuestionsByDifficulty(
  difficulty: QuestionDifficulty
): InterviewQuestion[] {
  return interviewQuestionBank.filter(
    (q) => q.difficulty === difficulty
  );
}

/**
 * Returns all questions whose topics array contains the provided topic substring
 * (case-insensitive).
 *
 * This is intentionally permissive so that UI search boxes can use it directly
 * without strict enum matching.
 */
export function searchQuestionsByTopic(
  topicSubstring: string
): InterviewQuestion[] {
  const needle = topicSubstring.trim().toLowerCase();
  if (!needle) return interviewQuestionBank;

  return interviewQuestionBank.filter((q) =>
    q.topics.some((topic) => topic.toLowerCase().includes(needle))
  );
}

/**
 * Finds a single question by slug. Returns undefined if no match is found.
 */
export function findQuestionBySlug(
  slug: string
): InterviewQuestion | undefined {
  const needle = slug.trim().toLowerCase();
  return interviewQuestionBank.find(
    (q) => q.slug.toLowerCase() === needle
  );
}

/**
 * Returns a random question from the bank.
 * Optional filter parameters can be used to restrict the pool.
 */
export function getRandomQuestion(options?: {
  difficulty?: QuestionDifficulty;
  format?: QuestionFormat;
}): InterviewQuestion | undefined {
  let pool = interviewQuestionBank;

  if (options?.difficulty) {
    pool = pool.filter((q) => q.difficulty === options.difficulty);
  }

  if (options?.format) {
    pool = pool.filter((q) => q.format === options.format);
  }

  if (pool.length === 0) return undefined;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Groups questions by their difficulty level and returns a dictionary-like object.
 */
export function groupQuestionsByDifficulty(): Record<
  QuestionDifficulty,
  InterviewQuestion[]
> {
  const result: Record<QuestionDifficulty, InterviewQuestion[]> = {
    easy: [],
    medium: [],
    hard: [],
  };

  for (const q of interviewQuestionBank) {
    result[q.difficulty].push(q);
  }

  return result;
}
