"use client";

import { useCallback, useEffect, useState } from "react";
import type { Language, ExecutionResult } from "@/lib/types";

export interface RunHistoryEntry {
  id: string;
  createdAt: string; // ISO string
  language: Language;
  algoId?: string;
  durationMs: number;
  success: boolean;
  stdoutPreview: string;
  stderrPreview: string;
  codeSnapshot: string;
}

const STORAGE_KEY = "cp_run_history_v1";

function readFromStorage(): RunHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RunHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeToStorage(items: RunHistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useRunHistory(limit: number = 50) {
  const [entries, setEntries] = useState<RunHistoryEntry[]>([]);

  useEffect(() => {
    setEntries(readFromStorage());
  }, []);

  const addEntry = useCallback(
    (payload: {
      language: Language;
      algoId?: string | null;
      result: ExecutionResult;
      code: string;
    }) => {
      const now = new Date().toISOString();
      const entry: RunHistoryEntry = {
        id: crypto.randomUUID(),
        createdAt: now,
        language: payload.language,
        algoId: payload.algoId ?? undefined,
        durationMs: payload.result.durationMs,
        success: payload.result.success,
        stdoutPreview: (payload.result.stdout || "").slice(0, 200),
        stderrPreview: (payload.result.stderr || "").slice(0, 200),
        codeSnapshot: payload.code,
      };

      setEntries((prev) => {
        const next = [entry, ...prev].slice(0, limit);
        writeToStorage(next);
        return next;
      });
    },
    [limit]
  );

  const clearHistory = useCallback(() => {
    setEntries([]);
    writeToStorage([]);
  }, []);

  return {
    entries,
    addEntry,
    clearHistory,
  };
}
