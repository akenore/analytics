"use client";

// ─── Social Media Performance Chart ──────────────────────────────────────────
// Area chart showing reach across Facebook, Instagram, and TikTok.

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Share2 } from "lucide-react";
import type { SocialDaily } from "@/lib/types";
import { ChartContainer } from "./ChartContainer";
import { useTheme } from "./ThemeProvider";

interface SocialChartProps {
  data: SocialDaily[];
}

function formatDate(dateStr: string | number): string {
  const d = new Date(String(dateStr));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLabel(label: unknown): string {
  return formatDate(String(label));
}

export function SocialChart({ data }: SocialChartProps) {
  const { theme } = useTheme();

  // Build chart data with per-platform reach
  const chartData = data.map((d) => ({
    date: d.date,
    "Facebook": d.facebookReach,
    "Instagram": d.instagramReach,
    "TikTok": d.tiktokViews,
  }));

  const displayData = chartData.length > 60
    ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 60) === 0)
    : chartData;

  const tooltipBg = theme === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.97)";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(51,65,85,0.15)";
  const tooltipColor = theme === "dark" ? "#f1f5f9" : "#1e293b";

  return (
    <ChartContainer
      title="Social Media Performance"
      subtitle="Reach & views across Facebook, Instagram, and TikTok"
      icon={<Share2 className="h-5 w-5 text-pink-500" />}
    >
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="facebookFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1877F2" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1877F2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="instagramFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E4405F" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#E4405F" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tiktokFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2ea" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00f2ea" stopOpacity={0} />
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
            <Area
              type="monotone"
              dataKey="Facebook"
              stroke="#1877F2"
              strokeWidth={2}
              fill="url(#facebookFill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="Instagram"
              stroke="#E4405F"
              strokeWidth={2}
              fill="url(#instagramFill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="TikTok"
              stroke="#00f2ea"
              strokeWidth={2}
              fill="url(#tiktokFill)"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
