// src/app/examples/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ExampleTag =
  | "sorting"
  | "searching"
  | "graph"
  | "dynamic-programming"
  | "recursion"
  | "intro"
  | "performance"
  | "visualization"
  | "playground";

type ExampleLanguage = "javascript" | "python";

type Example = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  language: ExampleLanguage;
  algorithmId?: string;
  tags: ExampleTag[];
  difficulty: "easy" | "medium" | "hard";
  useCase: string;
  playgroundParams: Record<string, string>;
  codePreview: string;
};

const examples: Example[] = [
  {
    id: "bubble-sort-basic",
    title: "Bubble Sort — Step-by-Step Visualization",
    subtitle: "Sorting • Arrays • Visualization",
    description:
      "Classic bubble sort over a small integer array with detailed trace output. Ideal as a first example of how traces and the array visualizer work together.",
    language: "javascript",
    algorithmId: "bubble-sort",
    tags: ["sorting", "visualization", "intro", "playground"],
    difficulty: "easy",
    useCase: "Teaching basic comparison-based sorting and trace-driven visuals.",
    playgroundParams: {
      algo: "bubble-sort",
      lang: "javascript",
    },
    codePreview: [
      "function bubbleSort(arr) {",
      "  const a = [...arr];",
      "  const n = a.length;",
      "  for (let i = 0; i < n - 1; i++) {",
      "    for (let j = 0; j < n - i - 1; j++) {",
      "      if (a[j] > a[j + 1]) {",
      "        [a[j], a[j + 1]] = [a[j + 1], a[j]];",
      "      }",
      "    }",
      "  }",
      "  return a;",
      "}",
      "",
      "console.log(bubbleSort([5, 1, 4, 2, 8]));",
    ].join("\n"),
  },
  {
    id: "binary-search-trace",
    title: "Binary Search — Trace of Midpoint Updates",
    subtitle: "Searching • Arrays • Trace",
    description:
      "Binary search over a sorted array with logs for low, high, and mid pointers. Great for showing why logarithmic time arises.",
    language: "javascript",
    algorithmId: "binary-search",
    tags: ["searching", "visualization", "performance", "intro"],
    difficulty: "easy",
    useCase:
      "Demonstrating logarithmic-time search and pointer movement within a sorted list.",
    playgroundParams: {
      algo: "binary-search",
      lang: "javascript",
    },
    codePreview: [
      "function binarySearch(arr, target) {",
      "  let lo = 0;",
      "  let hi = arr.length - 1;",
      "  while (lo <= hi) {",
      "    const mid = Math.floor((lo + hi) / 2);",
      "    const value = arr[mid];",
      "    console.log(`lo=${lo}, hi=${hi}, mid=${mid}, value=${value}`);",
      "    if (value === target) return mid;",
      "    if (value < target) lo = mid + 1;",
      "    else hi = mid - 1;",
      "  }",
      "  return -1;",
      "}",
      "",
      "const arr = [1, 3, 5, 7, 9, 11];",
      "console.log(binarySearch(arr, 7));",
    ].join("\n"),
  },
  {
    id: "bfs-graph-demo",
    title: "Breadth-First Search — Graph Traversal Order",
    subtitle: "Graphs • Queues • Levels",
    description:
      "Breadth-first traversal on a small unweighted graph, logging queue contents and visited nodes. Pairs nicely with the graph visualizer demo.",
    language: "javascript",
    algorithmId: "bfs",
    tags: ["graph", "visualization", "intro", "playground"],
    difficulty: "medium",
    useCase:
      "Illustrating BFS layer-by-layer exploration of an adjacency list graph.",
    playgroundParams: {
      algo: "bfs",
      lang: "javascript",
    },
    codePreview: [
      "function bfs(start, adjacency) {",
      "  const visited = new Set();",
      "  const queue = [start];",
      "  visited.add(start);",
      "  console.log(`Start BFS from ${start}`);",
      "  while (queue.length > 0) {",
      "    const node = queue.shift();",
      "    console.log(`Visit ${node} (queue: [${queue.join(', ')}])`);",
      "    for (const neighbor of adjacency[node] ?? []) {",
      "      if (!visited.has(neighbor)) {",
      "        visited.add(neighbor);",
      "        queue.push(neighbor);",
      "        console.log(`  enqueue ${neighbor}`);",
      "      }",
      "    }",
      "  }",
      "}",
      "",
      "const graph = {",
      "  A: ['B', 'C'],",
      "  B: ['D'],",
      "  C: ['E', 'F'],",
      "  D: [],",
      "  E: [],",
      "  F: [],",
      "};",
      "",
      "bfs('A', graph);",
    ].join("\n"),
  },
  {
    id: "two-sum-bruteforce",
    title: "Two-Sum — Brute Force vs Optimized",
    subtitle: "Hash Maps • Arrays • Comparison",
    description:
      "Show students the difference between a quadratic brute-force search and a linear-time hash map approach using the same playground.",
    language: "javascript",
    algorithmId: "two-sum",
    tags: ["searching", "performance", "intro", "playground"],
    difficulty: "medium",
    useCase:
      "Comparing naive and optimized solutions for a common interview-style problem.",
    playgroundParams: {
      algo: "two-sum",
      lang: "javascript",
    },
    codePreview: [
      "// O(n^2) brute-force solution",
      "function twoSumBruteForce(nums, target) {",
      "  for (let i = 0; i < nums.length; i++) {",
      "    for (let j = i + 1; j < nums.length; j++) {",
      "      if (nums[i] + nums[j] === target) {",
      "        return [i, j];",
      "      }",
      "    }",
      "  }",
      "  return null;",
      "}",
      "",
      "// O(n) hash map solution",
      "function twoSumHash(nums, target) {",
      "  const map = new Map();",
      "  for (let i = 0; i < nums.length; i++) {",
      "    const complement = target - nums[i];",
      "    if (map.has(complement)) {",
      "      return [map.get(complement), i];",
      "    }",
      "    map.set(nums[i], i);",
      "  }",
      "  return null;",
      "}",
      "",
      "console.log(twoSumBruteForce([2, 7, 11, 15], 9));",
      "console.log(twoSumHash([2, 7, 11, 15], 9));",
    ].join("\n"),
  },
  {
    id: "dp-fibonacci",
    title: "Fibonacci — Top-Down vs Bottom-Up DP",
    subtitle: "Dynamic Programming • Recursion",
    description:
      "Demonstrates exponential recursion versus memoized and bottom-up dynamic programming for the Fibonacci sequence.",
    language: "javascript",
    algorithmId: "fibonacci-dp",
    tags: ["dynamic-programming", "recursion", "performance"],
    difficulty: "medium",
    useCase:
      "Explaining overlapping subproblems and how memoization improves runtime.",
    playgroundParams: {
      algo: "fibonacci-dp",
      lang: "javascript",
    },
    codePreview: [
      "// Exponential recursive Fibonacci",
      "function fibRecursive(n) {",
      "  if (n <= 1) return n;",
      "  return fibRecursive(n - 1) + fibRecursive(n - 2);",
      "}",
      "",
      "// Top-down memoized Fibonacci",
      "function fibMemo(n, memo = {}) {",
      "  if (n in memo) return memo[n];",
      "  if (n <= 1) return n;",
      "  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);",
      "  return memo[n];",
      "}",
      "",
      "// Bottom-up Fibonacci",
      "function fibBottomUp(n) {",
      "  if (n <= 1) return n;",
      "  const dp = new Array(n + 1).fill(0);",
      "  dp[1] = 1;",
      "  for (let i = 2; i <= n; i++) {",
      "    dp[i] = dp[i - 1] + dp[i - 2];",
      "  }",
      "  return dp[n];",
      "}",
      "",
      "for (let n = 0; n <= 10; n++) {",
      "  console.log(n, fibRecursive(n), fibMemo(n), fibBottomUp(n));",
      "}",
    ].join("\n"),
  },
  {
    id: "python-loop-basics",
    title: "Python — Loop & Print Basics",
    subtitle: "Python • Intro • Playground",
    description:
      "A gentle introduction to the Python mode of the playground: for-loops, conditionals, and print output.",
    language: "python",
    algorithmId: "python-intro-loop",
    tags: ["intro", "playground"],
    difficulty: "easy",
    useCase:
      "Allowing learners to quickly verify that Python code runs and displays output in the same UI.",
    playgroundParams: {
      algo: "python-intro-loop",
      lang: "python",
    },
    codePreview: [
      "def fizz_buzz(n: int) -> str:",
      "    if n % 15 == 0:",
      "        return 'FizzBuzz'",
      "    if n % 3 == 0:",
      "        return 'Fizz'",
      "    if n % 5 == 0:",
      "        return 'Buzz'",
      "    return str(n)",
      "",
      "for i in range(1, 21):",
      "    print(i, '→', fizz_buzz(i))",
    ].join("\n"),
  },
  {
    id: "performance-bubble-sort",
    title: "Bubble Sort — Performance Benchmarks",
    subtitle: "Sorting • Benchmarks",
    description:
      "Pairs with the performance tab to show how bubble sort scales for different input sizes.",
    language: "javascript",
    algorithmId: "bubble-sort",
    tags: ["sorting", "performance", "visualization"],
    difficulty: "medium",
    useCase:
      "Helping learners see why bubble sort is primarily a teaching algorithm, not a production choice.",
    playgroundParams: {
      algo: "bubble-sort",
      lang: "javascript",
    },
    codePreview: [
      "function bubbleSort(arr) {",
      "  const a = [...arr];",
      "  const n = a.length;",
      "  for (let i = 0; i < n - 1; i++) {",
      "    for (let j = 0; j < n - 1 - i; j++) {",
      "      if (a[j] > a[j + 1]) {",
      "        [a[j], a[j + 1]] = [a[j + 1], a[j]];",
      "      }",
      "    }",
      "  }",
      "  return a;",
      "}",
      "",
      "console.log(bubbleSort(Array.from({ length: 20 }, () =>",
      "  Math.floor(Math.random() * 100)",
      ")));",
    ].join("\n"),
  },
  {
    id: "custom-playground-template",
    title: "Custom Playground Template (Blank)",
    subtitle: "Boilerplate • Utility",
    description:
      "A minimal template for quickly starting any experiment: input parsing, helper function, and a main() entry point.",
    language: "javascript",
    algorithmId: "custom-template",
    tags: ["playground", "intro"],
    difficulty: "easy",
    useCase:
      "Giving users a clean starting point that already logs structure results, without imposing a specific algorithm.",
    playgroundParams: {
      algo: "custom-template",
      lang: "javascript",
    },
    codePreview: [
      "function main() {",
      "  // TODO: put your own logic here.",
      "  // You can log intermediate results to inspect behavior.",
      "  const input = [1, 2, 3, 4, 5];",
      "  console.log('Input:', input);",
      "",
      "  // Example transformation:",
      "  const squared = input.map((x) => x * x);",
      "  console.log('Squared:', squared);",
      "",
      "  return squared;",
      "}",
      "",
      "console.log('Result:', main());",
    ].join("\n"),
  },
];

