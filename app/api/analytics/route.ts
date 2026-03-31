import { NextRequest, NextResponse } from "next/server";
import { generateEmptyDashboard } from "@/lib/mock-data";
import type { DateRangeKey, SocialDaily, DownloadsDaily, AppStatsDaily } from "@/lib/types";

import { fetchAppStoreDownloads } from "@/lib/services/appstore-connect";
import { fetchGooglePlayDownloads } from "@/lib/services/google-play";
import { fetchMetaInsights } from "@/lib/services/meta-insights";
import { fetchInstagramInsights } from "@/lib/services/instagram";
import { fetchTikTokAnalytics } from "@/lib/services/tiktok";

export const revalidate = 3600;

const RANGE_DAYS: Record<DateRangeKey, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  all: 90,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "30d") as DateRangeKey;
    const days = RANGE_DAYS[range] || 30;

    const data = generateEmptyDashboard(days);

    const [appStoreData, playData, metaData, instaData, tiktokData] = await Promise.all([
      fetchAppStoreDownloads(days),
      fetchGooglePlayDownloads(days),
      fetchMetaInsights(days),
      fetchInstagramInsights(days),
      fetchTikTokAnalytics(days),
    ]);

    if (metaData) {
      metaData.forEach((realDay: Partial<SocialDaily>) => {
        const day = data.social.find((s: SocialDaily) => s.date === realDay.date);
        if (day) {
          if (realDay.facebookImpressions !== undefined) day.facebookImpressions = realDay.facebookImpressions;
          if (realDay.facebookReach !== undefined) day.facebookReach = realDay.facebookReach;
          if (realDay.facebookEngagement !== undefined) day.facebookEngagement = realDay.facebookEngagement;
        }
      });
    }

    if (instaData) {
      instaData.forEach((realDay: Partial<SocialDaily>) => {
        const day = data.social.find((s: SocialDaily) => s.date === realDay.date);
        if (day) {
          if (realDay.instagramImpressions !== undefined) day.instagramImpressions = realDay.instagramImpressions;
          if (realDay.instagramReach !== undefined) day.instagramReach = realDay.instagramReach;
          if (realDay.instagramEngagement !== undefined) day.instagramEngagement = realDay.instagramEngagement;
        }
      });
    }

    if (tiktokData) {
      tiktokData.forEach((realDay: Partial<SocialDaily>) => {
        const day = data.social.find((s: SocialDaily) => s.date === realDay.date);
        if (day) {
          if (realDay.tiktokViews !== undefined) day.tiktokViews = realDay.tiktokViews;
          if (realDay.tiktokLikes !== undefined) day.tiktokLikes = realDay.tiktokLikes;
          if (realDay.tiktokShares !== undefined) day.tiktokShares = realDay.tiktokShares;
        }
      });
    }

    if (appStoreData) {
      appStoreData.forEach((realDay: { date: string; iosDownloads: number }) => {
        const day = data.downloads.find((d: DownloadsDaily) => d.date === realDay.date);
        if (day && realDay.iosDownloads !== undefined) day.iosDownloads = realDay.iosDownloads;
      });
    }

    if (playData) {
      playData.forEach((realDay: { date: string; androidDownloads: number }) => {
        const day = data.downloads.find((d: DownloadsDaily) => d.date === realDay.date);
        if (day && realDay.androidDownloads !== undefined) day.androidDownloads = realDay.androidDownloads;
      });
    }

    const androidDl = data.downloads.map((d: DownloadsDaily) => d.androidDownloads);
    const iosDl = data.downloads.map((d: DownloadsDaily) => d.iosDownloads);
    const appOpens = data.appStats.map((d: AppStatsDaily) => d.androidOpens + d.iosOpens);
    const socialReach = data.social.map((d: SocialDaily) => d.facebookReach + d.instagramReach + d.tiktokViews);

    data.kpis.totalAndroidDownloads = {
      label: "Android Downloads",
      value: androidDl.reduce((a: number, b: number) => a + b, 0),
      previousValue: 0,
      growthPercent: 0,
      sparklineData: androidDl.slice(-14),
    };
    data.kpis.totalIosDownloads = {
      label: "iOS Downloads",
      value: iosDl.reduce((a: number, b: number) => a + b, 0),
      previousValue: 0,
      growthPercent: 0,
      sparklineData: iosDl.slice(-14),
    };
    data.kpis.totalAppOpens = {
      label: "App Opens",
      value: appOpens.reduce((a: number, b: number) => a + b, 0),
      previousValue: 0,
      growthPercent: 0,
      sparklineData: appOpens.slice(-14),
    };
    data.kpis.totalSocialReach = {
      label: "Social Reach",
      value: socialReach.reduce((a: number, b: number) => a + b, 0),
      previousValue: 0,
      growthPercent: 0,
      sparklineData: socialReach.slice(-14),
    };

    data.summary = {
      totalDownloads: data.kpis.totalAndroidDownloads.value + data.kpis.totalIosDownloads.value,
      totalAppOpens: data.kpis.totalAppOpens.value,
      totalAppEvents: data.appStats.reduce((a: number, b: AppStatsDaily) => a + b.androidEvents + b.iosEvents, 0),
      totalSocialReach: data.kpis.totalSocialReach.value,
    };

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[API] Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
