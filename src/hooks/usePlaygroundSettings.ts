// src/hooks/usePlaygroundSettings.ts
"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "cp_playground_settings_v1";

const DEFAULT_SETTINGS = {
  fontSize: 13,
  wordWrap: "on" as "on" | "off",
  minimap: false,
  editorTheme: "vs-dark" as "vs-dark" | "vs-light",
};

export type PlaygroundSettings = typeof DEFAULT_SETTINGS;
type SettingsKey = keyof PlaygroundSettings;

function readFromStorage(): PlaygroundSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PlaygroundSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeToStorage(settings: PlaygroundSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

export function usePlaygroundSettings() {
  const [settings, setSettings] = useState<PlaygroundSettings>(() =>
    readFromStorage()
  );

  const updateSetting = useCallback(
    <K extends SettingsKey>(key: K, value: PlaygroundSettings[K]) => {
      setSettings((prev) => {
        const next: PlaygroundSettings = { ...prev, [key]: value };
        writeToStorage(next);
        return next;
      });
    },
    []
  );

  return { settings, updateSetting };
}
