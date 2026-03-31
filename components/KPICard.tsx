"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
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
  const growth = metric.growthPercent;
  const isPositive = growth > 0;
  const isZero = growth === 0;
  const sparklineData = metric.sparklineData.map((v, i) => ({ value: v, index: i }));
  const hasData = metric.value > 0;

  return (
    <div
      className="card group relative overflow-hidden p-5 hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-10 blur-2xl
                   transition-opacity duration-500 group-hover:opacity-20
                   dark:opacity-15 dark:group-hover:opacity-30"
        style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
      />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}15)` }}
            >
              {icon}
            </div>
            <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {metric.label}
            </span>
          </div>

          {!isZero && (
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold
                ${isPositive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? "+" : ""}{growth}%
            </div>
          )}
          {isZero && (
            <div className="flex items-center gap-1 rounded-full bg-slate-50 dark:bg-white/5 px-2 py-0.5 text-[11px] font-bold text-slate-400">
              <Minus className="h-3 w-3" />0%
            </div>
          )}
        </div>

        <div className={`mb-2 text-3xl font-extrabold tracking-tight ${hasData ? "text-slate-900 dark:text-white" : "text-slate-300 dark:text-slate-600"}`}>
          {hasData ? formatNumber(metric.value) : "—"}
        </div>

        <div className="h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradient.from} stopOpacity={hasData ? 0.25 : 0.05} />
                  <stop offset="100%" stopColor={gradient.to} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={hasData ? gradient.from : "#cbd5e1"}
                strokeWidth={2}
                fill={`url(#${gradient.id})`}
                dot={false}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
