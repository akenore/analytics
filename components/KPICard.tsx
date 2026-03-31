"use client";


import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { KPIMetric } from "@/lib/types";

interface KPICardProps {
  metric: KPIMetric;
  icon: React.ReactNode;
  gradient: { from: string; to: string; id: string };
  delay?: number;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toLocaleString();
}

export function KPICard({ metric, icon, gradient, delay = 0 }: KPICardProps) {
  const isPositive = metric.growthPercent >= 0;
  const sparklineData = metric.sparklineData.map((v, i) => ({ value: v, index: i }));

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 
                 hover:-translate-y-1
                 border-slate-200 bg-white shadow-sm hover:shadow-lg hover:shadow-slate-200/50
                 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none
                 dark:hover:shadow-none dark:hover:bg-white/[0.06]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient orb background */}
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15 blur-2xl 
                   transition-opacity duration-500 group-hover:opacity-30
                   dark:opacity-20 dark:group-hover:opacity-40"
        style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        }}
      />

      <div className="relative">
        {/* Icon + label */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${gradient.from}20, ${gradient.to}20)`,
              }}
            >
              {icon}
            </div>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {metric.label}
            </span>
          </div>

          {/* Growth badge */}
          <div
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold
              ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
              }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {metric.growthPercent}%
          </div>
        </div>

        {/* Big number */}
        <div className="mb-3 text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
          {formatNumber(metric.value)}
        </div>

        {/* Sparkline */}
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradient.from} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={gradient.to} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={gradient.from}
                strokeWidth={2}
                fill={`url(#${gradient.id})`}
                dot={false}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
