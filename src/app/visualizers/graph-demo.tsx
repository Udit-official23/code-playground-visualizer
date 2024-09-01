// src/app/visualizers/graph-demo/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraphVisualizer,
  type GraphNode,
  type GraphEdge,
  type GraphStep,
} from "@/components/visualizers/GraphVisualizer";

const demoNodes: GraphNode[] = [
  { id: "A", label: "A", x: 50, y: 18 },
  { id: "B", label: "B", x: 25, y: 40 },
  { id: "C", label: "C", x: 75, y: 40 },
  { id: "D", label: "D", x: 20, y: 65 },
  { id: "E", label: "E", x: 45, y: 65 },
  { id: "F", label: "F", x: 80, y: 65 },
];

const demoEdges: GraphEdge[] = [
  { id: "A-B", from: "A", to: "B" },
  { id: "A-C", from: "A", to: "C" },
  { id: "B-D", from: "B", to: "D" },
  { id: "B-E", from: "B", to: "E" },
  { id: "C-F", from: "C", to: "F" },
];

const bfsSteps: GraphStep[] = [
  {
    step: 1,
    description:
      "Initialize BFS at node A. Mark A as visited and place it in the initial frontier.",
    visitedNodeIds: ["A"],
    frontierNodeIds: ["A"],
    currentNodeId: "A",
  },
  {
    step: 2,
    description:
      "Dequeue A from the frontier. Inspect neighbors B and C. Mark them visited and add them to the frontier.",
    visitedNodeIds: ["A", "B", "C"],
    frontierNodeIds: ["B", "C"],
    currentNodeId: "A",
  },
  {
    step: 3,
    description:
      "Dequeue B. Visit its neighbors D and E. Mark them visited and add them to the frontier behind C.",
    visitedNodeIds: ["A", "B", "C", "D", "E"],
    frontierNodeIds: ["C", "D", "E"],
    currentNodeId: "B",
  },
  {
    step: 4,
    description:
      "Dequeue C. Visit neighbor F. Mark F visited and add it to the frontier.",
    visitedNodeIds: ["A", "B", "C", "D", "E", "F"],
    frontierNodeIds: ["D", "E", "F"],
    currentNodeId: "C",
  },
  {
    step: 5,
    description:
      "Dequeue D and E. They have no new neighbors; traversal continues with F.",
    visitedNodeIds: ["A", "B", "C", "D", "E", "F"],
    frontierNodeIds: ["F"],
    currentNodeId: "D",
  },
  {
    step: 6,
    description:
      "Dequeue F. BFS traversal is complete: all reachable nodes from A have been visited.",
    visitedNodeIds: ["A", "B", "C", "D", "E", "F"],
    frontierNodeIds: [],
    currentNodeId: "F",
  },
];

export default function GraphDemoPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Visualizers
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Graph Visualizer Demo
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            This page showcases a simple graph visualizer used for breadth-first
            search (BFS) style traces. Nodes, edges, and traversal steps are
            described explicitly so the visualizer is easy to reuse for other
            algorithms or tutorials.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="secondary">
              Algorithm Library
            </Button>
          </Link>
          <Link href="/architecture">
            <Button size="sm" variant="ghost">
              Architecture Overview
            </Button>
          </Link>
        </div>
      </section>

      {/* Visualizer Card */}
      <section>
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              BFS Traversal from Node A
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[11px] text-slate-200">
            <p className="text-[11px] text-slate-400">
              Use the Prev / Play / Next controls under the header to step
              through the BFS traversal. The legend explains the colors:
              visited nodes in green, frontier in blue, and the current node in
              amber.
            </p>
            <GraphVisualizer
              title="Breadth-First Search (BFS) Demo"
              nodes={demoNodes}
              edges={demoEdges}
              steps={bfsSteps}
              autoPlay={false}
              autoPlayDelayMs={1100}
            />
          </CardContent>
        </Card>
      </section>

      {/* Explanation card */}
      <section>
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              How to Reuse This Visualizer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[11px] text-slate-300">
            <p>
              The <span className="font-mono text-emerald-300">GraphVisualizer</span>{" "}
              is intentionally decoupled from the rest of the playground. It
              accepts explicit <span className="font-mono">nodes</span>,{" "}
              <span className="font-mono">edges</span>, and{" "}
              <span className="font-mono">steps</span>, which means you can:
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Drive it from synthetic traces (like the demo on this page).
              </li>
              <li>
                Connect it to real trace data emitted by a BFS/DFS runner for
                specific graphs.
              </li>
              <li>
                Embed it in other pages or documentation sections as an
                interactive teaching aid.
              </li>
            </ul>
            <p>
              In a future iteration, this visualizer can be wired directly to
              playground traces for graph algorithms, similar to how the
              <span className="font-mono text-emerald-300"> ArrayVisualizer</span>{" "}
              is wired for sorting algorithms.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
