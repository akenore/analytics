"use client";

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
import { useTheme } from "next-themes";

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
  const { resolvedTheme: theme } = useTheme();

  const chartData = data.map((d) => ({
    date: d.date,
    Facebook: d.facebookReach,
    Instagram: d.instagramReach,
    TikTok: d.tiktokViews,
  }));

  const displayData = chartData.length > 60
    ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 60) === 0)
    : chartData;

  const tooltipBg = theme === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.98)";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)";
  const tooltipColor = theme === "dark" ? "#f1f5f9" : "#1e293b";

  return (
    <ChartContainer
      title="Social Media Performance"
      subtitle="Reach & views across Facebook, Instagram, and TikTok"
      icon={<Share2 className="h-5 w-5 text-pink-500" />}
    >
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="facebookFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1877F2" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#1877F2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="instagramFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E4405F" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#E4405F" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tiktokFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f2ea" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#00f2ea" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: "10px",
                color: tooltipColor,
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
              labelFormatter={formatLabel}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Area type="monotone" dataKey="Facebook" stroke="#1877F2" strokeWidth={2} fill="url(#facebookFill)" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
            <Area type="monotone" dataKey="Instagram" stroke="#E4405F" strokeWidth={2} fill="url(#instagramFill)" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
            <Area type="monotone" dataKey="TikTok" stroke="#00f2ea" strokeWidth={2} fill="url(#tiktokFill)" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
