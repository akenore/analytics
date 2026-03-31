"use client";


import { FileDown } from "lucide-react";
import type { DashboardData } from "@/lib/types";

interface CSVExportProps {
  data: DashboardData | null;
}

function dashboardToCSV(data: DashboardData): string {
  const lines: string[] = [];

  // App activity
  lines.push("--- App Activity ---");
  lines.push("Date,Android Views,Android Opens,Android Events,iOS Views,iOS Opens,iOS Events");
  data.appStats.forEach((row) => {
    lines.push(`${row.date},${row.androidViews},${row.androidOpens},${row.androidEvents},${row.iosViews},${row.iosOpens},${row.iosEvents}`);
  });

  lines.push("");

  // Downloads
  lines.push("--- App Downloads ---");
  lines.push("Date,Android Downloads,iOS Downloads");
  data.downloads.forEach((row) => {
    lines.push(`${row.date},${row.androidDownloads},${row.iosDownloads}`);
  });

  lines.push("");

  // Social — Facebook
  lines.push("--- Facebook ---");
  lines.push("Date,Impressions,Reach,Engagement");
  data.social.forEach((row) => {
    lines.push(`${row.date},${row.facebookImpressions},${row.facebookReach},${row.facebookEngagement}`);
  });

  lines.push("");

  // Social — Instagram
  lines.push("--- Instagram ---");
  lines.push("Date,Impressions,Reach,Engagement");
  data.social.forEach((row) => {
    lines.push(`${row.date},${row.instagramImpressions},${row.instagramReach},${row.instagramEngagement}`);
  });

  lines.push("");

  // Social — TikTok
  lines.push("--- TikTok ---");
  lines.push("Date,Views,Likes,Shares");
  data.social.forEach((row) => {
    lines.push(`${row.date},${row.tiktokViews},${row.tiktokLikes},${row.tiktokShares}`);
  });

  return lines.join("\n");
}

export function CSVExport({ data }: CSVExportProps) {
  const handleExport = () => {
    if (!data) return;

    const csv = dashboardToCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fielmedina-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      id="csv-export-btn"
      onClick={handleExport}
      disabled={!data}
      className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium 
                 shadow-sm transition-all duration-200
                 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-md
                 disabled:cursor-not-allowed disabled:opacity-40
                 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 
                 dark:hover:bg-white/10"
    >
      <FileDown className="h-4 w-4" />
      Export CSV
    </button>
  );
}
