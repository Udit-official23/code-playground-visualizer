# Code Playground & Algorithm Visualizer

A modern web app built with **Next.js 14** for exploring code execution, visualizing algorithms, and benchmarking performance.

Users can:

- Paste code in a multi-language **Playground** (JavaScript + Python UI)
- Run code and inspect **stdout / stderr / duration**
- See **step-by-step traces** for supported algorithms
- View **data-structure animations** via a visualizer
- Run **performance benchmarks** for algorithms (e.g., Bubble Sort)
- Save / restore **Playgrounds** locally
- Review **Run History** and restore past runs
- Customize **editor settings** (font-size, minimap, wrap, theme)
- Download the current code buffer as a `.js` / `.py` file

---

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **UI:** Tailwind CSS + custom UI components (Button, Card, Tabs, etc.)
- **Editor:** Monaco Editor (VS Code engine)
- **Language Runtime:**
  - JavaScript: Node `vm` sandbox (`node:vm`)
  - Python: UI support (execution stubbed / pluggable)
- **State / Storage:**
  - React hooks + local state
  - `localStorage` for:
    - Saved playgrounds
    - Run history
    - Editor settings

---

## Core Features

### 1. Interactive Playground

Route: `/playground`

- Code editor powered by **Monaco**.
- Language toggle: **JavaScript / Python**.
- Actions:
  - **Run Code** → POST `/api/execute`
  - **Save** → Saves to `localStorage` with title, language, code, algoId
  - **Download** → Downloads current buffer as `<algoId>.js` or `playground.js/.py`
  - **Settings**:
    - Font size
    - Word wrap (on/off)
    - Minimap (on/off)
    - Theme (`vs-dark` / `vs-light`)

#### Run Output

- **stdout / stderr** section with duration in ms.
- Errors shown in stderr and surfaced in the UI.

#### Trace View

