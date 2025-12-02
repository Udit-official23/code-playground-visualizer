🧠 Code Playground Visualizer
A Modern Algorithm Execution Engine with Realtime Trace, Visualizers, Benchmarks & Snippets

A 20k+ LOC TypeScript project featuring full frontend + backend logic, algorithm packs, performance engine, and developer tools.

📌 Overview

Code Playground Visualizer is a high-performance, fully interactive platform for:

Executing user-written algorithms

Rendering step-by-step traces

Visualizing arrays, trees, graphs, DP grids

Benchmarking performance (time & memory)

Exploring a massive library of algorithms, templates, and code snippets

Built using Next.js 14 + TypeScript, with modular algorithm packs, snippet generators, and utility engines.

🚀 Key Features
🔥 1. Realtime Code Execution Engine

Sandbox runtime

Captures logs, errors, return values

Generates execution trace steps

🎨 2. Advanced Visualizers

Array visualizer

Tree / BST visualizer

Graph traversal visualizer

Grid (DP/Table) visualizer

Pointer & index animations

📦 3. 250+ Algorithms Included

Organized inside src/lib/algorithms-pack:

Sorting (QuickSort, MergeSort, HeapSort, etc.)

Searching (Binary Search variations, Jump Search, etc.)

Graph Algorithms (BFS, DFS, Dijkstra, A*, Topo Sort…)

DP Problems (Knapsack, LCS, Edit Distance…)

Math utilities

String algorithms (KMP, Rabin-Karp…)

⚙️ 4. Developer Tools

Benchmark engine

Deep clone utilities

Random data generators

Huge snippet library (arrays, strings, DP templates, trees, interview problems)

🔌 5. Backend API Included

API routes:

/api/execute — run code

/api/benchmark — performance test

/api/info — metadata, algorithm index

/api/health — uptime, status

📊 6. Performance Panel

Time taken

Memory usage

Step count

Complexity info from algorithm metadata

🗂️ Project Structure
src/
├── app/
│   ├── playground/         # Main code editor + visualizer
│   ├── library/            # Algorithm library UI
│   ├── api/
│   │   ├── execute/route.ts
│   │   ├── benchmark/route.ts
│   │   ├── health/route.ts
│   │   └── info/route.ts
│   ├── architecture/page.tsx
│   └── changelog/page.tsx
│
├── lib/
│   ├── algorithms.ts       # Central registry
│   ├── algorithms-pack/    # Sorting, DP, Graph, Math, Trees...
│   └── snippets/           # Arrays, Trees, DP templates, Interview problems
│
├── utils/
│   ├── benchmarks.ts
│   ├── deepClone.ts
│   └── dataGenerators.ts
│
└── components/
    ├── playground/
    ├── visualizers/
    ├── ui/
    └── layout/

📥 Installation
1. Clone the repository
git clone https://github.com/yourusername/code-playground-visualizer.git
cd code-playground-visualizer

2. Install dependencies
npm install

3. Run locally
npm run dev

4. Build production
npm run build
npm start

🌐 API Documentation
▶️ Run Code

POST /api/execute

{
  "code": "function test(){ return 5; }",
  "input": [1,2,3],
  "language": "javascript"
}

⚡ Benchmark Algorithm

POST /api/benchmark

{
  "algorithmId": "merge-sort",
  "inputSize": 10000
}

📚 Fetch Metadata

GET /api/info

📘 Algorithms & Snippets

This project contains:

Category	Count
Sorting Algorithms	40+
Searching Algorithms	20+
Graph Algorithms	40+
Dynamic Programming	50+
Math Utilities	25+
String Algorithms	30+
Tree Algorithms	40+
Interview Snippets	100+
DP Templates	30+

Total: 250+ fully documented algorithms

🎯 Roadmap
✔️ Completed

Execution sandbox

Visualizers

Benchmarking

Algorithm metadata engine

20k+ LOC library

Snippet system

🔜 Coming Soon

Cloud execution engine

Tabbed playground

Shareable code links

AI-assisted code explanation

Full algorithm docs site

🛡 License

MIT License — free for personal and commercial use.

🤝 Contributing

Fork, PR, or request new algorithm packs.
Feel free to open issues for bugs or feature requests.

⭐ Support the Project

If this project helped you, give a star ⭐ on GitHub — it motivates continued development!