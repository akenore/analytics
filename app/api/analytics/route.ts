
import { NextRequest, NextResponse } from "next/server";
import { generateMockDashboard } from "@/lib/mock-data";
import type { DateRangeKey } from "@/lib/types";

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
  all: 365,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get("range") || "30d") as DateRangeKey;
    const days = RANGE_DAYS[range] || 30;

    const data = generateMockDashboard(days);

    const [appStoreData, playData, metaData, instaData, tiktokData] = await Promise.all([
      fetchAppStoreDownloads(days),
      fetchGooglePlayDownloads(days),
      fetchMetaInsights(days),
      fetchInstagramInsights(days),
      fetchTikTokAnalytics(days),
    ]);

    if (metaData) {
      metaData.forEach((realDay) => {
        const mockDay = data.social.find((s) => s.date === realDay.date);
        if (mockDay) {
          if (realDay.facebookImpressions !== undefined) mockDay.facebookImpressions = realDay.facebookImpressions;
          if (realDay.facebookReach !== undefined) mockDay.facebookReach = realDay.facebookReach;
          if (realDay.facebookEngagement !== undefined) mockDay.facebookEngagement = realDay.facebookEngagement;
        }
      });
    }

    if (instaData) {
      instaData.forEach((realDay) => {
        const mockDay = data.social.find((s) => s.date === realDay.date);
        if (mockDay) {
          if (realDay.instagramImpressions !== undefined) mockDay.instagramImpressions = realDay.instagramImpressions;
          if (realDay.instagramReach !== undefined) mockDay.instagramReach = realDay.instagramReach;
          if (realDay.instagramEngagement !== undefined) mockDay.instagramEngagement = realDay.instagramEngagement;
        }
      });
    }

    if (tiktokData) {
      tiktokData.forEach((realDay) => {
        const mockDay = data.social.find((s) => s.date === realDay.date);
        if (mockDay) {
          if (realDay.tiktokViews !== undefined) mockDay.tiktokViews = realDay.tiktokViews;
          if (realDay.tiktokLikes !== undefined) mockDay.tiktokLikes = realDay.tiktokLikes;
          if (realDay.tiktokShares !== undefined) mockDay.tiktokShares = realDay.tiktokShares;
        }
      });
    }

    if (appStoreData) {
      appStoreData.forEach((realDay) => {
        const mockDay = data.downloads.find((d) => d.date === realDay.date);
        if (mockDay && realDay.iosDownloads !== undefined) mockDay.iosDownloads = realDay.iosDownloads;
      });
    }

    if (playData) {
      playData.forEach((realDay) => {
        const mockDay = data.downloads.find((d) => d.date === realDay.date);
        if (mockDay && realDay.androidDownloads !== undefined) mockDay.androidDownloads = realDay.androidDownloads;
      });
    }

    if (metaData || instaData || tiktokData) {
      data.summary.totalSocialReach = data.social.reduce(
        (sum, day) => sum + day.facebookReach + day.instagramReach + day.tiktokViews,
        0
      );
      data.kpis.totalSocialReach.value = data.summary.totalSocialReach;
    }

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
