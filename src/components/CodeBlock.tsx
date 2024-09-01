import * as React from "react";
import clsx from "clsx";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <div
      className={clsx(
        "relative rounded-lg border border-slate-800 bg-slate-950/80 p-3",
        className
      )}
    >
      {language && (
        <span className="absolute right-3 top-2 text-[10px] uppercase tracking-wide text-slate-500">
          {language}
        </span>
      )}
      <pre className="mt-2 overflow-x-auto text-[11px] leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
