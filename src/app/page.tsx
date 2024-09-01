import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const featureCards = [
  {
    title: "Multi-language Playground",
    desc: "Write and run code in JavaScript and Python with a single click.",
  },
  {
    title: "Step-by-step Traces",
    desc: "See how variables, stack frames, and control flow evolve over time.",
  },
  {
    title: "Algorithm Visualizations",
    desc: "Watch arrays, trees, and graphs transform in real-time.",
  },
  {
    title: "Performance Insights",
    desc: "Measure execution time and complexity with input-size experiments.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 md:grid-cols-[3fr,2fr] items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-emerald-300">
            Code Playground & Algorithm Visualizer
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            Understand your code visually — from{" "}
            <span className="text-emerald-400">single lines</span> to{" "}
            <span className="text-emerald-400">full algorithms</span>.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-slate-300">
            Paste your code, run it safely in a sandbox, and watch step-by-step
            execution, data-structure animations, and performance charts. Built
            for teaching, debugging, and AI-assisted code analysis.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/playground">Open Playground</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/library">Browse Algorithm Library</Link>
            </Button>
          </div>

          <p className="text-[11px] text-slate-500">
            Modular architecture • Ready for AI integration • Clean TypeScript codebase
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>playground.ts</span>
            <span>javascript • sandbox</span>
          </div>
          <div className="rounded-xl bg-slate-950/70 p-3 text-[11px] font-mono text-slate-200">
            <pre className="whitespace-pre-wrap">
{`function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`}
            </pre>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            Coming up next: visual trace of mid, lo, hi pointers and comparison steps.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {featureCards.map((f) => (
          <Card key={f.title} className="border-slate-800 bg-slate-900/60">
            <CardHeader>
              <CardTitle className="text-sm text-slate-100">
                {f.title}
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400">
                {f.desc}
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </section>
    </div>
  );
}
