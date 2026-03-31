
import { subDays, format } from "date-fns";
import type { SocialDaily } from "../types";


export async function fetchTikTokAnalytics(
  days: number
): Promise<Partial<SocialDaily>[] | null> {
  const businessId = process.env.TIKTOK_BUSINESS_ID;
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!businessId || !accessToken || businessId.includes("YOUR_")) {
    console.log("[TikTok] Missing credentials — using mock data");
    return null;
  }

  try {
    const startDate = subDays(new Date(), days);
    const endDate = new Date();
    
    const query = new URLSearchParams({
        advertiser_id: businessId,
        report_type: "BASIC",
        data_level: "AUCTION_ADVERTISER",
        dimensions: JSON.stringify(["stat_time_day"]),
        metrics: JSON.stringify(["video_views", "likes", "shares"]),
        start_date: format(startDate, "yyyy-MM-dd"),
        end_date: format(endDate, "yyyy-MM-dd"),
        page_size: "100"
    });

    const res = await fetch(`https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/?${query.toString()}`, {
      method: "GET",
      headers: {
        "Access-Token": accessToken,
      }
    });
    
    if (!res.ok) {
        console.error("[TikTok API Error]", await res.text());
        return null;
    }
    
    const json = await res.json();
    
    if (json.code !== 0) {
        console.error("[TikTok API Error via payload]", json.message);
        return null;
    }
    
    const dailyMap = new Map<string, Partial<SocialDaily>>();
    
    for (const row of json.data?.list || []) {
      const dateStr = row.dimensions.stat_time_day.split(" ")[0];
      
      dailyMap.set(dateStr, {
        date: dateStr,
        tiktokViews: parseInt(row.metrics.video_views || "0", 10),
        tiktokLikes: parseInt(row.metrics.likes || "0", 10),
        tiktokShares: parseInt(row.metrics.shares || "0", 10)
      });
    }
    
    return Array.from(dailyMap.values()).sort((a, b) => a.date!.localeCompare(b.date!));
  } catch (error) {
    console.error("[TikTok] API error:", error);
    return null;
  }
}
