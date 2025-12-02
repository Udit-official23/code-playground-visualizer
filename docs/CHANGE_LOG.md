All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog
and this project adheres to Semantic Versioning.

🚀 [1.5.0] – 2025-02-02
Added

Added Trees Algorithms Pack (trees.ts) with ~900+ LOC of traversal, balancing, path algorithms.

Added Interview Problems Pack (interviewProblems.ts) containing 50+ curated real-world challenges.

Added Dynamic Programming Templates Pack (dynamicProgTemplates.ts) with reusable DP scaffolds.

Added backend route /api/info for project metadata aggregation.

Integrated new algorithms into the Library, Playground, and Performance Benchmarks.

Changed

Optimized algorithm loading to support 20k+ LOC scale.

Improved sidebar navigation responsiveness on small screens.

Updated algorithm metadata types for better consistency across packs.

Fixed

Fixed multiple AlgorithmMeta schema validation issues across packs.

Resolved sorting algorithm name/description schema mismatch.

Fixed imports and export types across the new packs.

🔥 [1.4.0] – 2025-02-01
Added

Added Graphs Algorithms Pack with BFS/DFS, Shortest Path, MST, and Flow algorithms.

Added 600+ LOC for visualization helpers and new trace instructions.

Benchmarks now support graph-based input generator presets.

Improved /api/benchmark to auto-scale test sizes for complex algorithms.

Changed

Improved memory snapshot visualizer to support graph adjacency lists and matrices.

Updated route handlers to normalize algorithm categories.

Fixed

Fixed incorrect trace highlighting for multi-level graph steps.

Patched boundary conditions in BFS/DFS mock visualizer.

⚙️ [1.3.0] – 2025-01-31
Added

Added Searching Algorithms Pack (Linear, Binary, Ternary, Interpolation, Exponential, Jump Search).

New visualizer for binary search tree tracing.

/api/execute now supports safe code fencing & multiline tracing.

Changed

Major refactor of Playground layout to support the Insights Panel.

Rewrote tab system for better performance.

Fixed

Corrected category mapping issue in Library page.

Fixed sandbox error propagation that caused silent failures.

📦 [1.2.0] – 2025-01-30
Added

Added Sorting Algorithms Pack with Bubble, Merge, Quick, Heap, Radix, TimSort, etc.

1000+ LOC of trace-explain steps for pedagogical visualization.

Added trace-step highlighting & diff engine for arrays.

Added /api/benchmark endpoint for performance charts.

Changed

Improved algorithm metadata structure (name, complexity, tags, languages).

UI polish: badges, tags, difficulty indicators.

Fixed

Fixed render loops in array visualizer.

Fixed unclosed JSX tags in the Playground.

🧩 [1.1.0] – 2025-01-29
Added

Added Code Execution Sandbox for JavaScript.

Added /api/execute endpoint with tracing and stdout capture.

Execution Insights Panel introduced (Trace, Output, Visualization, Performance).

Library Page filtering (by difficulty, category, language).

Changed

Improved Monaco Editor theme + added multi-language placeholder support.

Fixed

Patched async handling issues in the JavaScript runner.

Fixed UI freeze from heavy traces.

🎉 [1.0.0] – 2025-01-28
Initial Release

Project initialized with Next.js 14 App Router.

Basic Playground with Monaco Editor.

Initial components system (Button, Card, Tabs, etc.).

Setup of folder structure under src/app, src/lib, and src/components.

Configured Tailwind, Prettier, ESLint, and project build pipeline.

Added homepage, docs page, and early architecture documentation.