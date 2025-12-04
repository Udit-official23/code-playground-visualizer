import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code Playground & Algorithm Visualizer",
  description:
    "Interactive playground to run code step-by-step and visualize algorithms, data structures, and performance.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-950 text-slate-50">
        <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
          <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-lg font-bold">
                  CP
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-tight">
                    Code Playground
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Algorithm Visualizer
                  </span>
                </div>
              </div>

              <nav className="flex items-center space-x-4 text-xs font-medium text-slate-300">
                <Link
                  href="/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </Link>

                <Link
                  href="/playground"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Playground
                </Link>

                <Link
                  href="/library"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Library
                </Link>

                <Link
                  href="/docs"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Docs
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
