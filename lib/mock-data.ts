import { format, subDays } from "date-fns";
import type {
  AppStatsDaily,
  DownloadsDaily,
  SocialDaily,
  KPIMetric,
  DashboardData,
} from "./types";

function generateDays(count: number): string[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) =>
    format(subDays(today, count - 1 - i), "yyyy-MM-dd")
  );
}

export function generateEmptyDashboard(dayCount: number): DashboardData {
  const totalDays = dayCount > 0 ? dayCount : 365;
  const days = generateDays(totalDays);

  const appStats: AppStatsDaily[] = days.map((date) => ({
    date, androidViews: 0, androidOpens: 0, androidEvents: 0,
    iosViews: 0, iosOpens: 0, iosEvents: 0,
  }));

  const downloads: DownloadsDaily[] = days.map((date) => ({
    date, androidDownloads: 0, iosDownloads: 0,
  }));

  const social: SocialDaily[] = days.map((date) => ({
    date,
    facebookImpressions: 0, facebookReach: 0, facebookEngagement: 0,
    instagramImpressions: 0, instagramReach: 0, instagramEngagement: 0,
    tiktokViews: 0, tiktokLikes: 0, tiktokShares: 0,
  }));

  const emptyKPI = (label: string): KPIMetric => ({
    label, value: 0, previousValue: 0, growthPercent: 0, sparklineData: [],
  });

  return {
    appStats,
    downloads,
    social,
    kpis: {
      totalAndroidDownloads: emptyKPI("Android Downloads"),
      totalIosDownloads: emptyKPI("iOS Downloads"),
      totalAppOpens: emptyKPI("App Opens"),
      totalSocialReach: emptyKPI("Social Reach"),
    },
    summary: { totalDownloads: 0, totalAppOpens: 0, totalAppEvents: 0, totalSocialReach: 0 },
    lastUpdated: new Date().toISOString(),
  };
}
