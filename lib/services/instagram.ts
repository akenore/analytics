
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
    const since = Math.floor(subDays(new Date(), days).getTime() / 1000);
    const until = Math.floor(Date.now() / 1000);
    const metrics = "reach,profile_views,accounts_engaged";
    
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${businessId}/insights?metric=${metrics}&metric_type=total_value&period=day&since=${since}&until=${until}&access_token=${accessToken}`
    );
    
    if (!res.ok) {
        console.error("[Instagram API Error]", await res.text());
        return null;
    }
    
    const json = await res.json();
    const dailyMap = new Map<string, Partial<SocialDaily>>();
    
    for (const metric of json.data || []) {
      for (const val of metric.values || []) {
        const dateStr = val.end_time.split("T")[0]; 
        
        if (!dailyMap.has(dateStr)) {
          dailyMap.set(dateStr, { date: dateStr });
        }
        
        const dayRecord = dailyMap.get(dateStr)!;
        if (metric.name === "profile_views") dayRecord.instagramImpressions = val.value;
        if (metric.name === "reach") dayRecord.instagramReach = val.value;
        if (metric.name === "accounts_engaged") dayRecord.instagramEngagement = val.value;
      }
    }
    
    return Array.from(dailyMap.values()).sort((a, b) => a.date!.localeCompare(b.date!));
  } catch (error) {
    console.error("[Instagram] API error:", error);
    return null;
  }
}
