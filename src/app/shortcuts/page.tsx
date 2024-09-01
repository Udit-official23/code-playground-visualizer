// src/app/shortcuts/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ShortcutGroup = {
  id: string;
  title: string;
  description: string;
  shortcuts: {
    keys: string;
    label: string;
    detail?: string;
  }[];
};

const shortcutGroups: ShortcutGroup[] = [
  {
    id: "navigation",
    title: "Navigation",
    description: "Move quickly between core sections of the app.",
    shortcuts: [
      {
        keys: "Alt + 1",
        label: "Go to Playground",
        detail: "Opens the Interactive Playground at /playground.",
      },
      {
        keys: "Alt + 2",
        label: "Open Algorithm Library",
        detail: "Browse algorithms and send them to the playground.",
      },
      {
        keys: "Alt + 3",
        label: "Open Docs",
        detail: "View high-level architecture and developer docs.",
      },
      {
        keys: "Alt + 4",
        label: "Open About / Overview",
        detail: "Read the product overview and feature highlights.",
      },
    ],
  },
  {
    id: "playground",
    title: "Playground Actions",
    description: "Shortcuts you are likely to use while iterating on code.",
    shortcuts: [
      {
        keys: "Ctrl + Enter",
        label: "Run Code",
        detail: "Triggers the same action as the Run Code button.",
      },
      {
        keys: "Ctrl + S",
        label: "Save Playground",
        detail: "Creates or updates a named playground in local storage.",
      },
      {
        keys: "Alt + L",
        label: "Switch Language",
        detail:
          "Toggles between JavaScript and Python tabs in the editor header.",
      },
      {
        keys: "Alt + H",
        label: "Focus History Tab",
        detail: "Opens the run history panel for quick inspection.",
      },
    ],
  },
  {
    id: "editor",
    title: "Editor & View",
    description: "Tweak how the editor feels without leaving the keyboard.",
    shortcuts: [
      {
        keys: "Ctrl + + / Ctrl + -",
        label: "Adjust Font Size",
        detail: "Zoom in or out in the editor for readability.",
      },
      {
        keys: "Ctrl + Shift + M",
        label: "Toggle Minimap",
        detail: "Show or hide the Monaco minimap.",
      },
      {
        keys: "Ctrl + Shift + W",
        label: "Toggle Word Wrap",
        detail: "Switch between wrapped and horizontal scrolling layout.",
      },
      {
        keys: "Ctrl + B",
        label: "Toggle Dark / Light Editor Theme",
        detail:
          "Flips between vs-dark and vs-light editor themes (applies only to the code editor).",
      },
    ],
  },
  {
    id: "analysis",
    title: "Trace, Visualizer, and Performance",
    description:
      "When you are analyzing an algorithm, these shortcuts keep you in flow.",
    shortcuts: [
      {
        keys: "Alt + O",
        label: "Switch to Output",
        detail: "Focuses the stdout / stderr panel on the right.",
      },
      {
        keys: "Alt + T",
        label: "Switch to Trace",
        detail: "Shows the step-by-step trace list for supported algorithms.",
      },
      {
        keys: "Alt + V",
        label: "Switch to Visualizer",
        detail: "Opens the visual array / graph visualizer on the right.",
      },
      {
        keys: "Alt + P",
        label: "Switch to Performance",
        detail:
          "Shows benchmark metrics and raw samples for the current algorithm / language.",
      },
      {
        keys: "Alt + R",
        label: "Switch to History",
        detail:
          "Opens the run history feed so you can restore previous runs quickly.",
      },
    ],
  },
];

const tips: { title: string; body: string }[] = [
  {
    title: "Use the Library as your starting point",
    body: "Instead of typing algorithms from scratch, open an entry from the Algorithm Library. It will load a language-specific template, recommended inputs, and can be wired to trace visualizations.",
  },
  {
    title: "Name and save playgrounds for experiments",
    body: "When exploring variations of an algorithm (for example, different partition strategies in Quick Sort), save each version as a separate playground. This makes it easier to compare, benchmark, and roll back.",
  },
  {
    title: "Leverage run history when debugging",
    body: "The History tab keeps the last 50 runs with success status, duration, and output previews. If a refactor breaks an algorithm, you can quickly restore the previous working snapshot from the history list.",
  },
  {
    title: "Treat performance benchmarks as relative guides",
    body: "The Performance tab is designed for educational comparisons rather than micro-benchmark accuracy. Use the numbers to understand trends and relative differences rather than chasing individual milliseconds.",
  },
  {
    title: "Pair traces with visualizations",
    body: "For supported algorithms, switch between the Trace and Visualizer tabs while stepping through an example. The textual description explains what is happening, and the visualizer shows how the underlying data changes.",
  },
];

export default function ShortcutsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            Productivity
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Keyboard Shortcuts &amp; Power Tips
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            While the Code Playground &amp; Algorithm Visualizer works great
            with just a mouse, these shortcuts and workflows help you iterate
            faster, benchmark more often, and switch between analysis views
            without losing focus.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Go to Playground
            </Button>
          </Link>
          <Link href="/library">
            <Button size="sm" variant="secondary">
              Open Algorithm Library
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="sm" variant="ghost">
              Read Developer Docs
            </Button>
          </Link>
        </div>
      </section>

      {/* Shortcut groups */}
      <section className="space-y-4">
        {shortcutGroups.map((group) => (
          <Card
            key={group.id}
            className="border-slate-800 bg-slate-950/70"
          >
            <CardHeader>
              <CardTitle className="text-xs text-slate-200">
                {group.title}
              </CardTitle>
              <p className="mt-1 text-[11px] text-slate-400">
                {group.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-md border border-slate-800 bg-slate-950/80">
                <table className="min-w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-300">
                      <th className="border-b border-slate-800 px-3 py-1.5 text-left font-medium">
                        Keys
                      </th>
                      <th className="border-b border-slate-800 px-3 py-1.5 text-left font-medium">
                        Action
                      </th>
                      <th className="border-b border-slate-800 px-3 py-1.5 text-left font-medium">
                        Detail
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.shortcuts.map((sc) => (
                      <tr
                        key={sc.keys}
                        className="border-b border-slate-900/60 odd:bg-slate-950 even:bg-slate-950/60"
                      >
                        <td className="px-3 py-1.5 align-top">
                          <kbd className="inline-flex rounded bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-100">
                            {sc.keys}
                          </kbd>
                        </td>
                        <td className="px-3 py-1.5 align-top text-slate-100">
                          {sc.label}
                        </td>
                        <td className="px-3 py-1.5 align-top text-[10px] text-slate-400">
                          {sc.detail || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Tips section */}
      <section className="space-y-3">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Practical Tips for Working in the Playground
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className="space-y-1 rounded-md border border-slate-800 bg-slate-950 p-3"
              >
                <p className="text-[11px] font-semibold text-slate-100">
                  {tip.title}
                </p>
                <p className="text-[11px] text-slate-400">{tip.body}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Footer / CTA */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Power Users
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              You do not need to memorize everything on this page. Start with
              just one or two shortcuts (for example,{" "}
              <span className="font-mono text-emerald-300">
                Ctrl + Enter
              </span>{" "}
              to run and{" "}
              <span className="font-mono text-emerald-300">
                Alt + T
              </span>{" "}
              to open Trace). Over time you can layer on more and let the
              playground feel like a natural extension of your editor.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/playground">
              <Button size="sm" variant="primary">
                Practice in Playground
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="sm" variant="ghost">
                Explore Architecture
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
