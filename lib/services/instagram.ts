import { subDays } from "date-fns";
import type { SocialDaily } from "../types";

export async function fetchInstagramInsights(
  days: number
): Promise<Partial<SocialDaily>[] | null> {
  const businessId = process.env.INSTAGRAM_BUSINESS_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!businessId || !accessToken) {
    console.log("[Instagram] Missing credentials — using mock data");
    return null;
  }

  try {
    const cappedDays = Math.min(days, 30);
    const since = Math.floor(subDays(new Date(), cappedDays).getTime() / 1000);
    const until = Math.floor(Date.now() / 1000);

    const reachRes = await fetch(
      `https://graph.facebook.com/v20.0/${businessId}/insights?metric=reach&period=day&since=${since}&until=${until}&access_token=${accessToken}`
    );

    if (!reachRes.ok) {
      console.log("[Instagram] Insights not available — using mock data.");
      return null;
    }

    const reachJson = await reachRes.json();
    const dailyMap = new Map<string, Partial<SocialDaily>>();

    for (const metric of reachJson.data || []) {
      for (const val of metric.values || []) {
        const dateStr = val.end_time.split("T")[0];
        if (!dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, { date: dateStr });
        }
        const dayRecord = dailyMap.get(dateStr)!;
        if (metric.name === "reach") dayRecord.instagramReach = val.value;
      }
    }

    const totalRes = await fetch(
      `https://graph.facebook.com/v20.0/${businessId}/insights?metric=profile_views,accounts_engaged&metric_type=total_value&period=day&since=${since}&until=${until}&access_token=${accessToken}`
    );

    if (totalRes.ok) {
      const totalJson = await totalRes.json();
      const totalDays = dailyMap.size || 1;
      for (const metric of totalJson.data || []) {
        const totalVal = metric.total_value?.value || 0;
        const dailyAvg = Math.round(totalVal / totalDays);

        for (const [, dayRecord] of dailyMap) {
          if (metric.name === "profile_views") dayRecord.instagramImpressions = dailyAvg;
          if (metric.name === "accounts_engaged") dayRecord.instagramEngagement = dailyAvg;
        }
      }
    }

    console.log(`[Instagram] Fetched ${dailyMap.size} days of real data`);
    return Array.from(dailyMap.values()).sort((a, b) => a.date!.localeCompare(b.date!));
  } catch (error) {
    console.error("[Instagram] API error:", error);
    return null;
  }
}
