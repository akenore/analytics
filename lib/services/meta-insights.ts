
import { subDays } from "date-fns";
import type { SocialDaily } from "../types";


export async function fetchMetaInsights(
  days: number
): Promise<Partial<SocialDaily>[] | null> {
  const pageId = process.env.META_PAGE_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    console.log("[Meta] Missing credentials — using mock data");
    return null;
  }

  try {
    const since = Math.floor(subDays(new Date(), days).getTime() / 1000);
    const until = Math.floor(Date.now() / 1000);
    const metrics = "page_fans,page_views_total";
    
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/insights?metric=${metrics}&period=day&since=${since}&until=${until}&access_token=${accessToken}`
    );
    
    if (!res.ok) {
        console.log("[Meta] Insights not available for this Page Experience (using mock data).");
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
        if (metric.name === "page_views_total") { dayRecord.facebookImpressions = val.value; dayRecord.facebookReach = val.value; }
        if (metric.name === "page_fans") dayRecord.facebookEngagement = val.value;
      }
    }
    
    return Array.from(dailyMap.values()).sort((a, b) => a.date!.localeCompare(b.date!));
  } catch (error) {
    console.error("[Meta] API error:", error);
    return null;
  }
}
