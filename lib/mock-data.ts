// ─── Mock Data Generator ─────────────────────────────────────────────────────
// Generates realistic sample data when real API credentials are not configured.

import { format, subDays } from "date-fns";
import type {
  AppStatsDaily,
  DownloadsDaily,
  SocialDaily,
  KPIMetric,
  DashboardData,
} from "./types";

// Seeded pseudo-random to keep data consistent across renders
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDays(count: number): string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) =>
    format(subDays(today, count - 1 - i), "yyyy-MM-dd")
  );
}

function generateAppStats(days: string[]): AppStatsDaily[] {
  return days.map((date, i) => ({
    date,
    androidViews: Math.round(400 + seededRandom(i * 6 + 1) * 600 + i * 3),
    androidOpens: Math.round(150 + seededRandom(i * 6 + 2) * 250 + i * 2),
    androidEvents: Math.round(80 + seededRandom(i * 6 + 3) * 200 + i * 1.5),
    iosViews: Math.round(350 + seededRandom(i * 6 + 4) * 500 + i * 2.5),
    iosOpens: Math.round(120 + seededRandom(i * 6 + 5) * 200 + i * 1.8),
    iosEvents: Math.round(60 + seededRandom(i * 6 + 6) * 150 + i * 1.2),
  }));
}

function generateDownloads(days: string[]): DownloadsDaily[] {
  return days.map((date, i) => ({
    date,
    androidDownloads: Math.round(30 + seededRandom(i * 2 + 10) * 80 + i * 0.8),
    iosDownloads: Math.round(20 + seededRandom(i * 2 + 11) * 60 + i * 0.6),
  }));
}

function generateSocial(days: string[]): SocialDaily[] {
  return days.map((date, i) => ({
    date,
    // Facebook
    facebookImpressions: Math.round(800 + seededRandom(i * 9 + 20) * 3000 + i * 10),
    facebookReach: Math.round(400 + seededRandom(i * 9 + 21) * 1800 + i * 7),
    facebookEngagement: Math.round(30 + seededRandom(i * 9 + 22) * 200 + i * 1.5),
    // Instagram
    instagramImpressions: Math.round(1200 + seededRandom(i * 9 + 23) * 5000 + i * 18),
    instagramReach: Math.round(700 + seededRandom(i * 9 + 24) * 3000 + i * 12),
    instagramEngagement: Math.round(60 + seededRandom(i * 9 + 25) * 400 + i * 3),
    // TikTok
    tiktokViews: Math.round(2000 + seededRandom(i * 9 + 26) * 8000 + i * 25),
    tiktokLikes: Math.round(100 + seededRandom(i * 9 + 27) * 500 + i * 4),
    tiktokShares: Math.round(10 + seededRandom(i * 9 + 28) * 80 + i * 0.5),
  }));
}

function buildKPI(
  label: string,
  data: number[],
  previousData: number[]
): KPIMetric {
  const value = data.reduce((a, b) => a + b, 0);
  const previousValue = previousData.reduce((a, b) => a + b, 0);
  const growthPercent =
    previousValue > 0
      ? Math.round(((value - previousValue) / previousValue) * 1000) / 10
      : 0;

  // Build sparkline from daily totals (last 14 points max)
  const sparklineData = data.slice(-14);

  return { label, value, previousValue, growthPercent, sparklineData };
}

export function generateMockDashboard(dayCount: number): DashboardData {
  const totalDays = dayCount > 0 ? dayCount : 365;
  const days = generateDays(totalDays);
  const previousDays = generateDays(totalDays).map((_, i) =>
    format(subDays(new Date(), totalDays * 2 - 1 - i), "yyyy-MM-dd")
  );

  const appStats = generateAppStats(days);
  const downloads = generateDownloads(days);
  const social = generateSocial(days);

  // Previous period for comparison
  const prevAppStats = generateAppStats(previousDays);
  const prevDownloads = generateDownloads(previousDays);
  const prevSocial = generateSocial(previousDays);

  const kpis = {
    totalAndroidDownloads: buildKPI(
      "Android Downloads",
      downloads.map((d) => d.androidDownloads),
      prevDownloads.map((d) => d.androidDownloads)
    ),
    totalIosDownloads: buildKPI(
      "iOS Downloads",
      downloads.map((d) => d.iosDownloads),
      prevDownloads.map((d) => d.iosDownloads)
    ),
    totalAppOpens: buildKPI(
      "App Opens",
      appStats.map((d) => d.androidOpens + d.iosOpens),
      prevAppStats.map((d) => d.androidOpens + d.iosOpens)
    ),
    totalSocialReach: buildKPI(
      "Social Reach",
      social.map((d) => d.facebookReach + d.instagramReach),
      prevSocial.map((d) => d.facebookReach + d.instagramReach)
    ),
  };

  const summary = {
    totalDownloads:
      kpis.totalAndroidDownloads.value + kpis.totalIosDownloads.value,
    totalAppOpens: kpis.totalAppOpens.value,
    totalAppEvents: appStats.reduce(
      (a, b) => a + b.androidEvents + b.iosEvents,
      0
    ),
    totalSocialReach: kpis.totalSocialReach.value,
  };

  return {
    appStats,
    downloads,
    social,
    kpis,
    summary,
    lastUpdated: new Date().toISOString(),
  };
}
