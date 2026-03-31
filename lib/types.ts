// ─── Analytics Data Types ────────────────────────────────────────────────────


export interface AppStatsDaily {
  date: string;
  androidViews: number;
  androidOpens: number;
  androidEvents: number;
  iosViews: number;
  iosOpens: number;
  iosEvents: number;
}


export interface DownloadsDaily {
  date: string;
  androidDownloads: number;
  iosDownloads: number;
}


export interface SocialDaily {
  date: string;

  facebookImpressions: number;
  facebookReach: number;
  facebookEngagement: number;

  instagramImpressions: number;
  instagramReach: number;
  instagramEngagement: number;

  tiktokViews: number;
  tiktokLikes: number;
  tiktokShares: number;
}


export interface KPIMetric {
  label: string;
  value: number;
  previousValue: number;
  growthPercent: number;
  sparklineData: number[];
}


export type DateRangeKey = "7d" | "30d" | "90d" | "all";

export interface DateRangeOption {
  key: DateRangeKey;
  label: string;
  days: number | null;
}


export interface DashboardData {
  appStats: AppStatsDaily[];
  downloads: DownloadsDaily[];
  social: SocialDaily[];
  kpis: {
    totalAndroidDownloads: KPIMetric;
    totalIosDownloads: KPIMetric;
    totalAppOpens: KPIMetric;
    totalSocialReach: KPIMetric;
  };
  summary: {
    totalDownloads: number;
    totalAppOpens: number;
    totalAppEvents: number;
    totalSocialReach: number;
  };
  lastUpdated: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "all", label: "All time", days: null },
];
