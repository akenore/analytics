"use client";

// ─── App Downloads Chart ─────────────────────────────────────────────────────
// Bar chart showing Android + iOS daily installs side by side.

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Smartphone } from "lucide-react";
import type { DownloadsDaily } from "@/lib/types";
import { ChartContainer } from "./ChartContainer";
import { useTheme } from "./ThemeProvider";

interface DownloadsChartProps {
  data: DownloadsDaily[];
}

function formatDate(dateStr: string | number): string {
  const d = new Date(String(dateStr));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLabel(label: unknown): string {
  return formatDate(String(label));
}

export function DownloadsChart({ data }: DownloadsChartProps) {
  const { theme } = useTheme();

  const displayData = data.length > 60
    ? data.filter((_, i) => i % Math.ceil(data.length / 60) === 0)
    : data;

  const tooltipBg = theme === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.97)";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(51,65,85,0.15)";
  const tooltipColor = theme === "dark" ? "#f1f5f9" : "#1e293b";

  return (
    <ChartContainer
      title="App Downloads"
      subtitle="Daily Android & iOS installs"
      icon={<Smartphone className="h-5 w-5 text-emerald-500" />}
    >
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="androidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="iosGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "12px",
                color: tooltipColor,
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
              labelFormatter={formatLabel}
            />
            <Legend wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }} />
            <Bar
              dataKey="androidDownloads"
              name="Android"
              fill="url(#androidGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
            <Bar
              dataKey="iosDownloads"
              name="iOS"
              fill="url(#iosGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
