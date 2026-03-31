"use client";


import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";
import type { AppStatsDaily } from "@/lib/types";
import { ChartContainer } from "./ChartContainer";
import { useTheme } from "./ThemeProvider";

interface AppStatsChartProps {
  data: AppStatsDaily[];
}

function formatDate(dateStr: string | number): string {
  const d = new Date(String(dateStr));
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLabel(label: unknown): string {
  return formatDate(String(label));
}

export function AppStatsChart({ data }: AppStatsChartProps) {
  const { theme } = useTheme();

  // Combine Android + iOS totals for the chart
  const chartData = data.map((d) => ({
    date: d.date,
    "App Views": d.androidViews + d.iosViews,
    "App Opens": d.androidOpens + d.iosOpens,
    "Events": d.androidEvents + d.iosEvents,
  }));

  const displayData = chartData.length > 60
    ? chartData.filter((_, i) => i % Math.ceil(chartData.length / 60) === 0)
    : chartData;

  const tooltipBg = theme === "dark" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.97)";
  const tooltipBorder = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(51,65,85,0.15)";
  const tooltipColor = theme === "dark" ? "#f1f5f9" : "#1e293b";

  return (
    <ChartContainer
      title="App Activity"
      subtitle="Daily views, opens, and events (iOS + Android)"
      icon={<Activity className="h-5 w-5 text-blue-500" />}
    >
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
            <Legend
              wrapperStyle={{ fontSize: "13px", paddingTop: "10px" }}
            />
            <Line
              type="monotone"
              dataKey="App Views"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="App Opens"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="Events"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 5"
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
