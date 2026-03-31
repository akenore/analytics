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
      className="card flex items-center gap-2 px-4 py-2 text-sm font-semibold
                 text-slate-600 hover:text-slate-900
                 disabled:cursor-not-allowed disabled:opacity-40
                 dark:text-slate-400 dark:hover:text-white"
    >
      <FileDown className="h-4 w-4" />
      Export CSV
    </button>
  );
}
