// src/lib/algorithmStudyPlans.ts
// Rich study plans for different algorithm categories.
// Not wired into the UI yet, but structured so it can be used later
// to build a "Guided Learning" section or recommendations inside
// the playground or docs.

export type StudyStepType =
  | "read"
  | "implement"
  | "visualize"
  | "compare"
  | "analyze"
  | "refactor"
  | "optimize"
  | "debug";

export type StudyTask = {
  id: string;
  title: string;
  type: StudyStepType;
  estimatedMinutes: number;
  description: string;
  checklist: string[];
  tips: string[];
};

export type StudyTrackLevel = "beginner" | "intermediate" | "advanced";

export type StudyTrackCategory =
  | "sorting"
  | "searching"
  | "graph"
  | "dynamic-programming"
  | "string"
  | "tree"
  | "math"
  | "grid";

export type StudyTrack = {
  id: string;
  title: string;
  level: StudyTrackLevel;
  category: StudyTrackCategory;
  overview: string;
  goals: string[];
  prerequisites: string[];
  tasks: StudyTask[];
  suggestedOrderNotes: string;
};

// Small helper to keep creation explicit and readable.
// This also makes it easy to extend later.
function createTask(task: StudyTask): StudyTask {
  return task;
}

function minutes(min: number): number {
  return min;
}

/**
 * SORTING STUDY TRACK
 * Focus: comparison-based sorting, stability, in-place vs out-of-place,
 *        and time/space tradeoffs.
 */
