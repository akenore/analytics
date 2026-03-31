"use client";

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
  { key: "downloads", label: "Total Downloads", icon: Download, gradient: "from-emerald-500 to-teal-600", iconColor: "text-emerald-600 dark:text-emerald-400" },
  { key: "appOpens", label: "Total App Opens", icon: Smartphone, gradient: "from-blue-500 to-indigo-600", iconColor: "text-blue-600 dark:text-blue-400" },
  { key: "appEvents", label: "Total Events", icon: Zap, gradient: "from-amber-500 to-orange-600", iconColor: "text-amber-600 dark:text-amber-400" },
  { key: "socialReach", label: "Social Reach", icon: Radio, gradient: "from-pink-500 to-rose-600", iconColor: "text-pink-600 dark:text-pink-400" },
] as const;

export function SummaryStats({ totalDownloads, totalAppOpens, totalAppEvents, totalSocialReach }: SummaryStatsProps) {
  const values: Record<string, number> = {
    downloads: totalDownloads,
    appOpens: totalAppOpens,
    appEvents: totalAppEvents,
    socialReach: totalSocialReach,
  };

  return (
    <section className="card p-6">
      <h2 className="mb-5 text-[15px] font-bold text-slate-900 dark:text-white">
        Summary Statistics
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const val = values[stat.key];
          const hasData = val > 0;
          return (
            <div
              key={stat.key}
              className="group relative flex flex-col items-center gap-3 rounded-xl p-5
                         bg-slate-50/80 border border-slate-100
                         dark:bg-white/[0.02] dark:border-white/5
                         transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/[0.04]
                         overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity duration-300`} />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-sm dark:shadow-none">
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div className="relative text-center">
                <div className={`text-2xl font-extrabold ${hasData ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"}`}>
                  {hasData ? formatNumber(val) : "—"}
                </div>
                <div className="mt-0.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
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
