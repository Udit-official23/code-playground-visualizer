"use client";

import { useRouter } from "next/navigation";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from "react";
import { ALGORITHMS, type AlgorithmCategory, type Difficulty } from "@/lib/algorithms";
import type { Language } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const categoryLabels: Record<AlgorithmCategory, string> = {
  sorting: "Sorting",
  searching: "Searching",
  graph: "Graph / Trees",
  "dynamic-programming": "Dynamic Programming",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const languageLabels: Record<Language, string> = {
  javascript: "JavaScript",
  python: "Python",
};

export default function LibraryPage() {
    const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AlgorithmCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [language, setLanguage] = useState<Language | "all">("all");

  const filtered = useMemo(() => {
    return ALGORITHMS.filter((algo: { title: string; tags: any[]; category: any; difficulty: any; languages: string | string[]; }) => {
      const matchesSearch =
        !search ||
        algo.title.toLowerCase().includes(search.toLowerCase()) ||
        algo.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = category === "all" || algo.category === category;
      const matchesDifficulty =
        difficulty === "all" || algo.difficulty === difficulty;
      const matchesLanguage =
        language === "all" || algo.languages.includes(language);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
    });
  }, [search, category, difficulty, language]);

  return (
  <div className="space-y-5">
    <header className="space-y-2">
      <h1 className="text-lg md:text-xl font-semibold text-slate-50">
        Algorithm Library
      </h1>
      <p className="text-xs text-slate-400 md:text-sm">
        Browse common algorithms with metadata about complexity, difficulty,
        and recommended inputs. Each entry can be opened in the playground and
        later connected to visual traces.
      </p>
    </header>

    {/* Filters */}
    <section className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 md:p-4">
      <div className="grid items-center gap-3 md:grid-cols-[2fr,2fr,2fr,2fr]">
        {/* Search */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Search
          </p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or tag…"
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Category
          </p>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={category === "all" ? "primary" : "ghost"}
              onClick={() => setCategory("all")}
            >
              All
            </Button>
            {(
              ["sorting", "searching", "graph", "dynamic-programming"] as AlgorithmCategory[]
            ).map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? "primary" : "ghost"}
                onClick={() => setCategory(cat)}
              >
                {categoryLabels[cat]}
              </Button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Difficulty
          </p>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={difficulty === "all" ? "primary" : "ghost"}
              onClick={() => setDifficulty("all")}
            >
              All
            </Button>
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={difficulty === d ? "primary" : "ghost"}
                onClick={() => setDifficulty(d)}
              >
                {difficultyLabels[d]}
              </Button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
            Language
          </p>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={language === "all" ? "primary" : "ghost"}
              onClick={() => setLanguage("all")}
            >
              All
            </Button>
            {(["javascript", "python"] as Language[]).map((lang) => (
              <Button
                key={lang}
                size="sm"
                variant={language === lang ? "primary" : "ghost"}
                onClick={() => setLanguage(lang)}
              >
                {languageLabels[lang]}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Result count */}
    <p className="text-[11px] text-slate-500">
      Showing{" "}
      <span className="font-semibold text-slate-200">
        {filtered.length}
      </span>{" "}
      algorithm{filtered.length === 1 ? "" : "s"}.
    </p>

    {/* Grid */}
    <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map((algo) => (
        <Card
          key={algo.id}
          className="border-slate-800 bg-slate-950/70 transition-colors hover:border-emerald-500/60 hover:bg-slate-950/90"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-sm text-slate-100">
                  {algo.title}
                </CardTitle>
                <CardDescription className="mt-1 text-[11px] text-slate-400">
                  {algo.shortDescription}
                </CardDescription>
              </div>
              <span
                className={
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                  (algo.difficulty === "easy"
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                    : algo.difficulty === "medium"
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                    : "bg-rose-500/10 text-rose-300 border border-rose-500/30")
                }
              >
                {difficultyLabels[algo.difficulty as Difficulty]}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Category + complexity */}
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
              <span className="rounded bg-slate-900 px-2 py-0.5">
                {categoryLabels[algo.category as AlgorithmCategory]}
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                Time: {algo.timeComplexity}
              </span>
              <span className="rounded bg-slate-900 px-2 py-0.5">
                Space: {algo.spaceComplexity}
              </span>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
              {algo.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded border border-slate-700 px-2 py-0.5"
                >
                  {languageLabels[lang as Language]}
                </span>
              ))}
            </div>

            {/* Recommended input */}
            <div>
              <p className="mb-1 text-[10px] text-slate-500">
                Recommended input
              </p>
              <pre className="whitespace-pre-wrap rounded bg-slate-950/80 p-2 text-[10px] text-slate-200">
                {algo.recommendedInput}
              </pre>
            </div>

            {/* Tags + actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap gap-1 text-[10px] text-slate-500">
                {algo.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-900 px-2 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
                {algo.tags.length > 3 && (
                  <span className="text-slate-600">
                    +{algo.tags.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-[11px]"
                  onClick={() => {
                    const preferredLang: Language =
                      language === "all"
                        ? ((algo.languages[0] as Language) || "javascript")
                        : (language as Language);

                    const params = new URLSearchParams();
                    params.set("algo", String(algo.id));
                    params.set("lang", preferredLang);

                    router.push(`/playground?${params.toString()}`);
                  }}
                >
                  Open in Playground
                </Button>

                <Link href={`/algorithms/${algo.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[11px]"
                  >
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  </div>
);
}
