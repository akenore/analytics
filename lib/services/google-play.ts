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
    return content.toString("utf-8");
  } catch {
    return null;
  }
}

function parseInstallsCSV(csv: string, since: Date, until: Date): Map<string, number> {
  const dailyMap = new Map<string, number>();
  const lines = csv.split("\n");

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(",");
    if (cols.length < 3) continue;

    const dateStr = cols[0];
    const installs = parseInt(cols[7] || cols[2] || "0", 10);

    try {
      const rowDate = parse(dateStr, "yyyy-MM-dd", new Date());
      if (isAfter(rowDate, since) && isBefore(rowDate, until)) {
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + installs);
      }
    } catch {
      continue;
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

    const allInstalls = new Map<string, number>();

    for (const month of months) {
      const filePath = `stats/installs/installs_${PACKAGE_NAME}_${month}_overview.csv`;
      const csv = await downloadCSV(storage, filePath);

      if (csv) {
        const monthData = parseInstallsCSV(csv, since, until);
        for (const [date, count] of monthData) {
          allInstalls.set(date, (allInstalls.get(date) || 0) + count);
        }
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
