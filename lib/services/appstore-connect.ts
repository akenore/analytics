import jwt from "jsonwebtoken";
import { subDays, format } from "date-fns";
import { gunzipSync } from "zlib";
import type { DownloadsDaily } from "../types";

const APP_ID = "6751167445";

function generateToken(): string | null {
  const keyId = process.env.APPSTORE_KEY_ID;
  const issuerId = process.env.APPSTORE_ISSUER_ID;
  const rawKey = process.env.APPSTORE_PRIVATE_KEY;

  if (!keyId || !issuerId || !rawKey) return null;

  const privateKey = rawKey.replace(/"/g, "").replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);

  return jwt.sign(
    { iss: issuerId, iat: now, exp: now + 1200, aud: "appstoreconnect-v1" },
    privateKey,
    { algorithm: "ES256", header: { alg: "ES256", kid: keyId, typ: "JWT" } }
  );
}

async function fetchWithTimeout(url: string, options: RequestInit, ms = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchAppStoreDownloads(
  days: number
): Promise<Pick<DownloadsDaily, "date" | "iosDownloads">[] | null> {
  const token = generateToken();
  if (!token) {
    console.log("[App Store] Missing credentials — using mock data");
    return null;
  }

  try {
    const headers = { Authorization: `Bearer ${token}` };

    const testRes = await fetchWithTimeout(
      "https://api.appstoreconnect.apple.com/v1/apps?limit=1",
      { headers },
      8000
    );

    if (!testRes.ok) {
      console.log("[App Store] Auth failed — using mock data");
      return null;
    }

    console.log("[App Store] Authenticated successfully");

    const vendorNumber = process.env.APPSTORE_VENDOR_NUMBER;
    if (!vendorNumber) {
      console.log("[App Store] Missing APPSTORE_VENDOR_NUMBER in .env — using mock data");
      return null;
    }

    const results: Pick<DownloadsDaily, "date" | "iosDownloads">[] = [];
    const since = subDays(new Date(), days);

    const reportDate = format(subDays(new Date(), 2), "yyyy-MM-dd");

    try {
      const url =
        "https://api.appstoreconnect.apple.com/v1/salesReports?" +
        new URLSearchParams({
          "filter[reportType]": "SALES",
          "filter[reportSubType]": "SUMMARY",
          "filter[frequency]": "DAILY",
          "filter[reportDate]": reportDate,
          "filter[vendorNumber]": vendorNumber,
        });

      const res = await fetchWithTimeout(url, { headers }, 15000);

      if (res.status === 200) {
        const buf = Buffer.from(await res.arrayBuffer());
        let csv: string;
        try {
          csv = gunzipSync(buf).toString("utf-8");
        } catch {
          csv = buf.toString("utf-8");
        }

        const lines = csv.split("\n");
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split("\t");
          if (cols.length < 8) continue;

          const sku = cols[2];
          const units = parseInt(cols[7] || "0", 10);
          const dateStr = cols[11];

          if (units > 0 && dateStr) {
            const formatted = dateStr.includes("/")
              ? dateStr.split("/").reverse().join("-")
              : dateStr;

            const existing = results.find((r) => r.date === formatted);
            if (existing) {
              existing.iosDownloads += units;
            } else {
              results.push({ date: formatted, iosDownloads: units });
            }
          }
        }

        if (results.length > 0) {
          console.log(`[App Store] Fetched ${results.length} days of sales data`);
          return results.sort((a, b) => a.date.localeCompare(b.date));
        }
      } else if (res.status === 404) {
        console.log("[App Store] No sales report available for this date");
      } else {
        const errText = await res.text();
        console.log(`[App Store] Sales API returned ${res.status}`);
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.log("[App Store] Sales report request timed out");
      }
    }

    return null;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("[App Store] Request timed out — using mock data");
    } else {
      console.error("[App Store] API error:", error.message?.substring(0, 150));
    }
    return null;
  }
}
