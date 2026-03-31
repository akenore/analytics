"use client";

import type { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ChartContainer({ title, subtitle, icon, children }: ChartContainerProps) {
  return (
    <section className="card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl
                       bg-slate-50 dark:bg-white/5">
          {icon}
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-[13px] text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
