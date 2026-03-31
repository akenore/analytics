"use client";

// ─── Header Component ────────────────────────────────────────────────────────
// Project name, last-updated timestamp, date range selector, and dark mode toggle.

import { Calendar, RefreshCw } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { DATE_RANGE_OPTIONS, type DateRangeKey } from "@/lib/types";

interface HeaderProps {
  selectedRange: DateRangeKey;
  onRangeChange: (range: DateRangeKey) => void;
  lastUpdated: string | null;
}

export function Header({ selectedRange, onRangeChange, lastUpdated }: HeaderProps) {
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <header className="relative mb-8 md:mb-12">
      {/* Background glow — more subtle in light mode */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] 
                      bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 
                      dark:from-blue-500/20 dark:via-violet-500/20 dark:to-cyan-500/20
                      rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {/* Title block */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl 
                          bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/25">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white md:text-3xl">
              Fielmedina Analytics
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Last updated: {formattedDate}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Date range selector */}
          <div className="flex items-center gap-1 rounded-xl p-1 
                        bg-white border border-slate-200 shadow-sm
                        dark:bg-white/5 dark:border-white/10">
            <Calendar className="ml-2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            {DATE_RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                id={`range-${option.key}`}
                onClick={() => onRangeChange(option.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200
                  ${
                    selectedRange === option.key
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white/15 dark:text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
