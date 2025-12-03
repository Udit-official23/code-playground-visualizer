// src/app/algorithms/[id]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ALGORITHMS } from "@/lib/algorithms";
import { getAlgorithmCode } from "@/lib/algorithmCode";
import type { Language } from "@/lib/types";


type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AlgorithmDetailPage({ params }: PageProps) {
  // ✅ unwrap the params Promise
  const { id } = await params;

  const algo = ALGORITHMS.find((a) => a.id === id);

  if (!algo) {
    return notFound();
  }

  const jsCode =
    getAlgorithmCode(algo.id, "javascript" as Language) ??
    "// JavaScript template not available yet for this algorithm.";
  const pyCode =
    getAlgorithmCode(algo.id, "python" as Language) ??
    "# Python template not available yet for this algorithm.";

  const defaultLang: Language =
    (algo.languages?.[0] as Language | undefined) ?? "javascript";

  const complexity =
    algo.complexity ?? {
      best: "—",
      average: "—",
      worst: "—",
      space: "—",
    };

  const tags: string[] = algo.tags ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header / Breadcrumb-ish */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">
            Algorithm
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            {algo.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <Badge variant="outline" className="border-slate-700 text-slate-200">
              {algo.category}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-700 text-slate-200"
            >
              Difficulty: {algo.difficulty}
            </Badge>
            {algo.languages?.length ? (
              <span>
                Languages:{" "}
                <span className="font-mono text-emerald-300">
                  {algo.languages.join(", ").toUpperCase()}
                </span>
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/playground?algo=${encodeURIComponent(
              algo.id
            )}&lang=${defaultLang}`}
          >
            <Button size="sm" variant="primary">
              Open in Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="ghost">
              Back to Library
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
        {/* Left: Description + Complexity */}
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-950/70">
            <CardHeader>
              <CardTitle className="text-xs text-slate-200">
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[12px] text-slate-200">
              <p className="text-slate-300">
                {algo.description ??
                  "This algorithm is part of the Code Playground & Algorithm Visualizer library. It comes with ready-to-run code templates, synthetic traces for visualization, and optional performance benchmarks."}
              </p>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-slate-700 text-[10px] text-slate-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-950/70">
            <CardHeader>
              <CardTitle className="text-xs text-slate-200">
                Time & Space Complexity
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[12px] text-slate-200">
              <div className="overflow-hidden rounded-md border border-slate-800">
                <table className="min-w-full border-collapse text-left text-[12px]">
                  <thead className="bg-slate-900/80 text-slate-300">
                    <tr>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Case
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1">
                        Complexity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900/70">
                      <td className="px-2 py-1 text-slate-400">Best</td>
                      <td className="px-2 py-1">{complexity.best}</td>
                    </tr>
                    <tr className="border-b border-slate-900/70">
                      <td className="px-2 py-1 text-slate-400">Average</td>
                      <td className="px-2 py-1">{complexity.average}</td>
                    </tr>
                    <tr className="border-b border-slate-900/70">
                      <td className="px-2 py-1 text-slate-400">Worst</td>
                      <td className="px-2 py-1">{complexity.worst}</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-slate-400">Space</td>
                      <td className="px-2 py-1">{complexity.space}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {algo.notes && (
                <p className="mt-2 text-[11px] text-slate-400">
                  {algo.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Code Templates */}
        <Card className="border-slate-800 bg-slate-950/70">
  <CardHeader className="flex items-center justify-between">
    <CardTitle className="text-xs text-slate-200">
      Reference Implementation
    </CardTitle>
    <div className="flex items-center gap-2 text-[10px]">
      <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-300">
        JavaScript
      </span>
      <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-300">
        Python
      </span>
    </div>
  </CardHeader>
          <CardContent className="space-y-4 text-[11px]">
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-emerald-300">JavaScript</span>
                <span>Template used in Playground when opening in JS mode.</span>
              </div>
              <pre className="max-h-[220px] overflow-auto rounded-md border border-slate-800 bg-slate-950/80 p-2 text-[11px] text-slate-100">
                <code>{jsCode}</code>
              </pre>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-emerald-300">Python</span>
                <span>Template used in Playground when opening in Python mode.</span>
              </div>
              <pre className="max-h-[220px] overflow-auto rounded-md border border-slate-800 bg-slate-950/80 p-2 text-[11px] text-slate-100">
                <code>{pyCode}</code>
              </pre>
            </div>

            <p className="text-[10px] text-slate-500">
              To experiment interactively, use{" "}
              <span className="font-mono text-emerald-300">
                Open in Playground
              </span>{" "}
              above. There you can see stdout, traces, visualizations, and
              performance benchmarks (where available).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
