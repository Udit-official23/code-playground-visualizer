"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import {
  type Language,
  type ExecutionResult,
  type BenchmarkResult,
} from "@/lib/types";
import { getAlgorithmCode } from "@/lib/algorithmCode";
import {
  useLocalPlaygrounds,
  type SavedPlayground,
} from "@/hooks/useLocalPlaygrounds";
import { useRunHistory } from "@/hooks/useRunHistory";
import { usePlaygroundSettings } from "@/hooks/usePlaygroundSettings";
import { ArrayVisualizer } from "@/components/visualizers/ArrayVisualizer";
import { PerformancePanel } from "@/components/playground/PerformancePanel";
import { usePlaygroundHotkeys } from "@/hooks/usePlaygroundHotkeys";
import { useRouter } from "next/navigation";
import { TimelineVisualizer } from "@/components/visualizers/TimelineVisualizer";


// Monaco editor is loaded client-side only
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const DEFAULT_CODE: Record<Language, string> = {
  javascript: `// Example: Bubble Sort
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}

const input = [5, 1, 4, 2, 8];
console.log("input:", input);
console.log("sorted:", bubbleSort([...input]));`,
  python: `# Example: Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

input_arr = [5, 1, 4, 2, 8]
print("input:", input_arr)
print("sorted:", bubble_sort(list(input_arr)))`,
};

const languageTabs = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
];

const rightTabs = [
  { id: "trace", label: "Trace" },
  { id: "stdout", label: "Output" },
  { id: "visualizer", label: "Visualizer" },
  { id: "performance", label: "Performance" },
  { id: "history", label: "History" },
];
const router = useRouter();


