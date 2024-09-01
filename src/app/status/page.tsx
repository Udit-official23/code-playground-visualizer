// src/app/status/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type HealthResponse = {
  status: string;
  service: string;
  uptimeMs: number;
  uptimeSeconds: number;
  timestamp: string;
  checks: Record<string, boolean>;
};

type InfoResponse = {
  name: string;
  version: string;
  lastUpdated: string;
  algorithms: {
    total: number;
    categories: string[];
  };
  languages: {
    total: number;
    list: string[];
  };
  features: {
    playground: boolean;
    algorithmLibrary: boolean;
    visualizers: {
      array: boolean;
      graphDemo: boolean;
      [key: string]: boolean;
    };
    performanceBenchmarks: boolean;
    runHistory: boolean;
    [key: string]: unknown;
  };
};

export default function StatusPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [info, setInfo] = useState<InfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStatus() {
    try {
      setLoading(true);
      setError(null);

      const [healthRes, infoRes] = await Promise.all([
        fetch("/api/health"),
        fetch("/api/info"),
      ]);

      if (!healthRes.ok) {
        throw new Error(`Health request failed with ${healthRes.status}`);
      }
      if (!infoRes.ok) {
        throw new Error(`Info request failed with ${infoRes.status}`);
      }

      const healthJson = (await healthRes.json()) as HealthResponse;
      const infoJson = (await infoRes.json()) as InfoResponse;

      setHealth(healthJson);
      setInfo(infoJson);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    // You could add a poll interval here later if needed:
    // const id = setInterval(fetchStatus, 30000);
    // return () => clearInterval(id);
  }, []);

  const allChecksOk =
    health &&
    Object.values(health.checks).length > 0 &&
    Object.values(health.checks).every(Boolean);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <section className="space-y-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-400">
            System Status
          </p>
          <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
            Playground Status &amp; API Overview
          </h1>
          <p className="max-w-3xl text-xs text-slate-400 md:text-sm">
            A lightweight dashboard showing the healthcheck endpoint, basic
            service metadata, and a quick summary of algorithms and language
            support. This is useful for operators and buyers reviewing the
            codebase.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/playground">
            <Button size="sm" variant="primary">
              Open Playground
            </Button>
          </Link>
          <Link href="/docs">
            <Button size="sm" variant="secondary">
              Developer Docs
            </Button>
          </Link>
          <Link href="/architecture">
            <Button size="sm" variant="ghost">
              Architecture Overview
            </Button>
          </Link>
          <Button size="sm" variant="ghost" onClick={fetchStatus}>
            Refresh
          </Button>
        </div>
      </section>

      {/* Health card */}
      <section className="grid gap-4 md:grid-cols-[2fr,3fr]">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              API Healthcheck
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[11px] text-slate-200">
            {loading && (
              <p className="text-slate-400">Checking service status…</p>
            )}

            {error && (
              <p className="text-rose-400">
                Failed to fetch status:{" "}
                <span className="font-mono">{error}</span>
              </p>
            )}

            {health && !loading && !error && (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      "inline-flex h-2.5 w-2.5 rounded-full " +
                      (health.status === "ok"
                        ? "bg-emerald-400"
                        : "bg-amber-400")
                    }
                  />
                  <span className="text-[11px]">
                    Status:{" "}
                    <span className="font-mono text-emerald-300">
                      {health.status}
                    </span>
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">
                  Service:{" "}
                  <span className="font-mono text-slate-100">
                    {health.service}
                  </span>
                </p>

                <p className="text-[11px] text-slate-400">
                  Uptime:{" "}
                  <span className="font-mono text-slate-100">
                    {health.uptimeSeconds}s
                  </span>{" "}
                  (~
                  {Math.round(health.uptimeSeconds / 60)} min)
                </p>

                <p className="text-[11px] text-slate-400">
                  Timestamp:{" "}
                  <span className="font-mono text-slate-100">
                    {new Date(health.timestamp).toLocaleString()}
                  </span>
                </p>

                <div className="mt-2 space-y-1">
                  <p className="text-[11px] text-slate-400">Checks:</p>
                  <ul className="space-y-0.5">
                    {Object.entries(health.checks).map(([key, value]) => (
                      <li
                        key={key}
                        className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 px-2 py-1"
                      >
                        <span className="text-[11px] text-slate-300">
                          {key}
                        </span>
                        <span
                          className={
                            "rounded px-2 py-0.5 text-[10px] font-semibold " +
                            (value
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                              : "bg-rose-500/10 text-rose-300 border border-rose-500/40")
                          }
                        >
                          {value ? "OK" : "Fail"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {allChecksOk && (
                  <p className="mt-2 text-[11px] text-emerald-300">
                    All checks are passing. The playground is healthy.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader>
            <CardTitle className="text-xs text-slate-200">
              Project Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[11px] text-slate-200">
            {!info && !loading && !error && (
              <p className="text-slate-500">
                No info loaded yet. Try refreshing status.
              </p>
            )}

            {info && (
              <>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400">
                    Name:{" "}
                    <span className="font-mono text-slate-100">
                      {info.name}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Version:{" "}
                    <span className="font-mono text-emerald-300">
                      {info.version}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Last Updated:{" "}
                    <span className="font-mono text-slate-100">
                      {new Date(info.lastUpdated).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">
                    Algorithms
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Total:{" "}
                    <span className="font-mono text-slate-100">
                      {info.algorithms.total}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Categories:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {info.algorithms.categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">
                    Languages
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Supported:{" "}
                    <span className="font-mono text-slate-100">
                      {info.languages.total}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {info.languages.list.map((lang) => (
                      <span
                        key={lang}
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200"
                      >
                        {String(lang).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">
                    Feature Flags
                  </p>
                  <div className="grid gap-1 md:grid-cols-2">
                    <FeatureFlag label="Playground" enabled={info.features.playground} />
                    <FeatureFlag
                      label="Algorithm Library"
                      enabled={info.features.algorithmLibrary}
                    />
                    <FeatureFlag
                      label="Array Visualizer"
                      enabled={info.features.visualizers.array}
                    />
                    <FeatureFlag
                      label="Graph Visualizer Demo"
                      enabled={info.features.visualizers.graphDemo}
                    />
                    <FeatureFlag
                      label="Performance Benchmarks"
                      enabled={info.features.performanceBenchmarks}
                    />
                    <FeatureFlag
                      label="Run History"
                      enabled={info.features.runHistory}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <section className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-[12px] text-slate-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Operators &amp; Buyers
            </p>
            <p className="max-w-2xl text-xs text-slate-300 md:text-sm">
              This page is designed to show at a glance that the app has a
              healthcheck endpoint, typed metadata, and feature flags. It can be
              extended with real metrics, authentication checks, and deployment
              environment details.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/docs">
              <Button size="sm" variant="secondary">
                Developer Docs
              </Button>
            </Link>
            <Link href="/changelog">
              <Button size="sm" variant="ghost">
                Changelog
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button size="sm" variant="ghost">
                Roadmap
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureFlag({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded border border-slate-800 bg-slate-950 px-2 py-1">
      <span className="text-[11px] text-slate-300">{label}</span>
      <span
        className={
          "rounded-full px-2 py-0.5 text-[10px] font-semibold " +
          (enabled
            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
            : "bg-slate-500/10 text-slate-300 border border-slate-500/40")
        }
      >
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}
