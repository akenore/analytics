import { subDays, format } from "date-fns";
import type { SocialDaily } from "../types";

let cachedToken: string | null = null;

async function getValidToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;

  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) return null;

  const refreshToken = process.env.TIKTOK_REFRESH_TOKEN;
  const clientKey = process.env.TIKTOK_APP_ID;
  const clientSecret = process.env.TIKTOK_APP_SECRET;

  const testRes = await fetch(
    "https://open.tiktokapis.com/v2/user/info/?fields=display_name",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const testJson = await testRes.json();

  if (testJson.error?.code === "ok") {
    cachedToken = token;
    return token;
  }

  if (refreshToken && clientKey && clientSecret) {
    console.log("[TikTok] Token expired, refreshing...");
    const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    const json = await res.json();
    if (json.access_token) {
      cachedToken = json.access_token;
      console.log("[TikTok] Token refreshed successfully");
      console.log("[TikTok] UPDATE .env with new tokens:");
      console.log(`  TIKTOK_ACCESS_TOKEN=${json.access_token}`);
      if (json.refresh_token) {
        console.log(`  TIKTOK_REFRESH_TOKEN=${json.refresh_token}`);
      }
      return json.access_token;
    }
  }

  console.log("[TikTok] Token invalid and refresh failed");
  return null;
}

export async function fetchTikTokAnalytics(
  days: number
): Promise<Partial<SocialDaily>[] | null> {
  const accessToken = await getValidToken();

  if (!accessToken) {
    console.log("[TikTok] Missing credentials — using mock data");
    return null;
  }

  try {
    const since = subDays(new Date(), days);
    const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };
    const dailyMap = new Map<string, Partial<SocialDaily>>();
    let cursor: number | undefined;
    let hasMore = true;

    while (hasMore) {
      const body: Record<string, unknown> = { max_count: 20 };
      if (cursor) body.cursor = cursor;

      const res = await fetch(
        "https://open.tiktokapis.com/v2/video/list/?fields=id,create_time,view_count,like_count,share_count,comment_count",
        { method: "POST", headers, body: JSON.stringify(body) }
      );

      if (!res.ok) {
        console.log("[TikTok] API returned", res.status);
        break;
      }

      const json = await res.json();
      if (json.error?.code !== "ok") {
        console.log("[TikTok] API error:", json.error?.message);
        break;
      }

      const videos = json.data?.videos || [];
      let reachedLimit = false;

      for (const video of videos) {
        const videoDate = new Date(video.create_time * 1000);
        if (videoDate < since) {
          reachedLimit = true;
          continue;
        }

        const dateStr = format(videoDate, "yyyy-MM-dd");
        const existing = dailyMap.get(dateStr) || {
          date: dateStr,
          tiktokViews: 0,
          tiktokLikes: 0,
          tiktokShares: 0,
        };

        existing.tiktokViews = (existing.tiktokViews || 0) + (video.view_count || 0);
        existing.tiktokLikes = (existing.tiktokLikes || 0) + (video.like_count || 0);
        existing.tiktokShares = (existing.tiktokShares || 0) + (video.share_count || 0);
        dailyMap.set(dateStr, existing);
      }

      hasMore = json.data?.has_more && !reachedLimit;
      cursor = json.data?.cursor;
    }

    console.log(`[TikTok] Fetched ${dailyMap.size} days of real data`);
    return Array.from(dailyMap.values()).sort((a, b) => a.date!.localeCompare(b.date!));
  } catch (error: any) {
    console.error("[TikTok] API error:", error.message);
    return null;
  }
}