export default function PlaygroundPage() {
  const searchParams = useSearchParams();
  const algoId = searchParams.get("algo");
  const langParam = searchParams.get("lang") as Language | null;
    const [activeTraceStep, setActiveTraceStep] = useState<number | null>(null);

  const {
    items: savedPlaygrounds,
    savePlayground,
    deletePlayground,
  } = useLocalPlaygrounds();
  const { entries: runHistory, addEntry, clearHistory } = useRunHistory(50);
  const { settings, updateSetting } = usePlaygroundSettings();

  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<string>("trace");
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Apply algo + lang from query params on load / change
  useEffect(() => {
    const lang: Language =
      langParam === "python" || langParam === "javascript"
        ? langParam
        : "javascript";

    setLanguage(lang);

    if (algoId) {
      const template = getAlgorithmCode(algoId, lang);
      if (template) {
        setCode(template);
        setResult(null);
        return;
      }
    }

    setCode(DEFAULT_CODE[lang]);
    setResult(null);
  }, [algoId, langParam]);

  const handleLanguageChange = (id: string) => {
    const lang = id as Language;
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setResult(null);
  };

  const handleRun = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        body: JSON.stringify({
          code,
          language,
          algoId: algoId ?? undefined,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = (await res.json()) as ExecutionResult;
      setResult(data);

      // Log run in history
      addEntry({
        language,
        algoId,
        result: data,
        code,
      });
    } catch (err) {
      console.error(err);
      const failure: ExecutionResult = {
        success: false,
        stdout: "",
        stderr: "Execution failed. Check console.",
        durationMs: 0,
        trace: [],
      };
      setResult(failure);

      addEntry({
        language,
        algoId,
        result: failure,
        code,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const title = window.prompt("Save playground as:", "My playground");
    if (!title) return;

    savePlayground({
      title: title.trim(),
      language,
      code,
      algoId: algoId ?? undefined,
    });
  };

  const handleLoad = (pg: SavedPlayground) => {
    setLanguage(pg.language);
    setCode(pg.code);
    setResult(null);
  };

  const handleRunBenchmark = async () => {
    if (!algoId) {
      alert("Benchmarks are currently only available for known algorithms.");
      return;
    }

    setBenchmarkLoading(true);
    setBenchmark(null);

    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          algoId,
          language,
        }),
      });

      if (!res.ok) {
        console.error("Benchmark failed", await res.text());
        setBenchmark(null);
        return;
      }

      const data = (await res.json()) as BenchmarkResult;
      setBenchmark(data);
    } catch (err) {
      console.error(err);
      setBenchmark(null);
    } finally {
      setBenchmarkLoading(false);
    }
  };

    const handleDownload = () => {
    const extension = language === "javascript" ? "js" : "py";
    const baseName = algoId ? algoId : "playground";
    const filename = `${baseName}.${extension}`;

    const blob = new Blob([code], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  usePlaygroundHotkeys({
  onRun: () => {
    // reuse your existing handler
    handleRun();
  },
  onSave: () => {
    handleSave();
  },
  onToggleLanguage: () => {
    setLanguage((prev) => (prev === "javascript" ? "python" : "javascript"));
  },
  onFocusTab: (tabId) => {
    // tabId will be one of: stdout, trace, visualizer, performance, history
    setActiveRightTab(tabId);
  },
  onNavigate: (href) => {
    router.push(href);
  },
});



  return (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-50">
          Interactive Playground
        </h2>
        <p className="text-xs text-slate-400">
          Choose a language, paste code, and inspect execution traces, output,
          visualizations, performance, and run history.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Tabs
          tabs={languageTabs}
          activeId={language}
          onChange={handleLanguageChange}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings((prev) => !prev)}
        >
          Settings
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="secondary" size="md" onClick={handleSave}>
          Save
        </Button>
        <Button onClick={handleRun} disabled={loading}>
          {loading ? "Running…" : "Run Code"}
        </Button>
      </div>
    </div>

    {/* Editor Settings Panel */}
    {showSettings && (
      <Card className="border-slate-800 bg-slate-950/70">
        <CardHeader>
          <CardTitle className="text-xs text-slate-200">
            Editor Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-[11px] text-slate-200 md:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400">
              Font Size
            </label>
            <input
              type="number"
              min={10}
              max={24}
              value={settings.fontSize}
              onChange={(e) =>
                updateSetting("fontSize", Number(e.target.value) || 13)
              }
              className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-emerald-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400">
              Word Wrap
            </label>
            <select
              value={settings.wordWrap}
              onChange={(e) =>
                updateSetting("wordWrap", e.target.value as "on" | "off")
              }
              className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-emerald-400"
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400">
              Minimap
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.minimap}
                onChange={(e) =>
                  updateSetting("minimap", e.target.checked)
                }
                className="h-3 w-3 accent-emerald-500"
              />
              <span className="text-[11px] text-slate-300">
                Show minimap
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] text-slate-400">
              Theme
            </label>
            <select
              value={settings.editorTheme}
              onChange={(e) =>
                updateSetting(
                  "editorTheme",
                  e.target.value as "vs-dark" | "vs-light"
                )
              }
              className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-emerald-400"
            >
              <option value="vs-dark">Dark</option>
              <option value="vs-light">Light</option>
            </select>
          </div>
        </CardContent>
      </Card>
    )}

    <div className="grid gap-4 lg:grid-cols-[3fr,2fr]">
      {/* Left: Editor */}
      <Card className="border-slate-800 bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-xs text-slate-200">
            {language === "javascript" ? "playground.js" : "playground.py"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[480px] p-0">
          <div className="h-full overflow-hidden rounded-b-xl border-t border-slate-800">
            <MonacoEditor
              height="100%"
              language={language === "javascript" ? "javascript" : "python"}
              theme={settings.editorTheme}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                fontSize: settings.fontSize,
                minimap: { enabled: settings.minimap },
                scrollBeyondLastLine: false,
                wordWrap: settings.wordWrap,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Right: Trace / Output / Visualizer / Performance / History */}
      <Card className="border-slate-800 bg-slate-950/60">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-xs text-slate-200">
            Execution Insights
          </CardTitle>
          <Tabs
            tabs={rightTabs}
            activeId={activeRightTab}
            onChange={setActiveRightTab}
          />
        </CardHeader>
        <CardContent className="h-[480px] overflow-auto text-[11px] font-mono text-slate-200">
          {!result &&
            activeRightTab !== "performance" &&
            activeRightTab !== "history" && (
              <p className="text-slate-500">
                Run the code to see trace, output, and visualizations.
              </p>
            )}

          {/* STDOUT / STDERR */}
          {activeRightTab === "stdout" && (
            <>
              {result ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold text-emerald-300">
                      stdout:
                    </span>
                    <pre className="mt-1 rounded bg-slate-900/80 p-2">
                      {result.stdout || "(empty)"}
                    </pre>
                  </div>
                  {result.stderr && (
                    <div>
                      <span className="font-semibold text-rose-300">
                        stderr:
                      </span>
                      <pre className="mt-1 rounded bg-rose-950/40 p-2 text-rose-200">
                        {result.stderr}
                      </pre>
                    </div>
                  )}
                  {result && (
                    <p className="mt-2 text-[10px] text-slate-500">
                      Duration: {result.durationMs.toFixed(2)} ms
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">
                  Run the code to capture stdout / stderr.
                </p>
              )}
            </>
          )}

          {/* TRACE LIST + TIMELINE */}
{activeRightTab === "trace" && (
  <>
    {result ? (
      <div className="space-y-3">
        {result.trace.length === 0 && (
          <p className="text-slate-500">
            No trace data yet. For some algorithms we emit detailed
            step-by-step traces that feed the visualizer.
          </p>
        )}

        {result.trace.length > 0 && (
          <TimelineVisualizer
            steps={result.trace}
            activeStep={activeTraceStep}
            onStepChange={(stepNumber) => setActiveTraceStep(stepNumber)}
          />
        )}

        {result.trace.length > 0 && (
          <div className="space-y-2">
            {result.trace.map((step) => {
              const isActive = step.step === activeTraceStep;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveTraceStep(step.step)}
                  className={
                    "w-full rounded border p-2 text-left transition-colors " +
                    (isActive
                      ? "border-emerald-500/70 bg-emerald-500/10"
                      : "border-slate-800 bg-slate-900/70 hover:border-emerald-400/60 hover:bg-slate-900")
                  }
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-emerald-300">
                      Step {step.step}
                    </span>
                    <span className="text-slate-500">
                      Line {step.currentLine}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-200">
                    {step.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    ) : (
      <p className="text-slate-500">
        Run a built-in algorithm to see trace steps here.
      </p>
    )}
  </>
)}


          {/* VISUALIZER */}
          {activeRightTab === "visualizer" && (
            <>
              {result && result.trace.length > 0 ? (
                <ArrayVisualizer steps={result.trace} />
              ) : (
                <p className="text-slate-500">
                  Run the code (for supported algorithms like Bubble Sort,
                  Binary Search, or BFS) to generate trace data for
                  visualization.
                </p>
              )}
            </>
          )}

          {/* PERFORMANCE (using PerformancePanel) */}
          {activeRightTab === "performance" && (
  <PerformancePanel language={language} algorithmId={algoId ?? undefined} />
)}


          {/* HISTORY */}
          {activeRightTab === "history" && (
            <div className="flex h-full flex-col text-[11px] text-slate-200">
              {runHistory.length === 0 && (
                <p className="text-slate-500">
                  No runs recorded yet. Once you execute code, the last 50 runs
                  will appear here with duration and status.
                </p>
              )}

              {runHistory.length > 0 && (
                <>
                  <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      Showing{" "}
                      <span className="font-semibold text-slate-100">
                        {runHistory.length}
                      </span>{" "}
                      recent run{runHistory.length === 1 ? "" : "s"}.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const ok = window.confirm(
                          "Clear all run history entries? This cannot be undone."
                        );
                        if (!ok) return;
                        clearHistory();
                      }}
                      className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-rose-700 hover:text-slate-50"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-auto rounded-md border border-slate-800 bg-slate-950/70">
                    <ul className="divide-y divide-slate-800">
                      {runHistory.map((entry) => (
                        <li
                          key={entry.id}
                          className="flex items-start justify-between gap-2 px-2 py-1.5"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={
                                  "rounded px-1.5 py-0.5 text-[10px] font-medium " +
                                  (entry.success
                                    ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-rose-600/20 text-rose-200 border border-rose-500/40")
                                }
                              >
                                {entry.success ? "Success" : "Failed"}
                              </span>
                              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300">
                                {entry.language.toUpperCase()}
                              </span>
                              {entry.algoId && (
                                <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-emerald-300">
                                  {entry.algoId}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500">
                                {new Date(
                                  entry.createdAt
                                ).toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Duration: {entry.durationMs.toFixed(2)} ms
                            </span>
                            {entry.stdoutPreview && (
                              <div className="mt-1">
                                <span className="text-[10px] text-emerald-300">
                                  stdout:
                                </span>
                                <pre className="mt-0.5 max-h-16 overflow-hidden rounded bg-slate-900/80 p-1 text-[10px] text-slate-200">
                                  {entry.stdoutPreview}
                                  {entry.stdoutPreview.length >= 200 && "…"}
                                </pre>
                              </div>
                            )}
                            {entry.stderrPreview && (
                              <div className="mt-1">
                                <span className="text-[10px] text-rose-300">
                                  stderr:
                                </span>
                                <pre className="mt-0.5 max-h-16 overflow-hidden rounded bg-rose-950/40 p-1 text-[10px] text-rose-200">
                                  {entry.stderrPreview}
                                  {entry.stderrPreview.length >= 200 && "…"}
                                </pre>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[10px] text-emerald-300 hover:text-emerald-100"
                              onClick={() => {
                                setLanguage(entry.language);
                                setCode(entry.codeSnapshot);
                                setResult(null);
                              }}
                            >
                              Restore
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>

    {/* Saved Playgrounds */}
    {savedPlaygrounds.length > 0 && (
      <Card className="mt-2 border-slate-800 bg-slate-950/70">
        <CardHeader>
          <CardTitle className="text-xs text-slate-200">
            Saved Playgrounds
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-[11px] text-slate-300">
          <p className="text-[10px] text-slate-500">
            Saved locally in your browser. Click a name to load it into the
            editor.
          </p>
          <div className="max-h-52 overflow-auto rounded-md border border-slate-800 bg-slate-950/70">
            <ul className="divide-y divide-slate-800">
              {savedPlaygrounds
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.updatedAt).getTime() -
                    new Date(a.updatedAt).getTime()
                )
                .map((pg) => (
                  <li
                    key={pg.id}
                    className="flex items-center justify-between gap-2 px-2 py-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoad(pg)}
                      className="flex flex-col items-start text-left"
                    >
                      <span className="text-[11px] font-medium text-slate-100">
                        {pg.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {pg.language.toUpperCase()} •{" "}
                        {pg.algoId ? `Linked to ${pg.algoId}` : "Custom"}
                        {" • "}
                        {new Date(pg.updatedAt).toLocaleString()}
                      </span>
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[10px] text-slate-400 hover:text-rose-300"
                      onClick={() => {
                        const confirmed = window.confirm(
                          `Delete saved playground "${pg.title}"?`
                        );
                        if (!confirmed) return;
                        deletePlayground(pg.id);
                      }}
                    >
                      Delete
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);
}