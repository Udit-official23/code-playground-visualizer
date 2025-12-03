// src/hooks/usePlaygroundHotkeys.ts
"use client";

import { useEffect } from "react";

export interface PlaygroundHotkeyHandlers {
  /** Run code, e.g. Ctrl+Enter */
  onRun?: () => void;
  /** Save playground, e.g. Ctrl+S */
  onSave?: () => void;
  /** Toggle language, e.g. Alt+L */
  onToggleLanguage?: () => void;
  /** Focus a tab on the right, e.g. Alt+O / Alt+T / Alt+V / Alt+P / Alt+R */
  onFocusTab?: (tabId: string) => void;
  /** Navigate to a route, e.g. Alt+1..4 */
  onNavigate?: (href: string) => void;
  /** Toggle editor settings panel, e.g. Ctrl+Shift+M/W/B or direct. */
  onToggleSettings?: () => void;
}

/**
 * Installs global keyboard shortcuts for the playground.
 * It deliberately ignores key events when the user is typing in inputs,
 * textareas, or content-editable regions.
 */
export function usePlaygroundHotkeys(
  handlers: PlaygroundHotkeyHandlers
): void {
  useEffect(() => {
    function isTextInputTarget(target: EventTarget | null): boolean {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();

      if (tag === "input" || tag === "textarea") return true;
      if (target.isContentEditable) return true;

      return false;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTextInputTarget(event.target)) {
        // Let the browser handle shortcuts inside text inputs.
        return;
      }

      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey; // support Cmd on Mac
      const alt = event.altKey;

      // Ctrl + Enter → Run
      if (ctrl && key === "enter" && handlers.onRun) {
        event.preventDefault();
        handlers.onRun();
        return;
      }

      // Ctrl + S → Save
      if (ctrl && key === "s" && handlers.onSave) {
        event.preventDefault();
        handlers.onSave();
        return;
      }

      // Alt + L → Toggle language
      if (alt && key === "l" && handlers.onToggleLanguage) {
        event.preventDefault();
        handlers.onToggleLanguage();
        return;
      }

      // Alt + O/T/V/P/R → focus tabs
      if (alt && handlers.onFocusTab) {
        if (key === "o") {
          event.preventDefault();
          handlers.onFocusTab("stdout");
          return;
        }
        if (key === "t") {
          event.preventDefault();
          handlers.onFocusTab("trace");
          return;
        }
        if (key === "v") {
          event.preventDefault();
          handlers.onFocusTab("visualizer");
          return;
        }
        if (key === "p") {
          event.preventDefault();
          handlers.onFocusTab("performance");
          return;
        }
        if (key === "r") {
          event.preventDefault();
          handlers.onFocusTab("history");
          return;
        }
      }

      // Alt + 1..4 → navigation
      if (alt && handlers.onNavigate) {
        if (key === "1") {
          event.preventDefault();
          handlers.onNavigate("/playground");
          return;
        }
        if (key === "2") {
          event.preventDefault();
          handlers.onNavigate("/library");
          return;
        }
        if (key === "3") {
          event.preventDefault();
          handlers.onNavigate("/docs");
          return;
        }
        if (key === "4") {
          event.preventDefault();
          handlers.onNavigate("/about");
          return;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlers]);
}
