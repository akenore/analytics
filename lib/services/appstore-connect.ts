
import jwt from "jsonwebtoken";
import { subDays, format } from "date-fns";
import type { DownloadsDaily } from "../types";


export async function fetchAppStoreDownloads(
  days: number
): Promise<Pick<DownloadsDaily, "date" | "iosDownloads">[] | null> {
  const keyId = process.env.APPSTORE_KEY_ID;
  const issuerId = process.env.APPSTORE_ISSUER_ID;
  const privateKey = process.env.APPSTORE_PRIVATE_KEY;

  if (!keyId || !issuerId || !privateKey) {
    console.log("[App Store] Missing credentials — using mock data");
    return null;
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        iss: issuerId,
        iat: now,
        exp: now + 1200,
        aud: "appstoreconnect-v1",
      },
      privateKey.replace(/"/g, '').replace(/\\n/g, '\n'),
      {
        algorithm: "ES256",
        header: {
          alg: "ES256",
          kid: keyId,
          typ: "JWT",
        },
      }
    );

    const testRes = await fetch("https://api.appstoreconnect.apple.com/v1/apps", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!testRes.ok) {
        console.log("[App Store] Not Authorized. Your API Key is either restricted, mismatched, or still propagating. Using mock data.");
        return null; // fallback to mock
    }
    

    console.log("[App Store] Successfully authenticated with Apple API! CSV parsing pending.");
    
    return null;
  } catch (error) {
    console.error("[App Store] API error:", error);
    return null;
  }
}
