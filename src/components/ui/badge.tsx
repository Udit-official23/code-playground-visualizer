// src/components/ui/badge.tsx
import React from "react";

export type BadgeVariant = "default" | "outline";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium";
  const variantClass =
    variant === "default"
      ? "border-transparent bg-emerald-600/15 text-emerald-300"
      : "border-slate-700 bg-transparent text-slate-200";

  return (
    <span
      className={`${base} ${variantClass} ${className}`}
      {...props}
    />
  );
}
