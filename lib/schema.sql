-- ─── Analytics Dashboard Database Schema (SQLite) ────────────────────────────
-- SQLite schema for storing daily aggregated metrics.
-- Stored locally at ./data/analytics.db

-- App usage stats (views, opens, events) per platform
CREATE TABLE IF NOT EXISTS app_stats_daily (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    date            TEXT NOT NULL UNIQUE,
    android_views   INTEGER NOT NULL DEFAULT 0,
    android_opens   INTEGER NOT NULL DEFAULT 0,
    android_events  INTEGER NOT NULL DEFAULT 0,
    ios_views       INTEGER NOT NULL DEFAULT 0,
    ios_opens       INTEGER NOT NULL DEFAULT 0,
    ios_events      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_app_stats_daily_date ON app_stats_daily (date DESC);

-- App downloads from Google Play and App Store Connect
CREATE TABLE IF NOT EXISTS downloads_daily (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    date                TEXT NOT NULL UNIQUE,
    android_downloads   INTEGER NOT NULL DEFAULT 0,
    ios_downloads       INTEGER NOT NULL DEFAULT 0,
    created_at          TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_downloads_daily_date ON downloads_daily (date DESC);

-- Social media performance — Facebook (Meta Graph API)
CREATE TABLE IF NOT EXISTS facebook_daily (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    date            TEXT NOT NULL UNIQUE,
    impressions     INTEGER NOT NULL DEFAULT 0,
    reach           INTEGER NOT NULL DEFAULT 0,
    engagement      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_facebook_daily_date ON facebook_daily (date DESC);

-- Social media performance — Instagram
CREATE TABLE IF NOT EXISTS instagram_daily (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    date            TEXT NOT NULL UNIQUE,
    impressions     INTEGER NOT NULL DEFAULT 0,
    reach           INTEGER NOT NULL DEFAULT 0,
    engagement      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_instagram_daily_date ON instagram_daily (date DESC);

-- Social media performance — TikTok
CREATE TABLE IF NOT EXISTS tiktok_daily (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    date            TEXT NOT NULL UNIQUE,
    views           INTEGER NOT NULL DEFAULT 0,
    likes           INTEGER NOT NULL DEFAULT 0,
    shares          INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tiktok_daily_date ON tiktok_daily (date DESC);

-- Metadata table to track last sync timestamps
CREATE TABLE IF NOT EXISTS sync_metadata (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    source      TEXT NOT NULL UNIQUE, -- 'meta', 'instagram', 'tiktok', 'google_play', 'app_store'
    last_synced TEXT,
    status      TEXT DEFAULT 'pending', -- 'pending', 'success', 'error'
    error_msg   TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
