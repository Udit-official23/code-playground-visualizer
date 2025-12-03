// src/hooks/useLocalPlaygrounds.ts
"use client";

import { useCallback, useState } from "react";
import type { Language } from "@/lib/types";

export interface SavedPlayground {
  id: string;
  title: string;
  language: Language;
  code: string;
  algoId?: string;
  updatedAt: string; // ISO string
}

const STORAGE_KEY = "cp_playgrounds_v1";

function readFromStorage(): SavedPlayground[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedPlayground[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeToStorage(items: SavedPlayground[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function useLocalPlaygrounds() {
  const [items, setItems] = useState<SavedPlayground[]>(() =>
    readFromStorage()
  );

  const savePlayground = useCallback(
    (payload: {
      id?: string;
      title: string;
      language: Language;
      code: string;
      algoId?: string | null;
    }) => {
      setItems((prev) => {
        const now = new Date().toISOString();
        let next: SavedPlayground[];

        if (payload.id) {
          // update existing
          next = prev.map((p) =>
            p.id === payload.id
              ? {
                  ...p,
                  title: payload.title,
                  language: payload.language,
                  code: payload.code,
                  algoId: payload.algoId ?? undefined,
                  updatedAt: now,
                }
              : p
          );
        } else {
          const newItem: SavedPlayground = {
            id: crypto.randomUUID(),
            title: payload.title,
            language: payload.language,
            code: payload.code,
            algoId: payload.algoId ?? undefined,
            updatedAt: now,
          };
          next = [newItem, ...prev];
        }

        writeToStorage(next);
        return next;
      });
    },
    []
  );

  const deletePlayground = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  return {
    items,
    savePlayground,
    deletePlayground,
  };
}