export const sortingStudyTrack: StudyTrack = {
  id: "sorting-core",
  title: "Core Sorting Algorithms",
  level: "beginner",
  category: "sorting",
  overview:
    "This track introduces the classic comparison-based sorting algorithms, " +
    "moving from simple quadratic-time methods to more efficient n log n approaches. " +
    "It is designed to be followed alongside the Code Playground & Algorithm Visualizer, " +
    "using the interactive traces to build intuition about how each algorithm moves data.",
  goals: [
    "Understand what sorting is and why stable vs unstable sorting matters.",
    "Be able to implement Bubble Sort, Selection Sort, and Insertion Sort from memory.",
    "Gain an intuitive feel for O(n^2) vs O(n log n) complexity using hands-on experiments.",
    "Learn how Merge Sort and Quick Sort divide-and-conquer the input array.",
    "Be comfortable explaining the trade-offs between different sorting algorithms."
  ],
  prerequisites: [
    "Basic familiarity with arrays and indexing.",
    "Comfort with writing simple loops and conditional statements.",
    "Ability to trace code execution line by line on paper."
  ],
  tasks: [
    createTask({
      id: "sorting-01-bubble-read",
      title: "Read & Sketch Bubble Sort",
      type: "read",
      estimatedMinutes: minutes(25),
      description:
        "Open the Bubble Sort algorithm in the Algorithm Library and read the description " +
        "carefully. Without looking at the code, sketch the algorithm in plain language and " +
        "draw a small example (e.g. [5, 1, 4, 2]) showing how elements 'bubble' to the end.",
      checklist: [
        "Open Bubble Sort in the Algorithm Library.",
        "Read metadata: time complexity, space complexity, and notes.",
        "Write a one-paragraph explanation of how Bubble Sort works.",
        "Draw at least one pass of Bubble Sort on paper.",
        "Identify which pairs of elements are compared in the first pass."
      ],
      tips: [
        "Focus on the mental model: bigger elements move towards the right each pass.",
        "Use a tiny array so that you can follow every swap step easily.",
        "Try to explain Bubble Sort to someone who has never coded before.",
        "Connect the idea of passes with the outer loop of the algorithm."
      ]
    }),
    createTask({
      id: "sorting-02-bubble-implement",
      title: "Implement Bubble Sort from Scratch",
      type: "implement",
      estimatedMinutes: minutes(35),
      description:
        "Using the Playground, implement Bubble Sort without copying from the template. " +
        "Start with a blank function, add the loops, and then add swap logic. " +
        "Run your code on random arrays and verify the output.",
      checklist: [
        "Create a new playground for Bubble Sort (JavaScript or Python).",
        "Write a function bubbleSort(arr) that returns a sorted copy or sorts in-place.",
        "Add tests: already sorted array, reverse-sorted array, array with duplicates.",
        "Log the array after each outer loop iteration to see progress.",
        "Confirm the final output matches built-in sort (if available)."
      ],
      tips: [
        "Use two nested loops and compare arr[j] with arr[j + 1].",
        "Be careful with loop boundaries to avoid reading out of range.",
        "If your language has immutable arrays, remember to copy before sorting.",
        "Use console.log strategically; too many logs can be distracting."
      ]
    }),
    createTask({
      id: "sorting-03-bubble-visualize",
      title: "Visualize Bubble Sort Trace",
      type: "visualize",
      estimatedMinutes: minutes(30),
      description:
        "Run the Bubble Sort trace in the visualizer with different input sizes. " +
        "Observe how the highlighted indices move and how many swaps occur.",
      checklist: [
        "Open the Bubble Sort algorithm in the Playground with trace support.",
        "Run the visualizer on a small array (5–8 elements).",
        "Pay attention to the highlighted indices per step.",
        "Count how many passes it takes before the array is fully sorted.",
        "Note how many comparisons are made for n elements."
      ],
      tips: [
        "Slow down the visualization (mentally) by pausing on each step.",
        "Ask yourself: Is the inner loop still checking elements that are already in place?",
        "Compare the visual trace of Bubble Sort with Selection Sort later.",
        "Relate the number of comparisons to the O(n^2) complexity formula."
      ]
    }),
    createTask({
      id: "sorting-04-selection-compare",
      title: "Compare Bubble Sort and Selection Sort",
      type: "compare",
      estimatedMinutes: minutes(40),
      description:
        "Study Selection Sort and compare it structurally against Bubble Sort. " +
        "They both have O(n^2) complexity, but the pattern of swaps is different.",
      checklist: [
        "Open Selection Sort in the Algorithm Library and read the description.",
        "Draw the algorithm flow on paper using pseudocode.",
        "Run both Bubble Sort and Selection Sort on the same input using the Playground.",
        "Track how many swaps each algorithm performs.",
        "Write a short note about when you might prefer Selection Sort to Bubble Sort."
      ],
      tips: [
        "Selection Sort minimizes the number of swaps at the cost of scanning the rest of the array.",
        "Focus on the role of the 'minIndex' variable in the algorithm.",
        "Think about the cost of writing to memory vs just comparing values.",
        "Use consistent test arrays to make the comparison fair."
      ]
    }),
    createTask({
      id: "sorting-05-insertion-implement",
      title: "Implement Insertion Sort with Trace Logging",
      type: "implement",
      estimatedMinutes: minutes(45),
      description:
        "Write Insertion Sort, then add console logs to follow how the 'key' element " +
        "moves left until it reaches the correct position. Use the logs as a lightweight trace.",
      checklist: [
        "Implement insertionSort(arr) in the Playground.",
        "Log the array and the 'key' index at each insertion step.",
        "Test on arrays that are nearly sorted and completely random.",
        "Count the number of shifts required when the array is already sorted.",
        "Verify the implementation is stable (equal elements preserve order)."
      ],
      tips: [
        "Remember that the inner loop moves elements one position to the right.",
        "Track the index j as it moves left while arr[j] > key.",
        "Think about why Insertion Sort works well on small or nearly-sorted inputs.",
        "Use this as a bridge to understanding how some hybrid sort implementations work."
      ]
    }),
    createTask({
      id: "sorting-06-merge-read-implement",
      title: "Study and Implement Merge Sort",
      type: "implement",
      estimatedMinutes: minutes(60),
      description:
        "Deep-dive into Merge Sort: read the description, understand the recursive structure, " +
        "then implement it in your chosen language. Pay special attention to the merge step.",
      checklist: [
        "Review the Merge Sort entry in the Library, including complexity notes.",
        "Draw the recursion tree for an array of length 8.",
        "Implement mergeSort(arr) using recursion.",
        "Implement a separate merge(left, right) helper function.",
        "Test on large random arrays and compare timings with quadratic sorts."
      ],
      tips: [
        "Think of Merge Sort as 'divide, conquer, and combine'.",
        "Keep the merge function pure: it should just combine two sorted arrays.",
        "Focus on off-by-one errors when splitting and merging subarrays.",
        "Observe that Merge Sort is stable but uses extra memory for merging."
      ]
    }),
    createTask({
      id: "sorting-07-quick-analyze",
      title: "Analyze Quick Sort Partition Strategies",
      type: "analyze",
      estimatedMinutes: minutes(55),
      description:
        "Read about Quick Sort and experiment with different pivot choices using the Playground. " +
        "Observe how the pivot strategy affects performance on different input distributions.",
      checklist: [
        "Open Quick Sort in the Library and read the explanation for pivot selection.",
        "Implement or review a partition function using Lomuto or Hoare scheme.",
        "Run experiments with first-element, last-element, and median-of-three pivots.",
        "Generate worst-case scenarios (already sorted, all equal elements) and measure time.",
        "Summarize when Quick Sort performs best and when it degrades to O(n^2)."
      ],
      tips: [
        "Remember that Quick Sort is often the fastest in practice despite bad worst-case behavior.",
        "Keep recursion depth in mind; deeply unbalanced splits are problematic.",
        "Use the playground's performance panel (if available) to visualize timing.",
        "Relate the observed behavior back to the average vs worst-case complexity formulas."
      ]
    }),
    createTask({
      id: "sorting-08-summary",
      title: "Write a Sorting Cheat Sheet",
      type: "refactor",
      estimatedMinutes: minutes(35),
      description:
        "Consolidate your understanding by writing a one-page cheat sheet for the major sorting algorithms. " +
        "This will serve as a quick reference for interviews and future study.",
      checklist: [
        "List Bubble, Selection, Insertion, Merge, and Quick Sort.",
        "For each, include: time complexity (best/average/worst), space complexity, and stability.",
        "Add one bullet describing when the algorithm is a good fit.",
        "Include a high-level sentence summarizing how the algorithm works.",
        "Optionally, link each bullet back to an Algorithm Library entry or code template."
      ],
      tips: [
        "Write the cheat sheet in your own words; avoid copying from documentation.",
        "Keep it concise but information-dense.",
        "Use this cheat sheet before interviews or coding tests as a quick refresher.",
        "Update the sheet later when you learn more advanced sorting techniques."
      ]
    })
  ],
  suggestedOrderNotes:
    "Tasks are arranged in a roughly linear path from simple O(n^2) algorithms to divide-and-conquer " +
    "methods. However, learners can safely jump between Bubble, Selection, and Insertion Sort tasks " +
    "in any order, as long as they complete the Merge Sort and Quick Sort tasks once they are " +
    "comfortable with nested loops and array manipulation."
};

