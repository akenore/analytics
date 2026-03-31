You are a senior full-stack engineer.

Build a **public analytics page** using **Next.js 14 (App Router)** that aggregates statistics from multiple platforms and displays them in a single page.

The page will be **publicly accessible via a URL** so partners can view performance metrics.

This is NOT an admin dashboard and must NOT require authentication.

---

PROJECT GOAL

Create a single public page `/` that displays analytics and growth metrics from:

1. Google Analytics (GA4)
2. Meta (Facebook / Instagram) insights
3. Android downloads from Google Play
4. iOS downloads from App Store Connect

All statistics must be visualized with charts and KPI blocks.

---

TECH STACK

Frontend

* Next.js 14
* TypeScript
* TailwindCSS
* Recharts

Backend

* Next.js API Routes

Data Storage

* PostgreSQL (optional but recommended)

Deployment

* Vercel compatible

---

PAGE STRUCTURE

The homepage `/` must display all statistics in sections.

SECTION 1 — HEADER

Display:

Project name
Last updated timestamp
Date range selector

Date range options:

Last 7 days
Last 30 days
Last 90 days
All time

---

SECTION 2 — KEY METRICS

Display large KPI cards:

Total Android Downloads
Total iOS Downloads
Total Website Users
Total Social Reach

Each card must include:

main number
percentage growth
small sparkline chart

---

SECTION 3 — WEBSITE TRAFFIC

Display a line chart showing:

Daily users
Sessions
Page views

Data source:
Google Analytics GA4

---

SECTION 4 — APP DOWNLOADS

Display:

Android installs chart
iOS installs chart

Use bar or line charts.

---

SECTION 5 — SOCIAL MEDIA PERFORMANCE

Display charts for:

Reach
Impressions
Engagement

Data source:
Meta Graph API.

---

SECTION 6 — SUMMARY STATS

Display totals:

Total downloads
Total impressions
Total users
Total reach

---

API INTEGRATIONS

Implement server-side API services to fetch data.

---

GOOGLE ANALYTICS GA4

Use the Google Analytics Data API.

Fetch metrics:

activeUsers
sessions
screenPageViews

Authentication must use a Google service account.

Environment variables:

GA_PROPERTY_ID
GA_CLIENT_EMAIL
GA_PRIVATE_KEY

Reference:
<https://developers.google.com/analytics/devguides/reporting/data/v1>

---

META INSIGHTS

Use the Meta Graph API.

Fetch metrics:

page_impressions
page_reach
page_engaged_users

Environment variables:

META_PAGE_ID
META_ACCESS_TOKEN

Reference:
<https://developers.facebook.com/docs/graph-api/reference/page/insights/>

---

GOOGLE PLAY DOWNLOADS

Use Google Play Developer Reporting API.

Fetch:

daily installs
active users

Environment variables:

PLAY_PACKAGE_NAME
GOOGLE_SERVICE_ACCOUNT_KEY

Reference:
<https://developers.google.com/play/developer/reporting>

---

APP STORE CONNECT

Use App Store Connect API.

Fetch:

app downloads
impressions
active devices

Authentication must use JWT.

Environment variables:

APPSTORE_KEY_ID
APPSTORE_ISSUER_ID
APPSTORE_PRIVATE_KEY

Reference:
<https://developer.apple.com/documentation/appstoreconnectapi>

---

DATA COLLECTION STRATEGY

Do NOT fetch external APIs on every page request.

Instead:

Create a background job that runs once per day.

Steps:

1. Fetch data from all APIs
2. Normalize the results
3. Store daily metrics in a database

Tables:

analytics_daily

* date
* users
* sessions
* page_views

downloads_daily

* date
* android_downloads
* ios_downloads

social_daily

* date
* impressions
* reach
* engagement

The public page must read data from the database.

---

UI DESIGN

Design must look clean and professional.

Requirements:

Large metrics cards
Modern charts
Responsive layout
Minimalist style

Layout order:

Header
KPI cards
Traffic chart
App downloads chart
Social media chart

---

PERFORMANCE

Implement:

SWR for data fetching
API route caching
Static generation if possible

---

SECURITY

All API keys must be stored in environment variables.

No secrets should be exposed in the frontend.

---

EXTRA FEATURES

Add:

Auto refresh every 24 hours
"Last updated" timestamp
CSV export button
Dark mode support

---

FINAL RESULT

Generate the full project including:

Next.js code
API integrations
charts components
example .env file
database schema

Add comments explaining the architecture.
