"use client";

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
    <header className="relative mb-10">
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px]
                      bg-gradient-to-r from-indigo-500/8 via-blue-500/6 to-violet-500/8
                      dark:from-blue-500/15 dark:via-violet-500/15 dark:to-cyan-500/15
                      rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl
                          bg-gradient-to-br from-indigo-500 to-blue-600
                          shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
                Fielmedina Analytics
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 ml-14">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Last updated: {formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="card flex items-center gap-1 p-1 !rounded-xl">
            <Calendar className="ml-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
            {DATE_RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                id={`range-${option.key}`}
                onClick={() => onRangeChange(option.key)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all duration-200
                  ${
                    selectedRange === option.key
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white/15 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5"
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