/**
 * SEARCHING STUDY TRACK
 * Focus: linear search, binary search, and variations that build intuition
 * for logarithmic time complexity.
 */
export const searchingStudyTrack: StudyTrack = {
  id: "searching-core",
  title: "Core Searching Techniques",
  level: "beginner",
  category: "searching",
  overview:
    "This track covers basic searching patterns in arrays and prepares learners for graph and tree search. " +
    "It emphasizes when it is safe to use binary search and how preconditions like sorting matter.",
  goals: [
    "Understand the difference between scanning and divide-and-conquer search.",
    "Implement linear search and binary search in at least one language.",
    "Be able to argue why binary search is O(log n) using a halving argument.",
    "Recognize preconditions for binary search (sorted input, monotonic predicate)."
  ],
  prerequisites: [
    "Comfort with loops and conditional branching.",
    "Basic understanding of inequalities and integer division."
  ],
  tasks: [
    createTask({
      id: "search-01-linear",
      title: "Implement Linear Search Variants",
      type: "implement",
      estimatedMinutes: minutes(30),
      description:
        "Implement multiple versions of linear search: one that returns the first index, one that " +
        "returns all matching indices, and one that returns a boolean for membership testing.",
      checklist: [
        "Write a function that returns the first index of a target or -1 if not found.",
        "Write a variant that collects all indices of occurrences into an array.",
        "Write a boolean version that returns true/false for membership.",
        "Test behavior on empty arrays and arrays without the target.",
        "Compare readability and usage of each variant."
      ],
      tips: [
        "Linear search examples are simple, so focus on clean, readable code.",
        "Think about how early return can improve performance for the first-match variant.",
        "Consider naming semantics: findIndex vs includes vs findAll.",
        "Use linear search as a baseline for comparing more advanced methods."
      ]
    }),
    createTask({
      id: "search-02-binary-visual",
      title: "Visualize Binary Search Trace",
      type: "visualize",
      estimatedMinutes: minutes(35),
      description:
        "Use the binary search trace generator in the execution engine to visualize how the search " +
        "window shrinks on each iteration for different target positions.",
      checklist: [
        "Open the Binary Search algorithm in the Library and run the trace visualizer.",
        "Experiment with different target positions: first element, middle, last, and 'not found'.",
        "Observe how lo, hi, and mid change and which indices are highlighted.",
        "Verify that the search window size roughly halves each iteration.",
        "Write down the maximum number of iterations for arrays of size 8, 16, 32, and 64."
      ],
      tips: [
        "Watch the movement of lo and hi carefully; off-by-one mistakes often appear here.",
        "Relate each step to a region of the array being eliminated from consideration.",
        "Use the trace descriptions as a checklist for implementing your own binary search.",
        "Remember that integer division behavior matters when computing mid."
      ]
    }),
    createTask({
      id: "search-03-binary-implement",
      title: "Implement Standard Binary Search",
      type: "implement",
      estimatedMinutes: minutes(45),
      description:
        "Implement an iterative binary search that returns the index of a target or -1 if not found. " +
        "Then, add a variant that returns the insertion position for the target.",
      checklist: [
        "Implement binarySearch(arr, target) for sorted arrays.",
        "Carefully define loop conditions and update rules for lo and hi.",
        "Write tests for missing elements, duplicates, and tiny arrays.",
        "Add binarySearchInsertPosition that returns the correct insertion index.",
        "Use the Playground to verify behavior on random sorted inputs."
      ],
      tips: [
        "Rehearse the standard loop pattern until you can write it without reference.",
        "Track invariants: usually arr[lo..hi] is the active search region.",
        "Be explicit about what happens when lo crosses hi.",
        "Keep the insertion position variant in mind; it appears frequently in interviews."
      ]
    }),
    createTask({
      id: "search-04-monotonic",
      title: "Search on a Monotonic Predicate",
      type: "analyze",
      estimatedMinutes: minutes(50),
      description:
        "Generalize binary search from arrays to any monotonic boolean predicate f(x). " +
        "Practice writing code that finds boundary points where the predicate changes from false to true.",
      checklist: [
        "Define a simple predicate (e.g. isSquareGreaterThanTarget).",
        "Write a binary search that finds the smallest x such that f(x) is true.",
        "Check edge cases where all values are false or all are true.",
        "Relate the logic back to the concept of lower_bound / upper_bound from C++ STL.",
        "Summarize how monotonicity enables binary search even without explicit arrays."
      ],
      tips: [
        "Think of the predicate as a black box; you only observe true/false results.",
        "Maintain an invariant that you know one side of the boundary is all false and the other is all true.",
        "Use this style of reasoning when solving problems on answer space rather than data space.",
        "This mindset is extremely valuable for optimization and scheduling problems."
      ]
    }),
    createTask({
      id: "search-05-summary",
      title: "Searching Summary Notes",
      type: "refactor",
      estimatedMinutes: minutes(25),
      description:
        "Write a compact summary of how linear and binary search differ, when each is appropriate, " +
        "and how to recognize scenarios where binary search can be applied indirectly.",
      checklist: [
        "Document the complexity of linear vs binary search.",
        "List situations where linear search is still acceptable (small n, unsorted data).",
        "List typical binary search use cases (sorted arrays, monotonic predicates, answer search).",
        "Include at least one example where binary search on the answer is more natural than on indices.",
        "Keep the summary somewhere inside the project repo (for example, in docs or comments)."
      ],
      tips: [
        "You will revisit these notes many times when solving harder problems.",
        "Try to connect binary search ideas to real-world scenarios, such as guessing a number game.",
        "Use consistent terminology: low, high, mid, invariant, termination condition.",
        "Make sure you can derive the loop from memory without off-by-one bugs."
      ]
    })
  ],
  suggestedOrderNotes:
    "Start with linear search to set a simple baseline, then move to binary search visualization " +
    "and implementation. Tackle the monotonic predicate extension only after you feel comfortable " +
    "with the classic array version."
};

