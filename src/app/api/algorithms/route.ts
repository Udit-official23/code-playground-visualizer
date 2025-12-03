// src/app/api/algorithms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ALGORITHMS } from "@/lib/algorithms";
import type { Language } from "@/lib/types";

export const runtime = "nodejs";

type LanguageFilter = Language | "all";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const search = url.searchParams.get("search")?.toLowerCase().trim() ?? "";
  const category = url.searchParams.get("category") ?? "all";
  const difficulty = url.searchParams.get("difficulty") ?? "all";
  const languageParam = (url.searchParams.get("language") ?? "all") as LanguageFilter;

  const limitParam = url.searchParams.get("limit");
  const offsetParam = url.searchParams.get("offset");

  const limit =
    limitParam && !Number.isNaN(Number(limitParam))
      ? Math.min(100, Math.max(1, Number(limitParam)))
      : 100;

  const offset =
    offsetParam && !Number.isNaN(Number(offsetParam))
      ? Math.max(0, Number(offsetParam))
      : 0;

  const filtered = ALGORITHMS.filter((algo) => {
    // category filter
    if (category !== "all" && algo.category !== category) return false;

    // difficulty filter
    if (difficulty !== "all" && algo.difficulty !== difficulty) return false;

    // language filter
    if (languageParam !== "all" && !algo.languages.includes(languageParam)) {
      return false;
    }

    // text search (title, shortDescription, tags)
    if (search) {
      const haystack = [
        algo.title,
        algo.shortDescription,
        algo.description ?? "",
        (algo.tags ?? []).join(" "),
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    return true;
  });

  const total = filtered.length;
  const slice = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    total,
    limit,
    offset,
    count: slice.length,
    algorithms: slice.map((algo) => ({
      id: algo.id,
      name: algo.name,
      title: algo.title,
      category: algo.category,
      difficulty: algo.difficulty,
      timeComplexity: algo.timeComplexity,
      spaceComplexity: algo.spaceComplexity,
      tags: algo.tags,
      languages: algo.languages,
      shortDescription: algo.shortDescription,
    })),
  });
}
