// ─── Analytics Data Types ────────────────────────────────────────────────────

/** Daily app usage stats (views, opens, events) for iOS and Android */
export interface AppStatsDaily {
  date: string; // YYYY-MM-DD
  androidViews: number;
  androidOpens: number;
  androidEvents: number;
  iosViews: number;
  iosOpens: number;
  iosEvents: number;
}

/** Daily app download metrics */
export interface DownloadsDaily {
  date: string;
  androidDownloads: number;
  iosDownloads: number;
}

/** Daily social media performance — per platform */
export interface SocialDaily {
  date: string;
  // Facebook
  facebookImpressions: number;
  facebookReach: number;
  facebookEngagement: number;
  // Instagram
  instagramImpressions: number;
  instagramReach: number;
  instagramEngagement: number;
  // TikTok
  tiktokViews: number;
  tiktokLikes: number;
  tiktokShares: number;
}

/** A single KPI metric for the summary cards */
export interface KPIMetric {
  label: string;
  value: number;
  previousValue: number;
  growthPercent: number;
  sparklineData: number[];
}

/** Date range options for the dashboard */
export type DateRangeKey = "7d" | "30d" | "90d" | "all";

export interface DateRangeOption {
  key: DateRangeKey;
  label: string;
  days: number | null; // null = all time
}

/** Aggregated dashboard response from API */
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
