"use client";

import * as React from "react";
import clsx from "clsx";

export interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="flex items-center space-x-1 rounded-lg bg-slate-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            activeId === tab.id
              ? "bg-white shadow text-slate-900"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
