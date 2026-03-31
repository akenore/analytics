"use client";

// ─── Chart Container ─────────────────────────────────────────────────────────
// Shared card wrapper for all chart sections.

import type { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ChartContainer({ title, subtitle, icon, children }: ChartContainerProps) {
  return (
    <section className="rounded-2xl border p-6 transition-all duration-300
                        border-slate-200 bg-white shadow-sm
                        dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl 
                      bg-slate-100 dark:bg-white/5">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