const difficultyLabel: Record<Example["difficulty"], string> = {
  easy: "Beginner Friendly",
  medium: "Intermediate",
  hard: "Advanced",
};

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Examples
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Curated Playground Examples
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            Jump into the playground with pre-configured examples for sorting,
            searching, graph traversal, dynamic programming, and more. Each
            example includes a short code snippet, difficulty level, and a
            direct link into the interactive environment.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Blank Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="secondary">
              Browse Algorithm Library
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="sm" variant="ghost">
              Developer Docs
            </Button>
          </Link>
        </div>
      </section>

      {/* Summary */}
      <section className="text-[11px] text-slate-400">
        <p>
          Showing{" "}
          <span className="font-semibold text-slate-100">
            {examples.length}
          </span>{" "}
          curated examples. You can treat this page as a gallery of &quot;best
          starting points&quot; for live demos, workshops, and self-study.
        </p>
      </section>

      {/* Grid of examples */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {examples.map((ex) => {
          const params = new URLSearchParams(ex.playgroundParams).toString();
          const playgroundHref = `/playground?${params}`;
          return (
            <Card
              key={ex.id}
              className="flex flex-col border-slate-800 bg-slate-950/80 hover:border-emerald-500/60 hover:bg-slate-950 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm text-slate-100">
                      {ex.title}
                    </CardTitle>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {ex.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[10px]">
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-200">
                      {ex.language.toUpperCase()}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-300">
                      {difficultyLabel[ex.difficulty]}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 text-[11px] text-slate-200">
                <p className="text-slate-300">{ex.description}</p>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Use Case
                  </p>
                  <p className="text-[11px] text-slate-300">{ex.useCase}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {ex.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                    Code Preview
                  </p>
                  <pre className="max-h-40 overflow-auto rounded-md border border-slate-800 bg-slate-950 p-2 text-[10px] text-slate-200">
                    {ex.codePreview}
                  </pre>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  {ex.algorithmId ? (
                    <span className="text-[10px] text-slate-500">
                      Linked algorithm:{" "}
                      <code className="font-mono text-emerald-300">
                        {ex.algorithmId}
                      </code>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">
                      No linked algorithm — generic template.
                    </span>
                  )}
                  <Link href={playgroundHref}>
                    <Button size="sm" variant="secondary" className="text-[11px]">
                      Open in Playground
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Footer */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Customize This Gallery
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              You can easily extend this page by adding more examples to the{" "}
              <span className="font-mono text-emerald-300">examples</span>{" "}
              array. For a production deployment, you might load these from a
              JSON file or database table instead of hard-coding them.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/playground">
              <Button size="sm" variant="primary">
                Start from Blank
              </Button>
            </Link>
            <Link href="/library">
              <Button size="sm" variant="ghost">
                Algorithm Library
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
