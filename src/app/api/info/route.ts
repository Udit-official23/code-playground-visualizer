// src/app/api/info/route.ts
import { NextResponse } from "next/server";
import { ALGORITHMS } from "@/lib/algorithms";
import type { Language } from "@/lib/types";

/**
 * Returns high-level metadata about the playground:
 * number of algorithms, supported languages, and some flags.
 */
export async function GET() {
  const totalAlgorithms = ALGORITHMS.length;

  const allLanguages = new Set<Language>();
  ALGORITHMS.forEach((algo) => {
    algo.languages.forEach((lang) => {
      allLanguages.add(lang as Language);
    });
  });

  const categories = new Set<string>();
  ALGORITHMS.forEach((algo) => categories.add(String(algo.category)));

  const now = new Date();

  return NextResponse.json({
    name: "Code Playground & Algorithm Visualizer",
    version: "0.3.0",
    lastUpdated: now.toISOString(),
    algorithms: {
      total: totalAlgorithms,
      categories: Array.from(categories).sort(),
    },
    languages: {
      total: allLanguages.size,
      list: Array.from(allLanguages),
    },
    features: {
      playground: true,
      algorithmLibrary: true,
      visualizers: {
        array: true,
        graphDemo: true,
      },
      performanceBenchmarks: true,
      runHistory: true,
    },
  });
}
