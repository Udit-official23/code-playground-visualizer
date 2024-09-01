// src/components/visualizers/GraphVisualizer.tsx
"use client";

import { useMemo, useState, useEffect } from "react";

export type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
};

export type GraphStep = {
  step: number;
  description: string;
  visitedNodeIds: string[];
  frontierNodeIds: string[];
  currentNodeId?: string;
};

export interface GraphVisualizerProps {
  title?: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  steps: GraphStep[];
  autoPlay?: boolean;
  autoPlayDelayMs?: number;
}

/**
 * GraphVisualizer
 *
 * A minimal 2D graph viewer for BFS/DFS-style traces. It renders nodes and
 * edges in a fixed coordinate system, highlights visited/frontier nodes,
 * and can autoplay through GraphStep items with Next/Previous controls.
 */
export function GraphVisualizer({
  title = "Graph Visualizer",
  nodes,
  edges,
  steps,
  autoPlay = false,
  autoPlayDelayMs = 1000,
}: GraphVisualizerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const clampedIndex = useMemo(() => {
    if (steps.length === 0) return 0;
    if (currentStepIndex < 0) return 0;
    if (currentStepIndex >= steps.length) return steps.length - 1;
    return currentStepIndex;
  }, [currentStepIndex, steps.length]);

  const activeStep = steps[clampedIndex] ?? null;

  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;

    const id = window.setTimeout(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          // Loop back to the beginning
          return 0;
        }
        return next;
      });
    }, autoPlayDelayMs);

    return () => window.clearTimeout(id);
  }, [isPlaying, steps.length, autoPlayDelayMs, clampedIndex]);

  function goTo(index: number) {
    if (steps.length === 0) return;
    setCurrentStepIndex(Math.min(Math.max(index, 0), steps.length - 1));
  }

  function next() {
    goTo(clampedIndex + 1);
  }

  function previous() {
    goTo(clampedIndex - 1);
  }

  const visitedSet = new Set(activeStep?.visitedNodeIds ?? []);
  const frontierSet = new Set(activeStep?.frontierNodeIds ?? []);
  const currentId = activeStep?.currentNodeId;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-300">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold text-slate-100">{title}</p>
          <p className="text-[10px] text-slate-400">
            Step {steps.length === 0 ? 0 : clampedIndex + 1} of {steps.length}
          </p>
        </div>
        <div className="flex items-center gap-1 text-[10px]">
          <button
            type="button"
            onClick={previous}
            disabled={steps.length === 0}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-200 hover:border-emerald-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            disabled={steps.length === 0}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-200 hover:border-emerald-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={next}
            disabled={steps.length === 0}
            className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-200 hover:border-emerald-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
          >
            Next
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[10px] text-slate-300">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          Default
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Visited
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
          Frontier
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          Current
        </span>
      </div>

      {/* Canvas */}
      <div className="relative h-64 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        {/* Edges */}
        <svg className="absolute inset-0 h-full w-full">
          {edges.map((edge) => {
            const from = nodes.find((n) => n.id === edge.from);
            const to = nodes.find((n) => n.id === edge.to);
            if (!from || !to) return null;

            return (
              <line
                key={edge.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(148, 163, 184, 0.6)"
                strokeWidth={1.5}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        <div className="absolute inset-0">
          {nodes.map((node) => {
            const isVisited = visitedSet.has(node.id);
            const isFrontier = frontierSet.has(node.id);
            const isCurrent = node.id === currentId;

            let baseClass =
              "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[11px] font-semibold transition-transform duration-150 ";
            let colorClass =
              "border-slate-600 bg-slate-800 text-slate-100 shadow";

            if (isVisited) {
              colorClass =
                "border-emerald-400 bg-emerald-600 text-slate-900 shadow-[0_0_0_2px_rgba(16,185,129,0.6)]";
            }
            if (isFrontier) {
              colorClass =
                "border-sky-400 bg-sky-500 text-slate-900 shadow-[0_0_0_2px_rgba(56,189,248,0.6)]";
            }
            if (isCurrent) {
              colorClass =
                "border-amber-400 bg-amber-300 text-slate-900 shadow-[0_0_0_3px_rgba(251,191,36,0.8)] scale-105";
            }

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={baseClass + colorClass}
              >
                {node.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-md border border-slate-800 bg-slate-950/80 p-2 text-[11px] text-slate-200">
        {activeStep ? (
          <>
            <p className="font-semibold text-emerald-300">
              Step {activeStep.step}
            </p>
            <p className="mt-0.5 text-slate-200">{activeStep.description}</p>
          </>
        ) : (
          <p className="text-slate-500">
            No active step. Provide at least one GraphStep to see the traversal
            description here.
          </p>
        )}
      </div>
    </div>
  );
}