/**
 * GRAPH STUDY TRACK
 * Focus: BFS, DFS, shortest path intuition, and representation tradeoffs.
 */
export const graphStudyTrack: StudyTrack = {
  id: "graph-classic",
  title: "Graph Traversal & Shortest Paths",
  level: "intermediate",
  category: "graph",
  overview:
    "This track builds a solid foundation in graph theory for practical programming. " +
    "It moves from unweighted traversals (BFS/DFS) towards basic shortest path reasoning. " +
    "Use the existing graph algorithms in the library as reference implementations while " +
    "experimenting in the Playground.",
  goals: [
    "Understand adjacency lists vs adjacency matrices and when each is appropriate.",
    "Be able to implement BFS and DFS for both traversal and simple distance calculation.",
    "Develop intuition for how queue-based BFS explores layers of a graph.",
    "Recognize trees as a special case of graphs and exploit that structure.",
    "Build confidence to approach shortest-path problems in interview-style questions."
  ],
  prerequisites: [
    "Comfortable with arrays, lists, and basic object/dictionary usage.",
    "Familiarity with recursion and iterative loops.",
    "Basic understanding of sets and queues."
  ],
  tasks: [
    createTask({
      id: "graph-01-representations",
      title: "Experiment with Graph Representations",
      type: "read",
      estimatedMinutes: minutes(35),
      description:
        "Review the graph utilities in the algorithms-pack (if available) and sketch multiple " +
        "ways to represent the same graph: edge list, adjacency list, and adjacency matrix.",
      checklist: [
        "Pick a small undirected graph with 5–6 nodes and 7–8 edges.",
        "Write down the edge list representation.",
        "Convert it into an adjacency list using plain JavaScript or Python objects.",
        "Draw the adjacency matrix for the same graph.",
        "Note memory usage differences and potential performance tradeoffs."
      ],
      tips: [
        "Adjacency lists are typically best for sparse graphs.",
        "Adjacency matrices are convenient when the graph is dense or when you need O(1) edge queries.",
        "Keep your representations consistent (0-indexed vs 1-indexed nodes).",
        "Use diagrams alongside code; graphs are much easier to reason about visually."
      ]
    }),
    createTask({
      id: "graph-02-bfs",
      title: "Implement BFS and Track Layers",
      type: "implement",
      estimatedMinutes: minutes(50),
      description:
        "Implement Breadth-First Search on an unweighted graph and record the 'layer' or " +
        "distance from the starting node for each vertex.",
      checklist: [
        "Implement BFS using a queue data structure.",
        "Track a distance array where dist[start] = 0 and neighbors get dist[current] + 1.",
        "Run BFS on multiple starting nodes and graph shapes.",
        "Use console logs to visualize the visiting order and distances.",
        "Verify that BFS discovers all nodes reachable from the start node."
      ],
      tips: [
        "BFS explores neighbors level by level; use that idea to reason about shortest paths.",
        "Initialize all distances to -1 to indicate 'unvisited'.",
        "Be careful to mark nodes as visited when they are enqueued, not when dequeued.",
        "For undirected graphs, remember to add edges in both directions."
      ]
    }),
    createTask({
      id: "graph-03-dfs",
      title: "Implement Recursive and Iterative DFS",
      type: "implement",
      estimatedMinutes: minutes(55),
      description:
        "Implement Depth-First Search twice: once recursively and once using an explicit stack. " +
        "Compare the visiting order with BFS on the same graphs.",
      checklist: [
        "Write a recursive DFS function that prints nodes in preorder.",
        "Write an iterative DFS using an explicit stack data structure.",
        "Run both versions on the same graph and compare node orderings.",
        "Test graphs with cycles and confirm that your visited set avoids infinite loops.",
        "Add code comments explaining when DFS is more appropriate than BFS."
      ],
      tips: [
        "Recursion depth can be an issue on very large graphs; iterative DFS avoids that.",
        "DFS is useful for tasks like topological sorting and detecting cycles.",
        "Pay attention to when you mark nodes visited; get the order consistent.",
        "Use small graphs first, then move to larger or randomly generated ones."
      ]
    }),
    createTask({
      id: "graph-04-shortest-path",
      title: "Unweighted Shortest Path via BFS",
      type: "visualize",
      estimatedMinutes: minutes(45),
      description:
        "Use BFS to compute shortest paths in an unweighted graph and then reconstruct actual " +
        "paths by storing parent pointers.",
      checklist: [
        "Extend your BFS implementation to store parent[v] for each visited node.",
        "Select random target nodes and reconstruct the path by walking parent pointers.",
        "Print the path in forward order (start to target).",
        "Verify that all paths found have the minimum number of edges.",
        "Experiment with multiple targets to see how BFS builds a shortest-path tree."
      ],
      tips: [
        "Parent pointers are a simple but powerful technique for reconstructing paths.",
        "Think of BFS as simultaneously exploring many candidate paths in lockstep.",
        "Draw the BFS tree to see why paths are guaranteed to be shortest in unweighted graphs.",
        "This idea generalizes to grid-based pathfinding and many puzzle-style problems."
      ]
    }),
    createTask({
      id: "graph-05-grid-bfs",
      title: "Grid BFS for Maze or Game Maps",
      type: "visualize",
      estimatedMinutes: minutes(55),
      description:
        "Apply BFS on a 2D grid to solve a simple maze. Use the grid algorithms from the " +
        "algorithms-pack (if present) or implement your own using up/down/left/right moves.",
      checklist: [
        "Represent a small grid where 0 = free cell and 1 = wall.",
        "Implement BFS that moves in four directions and avoids walls.",
        "Mark visited cells and store parent pointers for path reconstruction.",
        "Print or visualize the final path from start to goal.",
        "Experiment with different obstacle layouts and observe BFS behavior."
      ],
      tips: [
        "Relate each grid cell to a node in an implicit graph.",
        "Remember to check bounds before accessing grid cells.",
        "This pattern is widely used in competitive programming and game development.",
        "BFS on grids is a great stepping stone to more complex state-space searches."
      ]
    }),
    createTask({
      id: "graph-06-summary",
      title: "Graph Traversal Summary",
      type: "refactor",
      estimatedMinutes: minutes(30),
      description:
        "Summarize the differences between BFS and DFS, their time/space complexity, and " +
        "common problem patterns where each shines.",
      checklist: [
        "Compare queue vs stack behavior for BFS and DFS.",
        "Document memory usage differences on wide vs deep graphs.",
        "List problem archetypes where BFS is usually preferred.",
        "List problem archetypes where DFS is usually preferred.",
        "Include at least one concrete example for each archetype."
      ],
      tips: [
        "Use the same example graphs when describing BFS and DFS for easier comparison.",
        "Think about recursion limits when recommending DFS.",
        "Remember that both BFS and DFS are O(V + E) for adjacency list representations.",
        "Use this summary as a reference when studying more advanced algorithms like Dijkstra or A*."
      ]
    })
  ],
  suggestedOrderNotes:
    "Focus first on understanding representations, then master BFS and DFS. Only after that " +
    "should you attempt grid-based BFS or more advanced shortest-path algorithms."
};

