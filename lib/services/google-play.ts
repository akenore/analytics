
import { google } from "googleapis";
import type { DownloadsDaily } from "../types";


export async function fetchGooglePlayDownloads(
  days: number
): Promise<Pick<DownloadsDaily, "date" | "androidDownloads">[] | null> {
  const packageName = process.env.PLAY_PACKAGE_NAME;
  const serviceAccountKeyString = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!packageName || !serviceAccountKeyString) {
    console.log("[Google Play] Missing credentials — using mock data");
    return null;
  }

  try {
    const credentials = JSON.parse(serviceAccountKeyString);
    
    const authClient = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/playdeveloperreporting"],
    });

    const client = await authClient.getClient();
    if (client) {
      console.log("[Google Play] Successfully authenticated via service account!");
    }


    return null;
  } catch (error) {
    console.error("[Google Play] API error:", error);
    return null;
  }
}