- For supported algorithms, the backend generates a **trace**:

  ```ts
  interface TraceStep {
    step: number;
    description: string;
    currentLine: number;
    frames: any[];
    stdout: string;
    arraySnapshot?: number[];
    highlightedIndices?: number[];
  }

Each step is rendered as a card with:

Step #

Line #

Description

2. Visualizer

Tab: Visualizer (in the Execution Insights card on the right)

Component: ArrayVisualizer

Consumes TraceStep[] from the backend.

For algorithms that provide arraySnapshot + highlightedIndices, it renders:

Bars representing the array/queue contents

Highlighted bars for the active elements / indices

Works for:

Bubble Sort (sorting animation)

Binary Search (pointers lo / mid / hi)

BFS (queue evolution)

3. Algorithm Library

Route: /library

Browse a curated list of algorithms with metadata:

Name

Category (Sorting, Searching, Graph, etc.)

Difficulty

Language availability

Each algorithm card has “Open in Playground”:

Navigates to /playground?algo=<id>&lang=<language>

Pre-loads a language-specific code template from lib/algorithmCode.ts

Hooks into the execution engine using algoId

Currently wired algorithms include (JavaScript templates):

bubble-sort

binary-search

bfs

(Easily extendable via algorithms.ts + algorithmCode.ts)

4. Execution Engine (JavaScript)

File: src/lib/execution/javascriptRunner.ts

Uses Node’s vm module to run untrusted JS snippets in a constrained sandbox:

import vm from "node:vm";

const context = vm.createContext({
  console: { log, error, warn },
  global: sandbox,
});

const script = new vm.Script(code, { filename: "user-code.js" });
script.runInContext(context, { timeout: MAX_EXECUTION_MS });


Captures:

stdoutLines from console.log

stderrLines from console.error / console.warn

durationMs using Date.now() before/after execution

Synthetic Traces

To support visualizations, the runner generates synthetic traces for known algorithm IDs:

bubble-sort → generateBubbleSortTrace(DEFAULT_TRACE_INPUT)

binary-search → generateBinarySearchTrace(DEFAULT_BINARY_SEARCH_INPUT, DEFAULT_BINARY_TARGET)

bfs → generateBfsTrace(DEFAULT_BFS_GRAPH, DEFAULT_BFS_START)

This means:

User code still runs in the sandbox.

Visualizer uses a curated, deterministic trace that’s independent of user mistakes.

Adding a new algorithm is as simple as:

Adding a generate<Algo>Trace() function

Wiring it into runJavascript under the appropriate algoId

5. Performance Benchmarks

Route: /api/benchmark
Used by: Performance tab in Playground

File: src/app/api/benchmark/route.ts

Currently benchmarks Bubble Sort in JavaScript:

Input sizes: [10, 50, 100, 200, 400, 800]

Multiple runs per size (e.g., 3–5) with average duration.

Response shape:

interface BenchmarkPoint {
  inputSize: number;
  durationMs: number;
}

interface BenchmarkResult {
  algoId: string;
  language: Language;
  points: BenchmarkPoint[];
}


Front-end UI:

Shows a table:

| n (input size) | avg time (ms) |

Only enabled for:

language === "javascript"

algoId === "bubble-sort" (for now)

Easy to extend for other algorithms or languages.

6. Run History

Hook: src/hooks/useRunHistory.ts
Tab: History (right-hand panel)

Every run (success or failure) is stored in localStorage with:

interface RunHistoryEntry {
  id: string;
  createdAt: string;
  language: Language;
  algoId?: string;
  durationMs: number;
  success: boolean;
  stdoutPreview: string;
  stderrPreview: string;
  codeSnapshot: string;
}


UI shows:

Status badge (Success / Failed)

Language

AlgoId (if present)

Timestamp

Duration

Preview of stdout/stderr

Restore button:

Loads codeSnapshot back into the editor

Switches language accordingly

Clear button:

Clears the entire history from localStorage

7. Saved Playgrounds

Hook: src/hooks/useLocalPlaygrounds.ts
UI: Card under Playground (if there are any saved entries)

Saves entries to localStorage with:

title

language

code

algoId

createdAt / updatedAt

UI:

Lists saved playgrounds sorted by updatedAt (desc)

Shows language, algo link info, and timestamp

Click → loads into editor

Delete button with confirmation

8. Editor Settings

Hook: src/hooks/usePlaygroundSettings.ts
UI: Settings button in Playground header

Stored in localStorage as cp_playground_settings_v1:

fontSize (10–24)

wordWrap (on / off)

minimap (true / false)

editorTheme (vs-dark / vs-light)

Settings are applied directly to the Monaco Editor via its options & theme props.

Project Structure (High-Level)
src/
  app/
    page.tsx                # Landing / home
    playground/
      page.tsx              # Main playground UI
    library/
      page.tsx              # Algorithm library UI
    api/
      execute/
        route.ts            # Code execution endpoint
      benchmark/
        route.ts            # Performance benchmark endpoint
  components/
    ui/
      button.tsx
      card.tsx
      tabs.tsx
      ...                   # Other UI primitives
    visualizers/
      ArrayVisualizer.tsx   # Array/queue-based visualizer
  hooks/
    useLocalPlaygrounds.ts  # Saved playgrounds
    useRunHistory.ts        # Run history
    usePlaygroundSettings.ts# Editor settings
  lib/
    types.ts                # Shared types (ExecutionResult, TraceStep, etc.)
    execution/
      javascriptRunner.ts   # JS execution + synthetic trace generators
    algorithmCode.ts        # Language-specific template code per algo
    algorithms.ts           # Algorithm catalog metadata


(Exact paths may differ slightly depending on your final repo layout.)

Getting Started
Prerequisites

Node.js 18+

npm / pnpm / yarn (example uses npm)

Installation
git clone <your-repo-url>.git
cd code-playground-visualizer

npm install

Development
npm run dev


Then open:
http://localhost:3000

Build
npm run build
npm run start