/**
 * DYNAMIC PROGRAMMING STUDY TRACK
 * Focus: identifying overlapping subproblems, defining states and transitions,
 * and building up solutions from base cases.
 */
export const dynamicProgrammingStudyTrack: StudyTrack = {
  id: "dp-foundations",
  title: "Dynamic Programming Foundations",
  level: "advanced",
  category: "dynamic-programming",
  overview:
    "This track is a guided path through classic dynamic programming problems. " +
    "It emphasizes the process: from brute force recursion to memoization and bottom-up DP.",
  goals: [
    "Learn to identify overlapping subproblems and optimal substructure.",
    "Practice writing recursive solutions before optimizing them.",
    "Become fluent in converting top-down memoization to bottom-up tables.",
    "Understand common DP patterns (1D, 2D, combinatorial counting, path problems)."
  ],
  prerequisites: [
    "Strong comfort with recursion and iterative loops.",
    "Familiarity with graphs and basic search.",
    "Patience to work through problems step-by-step."
  ],
  tasks: [
    createTask({
      id: "dp-01-fibonacci",
      title: "From Naive Recursion to Memoization: Fibonacci",
      type: "implement",
      estimatedMinutes: minutes(40),
      description:
        "Use Fibonacci as a miniature lab: start with the naive recursive implementation, " +
        "measure its behavior, then add memoization and compare.",
      checklist: [
        "Implement naive recursive Fibonacci and test for small n.",
        "Instrument the implementation to count recursive calls.",
        "Add memoization using a dictionary or array.",
        "Re-run experiments and compare call counts.",
        "Reflect on how caching trades memory for time."
      ],
      tips: [
        "Even though Fibonacci is overused, it is an excellent micro-example to practice DP steps.",
        "Make the cost of naive recursion painfully clear by logging calls.",
        "Memoization is conceptually simple: just remember results.",
        "This pattern generalizes to many harder problems."
      ]
    }),
    createTask({
      id: "dp-02-grid-paths",
      title: "Counting Paths in a Grid",
      type: "visualize",
      estimatedMinutes: minutes(55),
      description:
        "Use dynamic programming to count paths in an m x n grid moving only right or down. " +
        "Explore both recursive and tabulation-based solutions.",
      checklist: [
        "Write a recursive function countPaths(r, c) with base cases on borders.",
        "Add memoization to avoid recomputing subproblems.",
        "Create a 2D dp table and fill it iteratively.",
        "Print the table to see how values propagate.",
        "Relate the table to Pascal's triangle or combinatorics."
      ],
      tips: [
        "This is a classic DP problem; draw the grid and arrows to visualize dependencies.",
        "Note that each cell depends only on the cell above and to the left.",
        "Once you see the pattern, the iterative solution is usually simpler and faster.",
        "Try obstacles later to connect with BFS on grids."
      ]
    }),
    createTask({
      id: "dp-03-knapsack",
      title: "0/1 Knapsack Intuition",
      type: "analyze",
      estimatedMinutes: minutes(70),
      description:
        "Study the 0/1 Knapsack problem and build a DP table that shows how capacity and items " +
        "drive the choice to take or skip each item.",
      checklist: [
        "Define the state clearly: dp[i][w] = best value using first i items and capacity w.",
        "Derive the recurrence relation for taking vs skipping an item.",
        "Hand-fill a small DP table on paper.",
        "Implement the iterative solution in the Playground.",
        "Optionally, reconstruct the list of chosen items from the table."
      ],
      tips: [
        "Spend extra time on the recurrence; everything else follows from it.",
        "Don't worry about optimization (like 1D DP) at first.",
        "Use small numbers for weights and values when debugging.",
        "Draw arrows in the table to show where each value came from."
      ]
    }),
    createTask({
      id: "dp-04-edit-distance",
      title: "Edit Distance (Levenshtein) Table Walkthrough",
      type: "visualize",
      estimatedMinutes: minutes(80),
      description:
        "Build the DP table for edit distance between two short strings. Understand how insertion, " +
        "deletion, and substitution correspond to neighboring cells.",
      checklist: [
        "Define dp[i][j] as the edit distance between prefixes s[0..i) and t[0..j).",
        "Write the recurrence considering insertion, deletion, and substitution.",
        "Hand-compute the table for two words (e.g. kitten → sitting).",
        "Implement the table-based algorithm in the Playground.",
        "Highlight the path of operations that leads to the minimum edit distance."
      ],
      tips: [
        "Indexing is critical here; be explicit about what i and j mean.",
        "Use an extra row and column in the table for empty prefixes.",
        "Visualizing the table as a grid of costs helps internalize the algorithm.",
        "This is a powerful pattern for many string transformation problems."
      ]
    }),
    createTask({
      id: "dp-05-patterns",
      title: "Identify DP Patterns Across Problems",
      type: "refactor",
      estimatedMinutes: minutes(45),
      description:
        "Group the DP problems you have solved into patterns: linear sequence DP, grid DP, " +
        "subset DP, and string alignment. Create a short catalog.",
      checklist: [
        "List all DP problems you implemented in this track.",
        "Assign each problem to one or more pattern categories.",
        "Identify recurring design steps (define state, write recurrence, base cases, iteration order).",
        "Write a checklist you can reuse for new DP problems.",
        "Note at least one mistake you made and how to avoid it next time."
      ],
      tips: [
        "Patterns are more important than memorizing specific solutions.",
        "Over time, you will recognize new problems as variations of old ones.",
        "Use your catalog as a quick-start guide for future DP exercises.",
        "Revisit this document after every new DP problem you solve."
      ]
    })
  ],
  suggestedOrderNotes:
    "Start with Fibonacci and grid paths to build intuition for memoization and table filling. " +
    "Move to knapsack and edit distance only when comfortable with simpler examples. " +
    "Always try to write the recurrence on paper before coding."
};

/**
 * Export a convenience list of all study tracks. This can be used
 * by a future UI page like /study or integrated into the docs page.
 */
export const allStudyTracks: StudyTrack[] = [
  sortingStudyTrack,
  searchingStudyTrack,
  graphStudyTrack,
  dynamicProgrammingStudyTrack
];
