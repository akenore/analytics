import { Storage } from "@google-cloud/storage";
import { subDays, format, parse, isAfter, isBefore } from "date-fns";
import type { DownloadsDaily } from "../types";

const BUCKET_NAME = "pubsite_prod_5254145672693010255";
const PACKAGE_NAME = process.env.PLAY_PACKAGE_NAME || "com.fielmedina.app";

function parseCredentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) return null;
  try {
    const creds = JSON.parse(raw.replace(/^'|'$/g, ""));
    creds.private_key = creds.private_key.replace(/\\n/g, "\n");
    return creds;
  } catch {
    return null;
  }
}

async function downloadCSV(storage: Storage, filePath: string): Promise<string | null> {
  try {
    const [content] = await storage.bucket(BUCKET_NAME).file(filePath).download();
    // Google Play CSVs are encoded in UTF-16 (often UTF-16LE or UTF-16BE)
    // The easiest and safest way to handle this for ASCII CSVs is to toString('utf-8') and strip null bytes
    let text = content.toString("utf-8");
    text = text.replace(/\0/g, "").replace(/^\ufeff/, "").replace(/^\xef\xbb\xbf/, "");
    return text;
  } catch (err: any) {
    console.log(`[Google Play] Download failed for ${filePath}: ${err.code || err.message}`);
    return null;
  }
}

function parseInstallsCSV(csv: string, sinceStr: string, untilStr: string): Map<string, number> {
  const dailyMap = new Map<string, number>();
  const clean = csv.replace(/^\ufeff/, "");
  const lines = clean.split("\n");

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(",");
    if (cols.length < 3) continue;

    const dateStr = cols[0].trim();
    const installs = parseInt(cols[2] || "0", 10);

    // Simple string comparison for YYYY-MM-DD format
    if (dateStr >= sinceStr && dateStr <= untilStr) {
      dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + installs);
    }
  }

  return dailyMap;
}

export async function fetchGooglePlayDownloads(
  days: number
): Promise<Pick<DownloadsDaily, "date" | "androidDownloads">[] | null> {
  const creds = parseCredentials();
  if (!creds) {
    console.log("[Google Play] Missing credentials — using mock data");
    return null;
  }

  try {
    const storage = new Storage({ credentials: creds, projectId: creds.project_id });

    const since = subDays(new Date(), days);
    const until = new Date();

    const months = new Set<string>();
    let cursor = new Date(since);
    while (cursor <= until) {
      months.add(format(cursor, "yyyyMM"));
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    console.log(`[Google Play] Looking for months: ${[...months].join(', ')} for package: ${PACKAGE_NAME}`);

    const allInstalls = new Map<string, number>();

    for (const month of months) {
      const filePath = `stats/installs/installs_${PACKAGE_NAME}_${month}_overview.csv`;
      const csv = await downloadCSV(storage, filePath);

      if (csv) {
        console.log(`[Google Play] Downloaded ${filePath} (${csv.length} bytes)`);
        const monthData = parseInstallsCSV(csv, format(since, "yyyy-MM-dd"), format(until, "yyyy-MM-dd"));
        console.log(`[Google Play] Parsed ${monthData.size} days from ${month}`);
        for (const [date, count] of monthData) {
          allInstalls.set(date, (allInstalls.get(date) || 0) + count);
        }
      } else {
        console.log(`[Google Play] No file: ${filePath}`);
      }
    }

    if (allInstalls.size === 0) {
      const [files] = await storage.bucket(BUCKET_NAME).getFiles({
        prefix: "stats/installs/",
        maxResults: 5,
      });
      if (files.length === 0) {
        console.log("[Google Play] No install reports found in bucket");
        return null;
      }

      console.log(`[Google Play] Reports exist but no data for requested range. Sample: ${files[0].name}`);
      return null;
    }

    const result = Array.from(allInstalls.entries())
      .map(([date, androidDownloads]) => ({ date, androidDownloads }))
      .sort((a, b) => a.date.localeCompare(b.date));

    console.log(`[Google Play] Fetched ${result.length} days of real install data`);
    return result;
  } catch (error: any) {
    if (error.code === 403) {
      console.log("[Google Play] Access denied to reports bucket — permission may still be propagating");
    } else {
      console.error("[Google Play] API error:", error.message?.substring(0, 200));
    }
    return null;
  }
}
