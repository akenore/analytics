# Analytics Dashboard - API Tokens Guide

This document outlines step-by-step instructions on how to generate the necessary API tokens and credentials for the Analytics dashboard `.env` file. These tokens connect the dashboard to Meta, TikTok, Google Play, and Apple App Store Connect.

## 1. Meta (Facebook & Instagram)
*Both Facebook and Instagram share the same Graph API and tokens. You will use the exact same tokens for both.*

### Generating Page IDs
1. Go to the [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/).
2. Select your Meta App from the dropdown.
3. Under **Permissions** on the right side, ensure you search for and select:
   - `pages_show_list`
   - `pages_read_engagement`
   - `instagram_basic`
   - `business_management` *(Crucial: Without this, the API will hide your pages if they are owned by a Meta Business Portfolio).*
4. Click **Generate Access Token**. When the popup appears, click Continue, select your Facebook Page and Instagram Account, and click Done.
5. In the query box, enter: `me/accounts?fields=name,instagram_business_account`
6. Click **Submit**. This JSON will return your `META_PAGE_ID` (listed as `id` inside the payload) and your `INSTAGRAM_BUSINESS_ID`.

### Generating a "Never Expires" Access Token
1. Follow the steps above to generate a short-lived **User Token** in the Graph API Explorer.
2. Go to the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/).
3. Paste the short-lived user token, click **Debug**, and then scroll down and click **Extend Access Token** to get a 60-day User Token.
4. Go back to the [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
5. Paste that 60-day User Token into the Access Token box at the top.
6. Make sure the dropdown is still set to "User Token".
7. Query `me/accounts?fields=access_token` and click Submit.
8. The `access_token` string that appears *inside* the returned JSON response is a Permanent Page Token (Expires: Never). Paste this into both `META_ACCESS_TOKEN` and `INSTAGRAM_ACCESS_TOKEN` .

---

## 2. TikTok

### Getting your Business ID
1. Log in to your [TikTok Business Center](https://business.tiktok.com/).
2. Open your specific Brand/Business account.
3. The long 16+ digit number at the end of the URL (e.g., `.../select/1234567890`) is your `TIKTOK_BUSINESS_ID`.

### Generating your Access Token
1. Go to the [TikTok Business API Portal](https://business-api.tiktok.com/portal/).
2. Click **Create App**. Select **Internal App**. Set the Redirect URL to your core website (e.g., `https://www.fielmedina.com`). The redirect won't be actively used.
3. Under the permissions checklist, select the following at a minimum:
   - `Reporting`
   - `Ad Account Management`
   - `Ads Management`
   - `Measurement` & `Audience Management`
   - *If organic profile stats are needed, heavily check permissions under `TikTok Creator`.*
4. Submit the app. Once it is approved, click the button in your dashboard to manually generate your `TIKTOK_ACCESS_TOKEN`.

---

## 3. Google Play Connect

### Package Name
1. Retrieve your `PLAY_PACKAGE_NAME` (e.g., `com.fielmedina.app`) directly from your app dashboard in the [Google Play Console](https://play.google.com/console/).

### Service Account Key
1. Go to [Google Cloud IAM & Admin - Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts).
2. Ensure you are under the Cloud project connected to your Google Play Console via the top-left dropdown.
3. Click **+ Create Service Account** (e.g., "Play Analytics Dashboard").
4. Click on the new service account, go to the **Keys** tab, click **Add Key** -> **Create new key** -> **JSON**.
5. Save the downloaded `.json` file.
6. **Formatting:** When placing this in the `.env` file as `GOOGLE_SERVICE_ACCOUNT_KEY`, compress the JSON and wrap the entire string in single quotes (e.g., `'{"type":"service_account",...}'`) so environment parsers do not break on newlines.
7. **Permissions:** You MUST go to your [Google Play Console](https://play.google.com/console/) -> **Setup** -> **API access**, locate this service account, and click **Grant Access** to allow it to "View app information" and "View financial data".

---

## 4. Apple App Store Connect

### Generating API Keys
1. Log into your [App Store Connect Dashboard](https://appstoreconnect.apple.com/).
2. Click on the **Users and Access** icon block.
3. Near the top of the resulting page, click the **Integrations** tab.
4. On the left sidebar, click **App Store Connect API**.
5. The `APPSTORE_ISSUER_ID` is displayed near the top-left of the page below the header text.
6. Click the blue **(+)** button next to Active Keys to create a new key. Name it "Analytics Sandbox" or something recognizable, and give it **App Manager** or **Admin** access.
7. The table will immediately generate a new Key ID. This goes into `APPSTORE_KEY_ID`.
8. Click **Download API Key** on the right side of the row to get the `.p8` file. *(Note: Apple only lets you download this file once!).*
9. Open the `.p8` file in a text editor.
10. Copy and paste the entire block—including the `-----BEGIN PRIVATE KEY-----` dashes—directly into `APPSTORE_PRIVATE_KEY` in your `.env`, using `\n` to represent explicit line breaks if formatting on a single string line.
