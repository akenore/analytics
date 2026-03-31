"use client";

// ─── Summary Stats Section ───────────────────────────────────────────────────
// Row of total aggregated stats: downloads, app opens, app events, social reach.

import { Download, Smartphone, Zap, Radio } from "lucide-react";

interface SummaryStatsProps {
  totalDownloads: number;
  totalAppOpens: number;
  totalAppEvents: number;
  totalSocialReach: number;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

const stats = [
  { key: "downloads", label: "Total Downloads", icon: Download, color: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  { key: "appOpens", label: "Total App Opens", icon: Smartphone, color: "text-blue-600 dark:text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/10" },
  { key: "appEvents", label: "Total Events", icon: Zap, color: "text-amber-600 dark:text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/10" },
  { key: "socialReach", label: "Social Reach", icon: Radio, color: "text-pink-600 dark:text-pink-500", bg: "bg-pink-100 dark:bg-pink-500/10" },
] as const;

export function SummaryStats({ totalDownloads, totalAppOpens, totalAppEvents, totalSocialReach }: SummaryStatsProps) {
  const values: Record<string, number> = {
    downloads: totalDownloads,
    appOpens: totalAppOpens,
    appEvents: totalAppEvents,
    socialReach: totalSocialReach,
  };

  return (
    <section className="rounded-2xl border p-6
                        border-slate-200 bg-white shadow-sm
                        dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
      <h2 className="mb-6 text-lg font-semibold text-slate-800 dark:text-white">
        Summary Statistics
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="flex flex-col items-center gap-3 rounded-xl border p-5 
                         transition-all duration-300 hover:shadow-md
                         border-slate-100 bg-slate-50/80
                         dark:border-white/5 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                  {formatNumber(values[stat.key])}
                </div>
                <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
