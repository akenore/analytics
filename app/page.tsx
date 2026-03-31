"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { Smartphone, Apple, Activity, Radio } from "lucide-react";
import type { DashboardData, DateRangeKey } from "@/lib/types";

import { Header } from "@/components/Header";
import { KPICard } from "@/components/KPICard";
import { AppStatsChart } from "@/components/AppStatsChart";
import { DownloadsChart } from "@/components/DownloadsChart";
import { SocialChart } from "@/components/SocialChart";
import { SummaryStats } from "@/components/SummaryStats";
import { CSVExport } from "@/components/CSVExport";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-40" />
        </div>
        <div className="skeleton h-10 w-80" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-4 w-24 mb-4" />
            <div className="skeleton h-8 w-20 mb-3" />
            <div className="skeleton h-10 w-full" />
          </div>
        ))}
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card p-6">
          <div className="skeleton h-5 w-40 mb-2" />
          <div className="skeleton h-4 w-60 mb-5" />
          <div className="skeleton h-[300px] w-full" />
        </div>
      ))}
    </div>
  );
}

const KPI_GRADIENTS = {
  android: { from: "#10b981", to: "#059669", id: "sparkAndroid" },
  ios: { from: "#6366f1", to: "#4f46e5", id: "sparkIos" },
  appOpens: { from: "#3b82f6", to: "#2563eb", id: "sparkOpens" },
  social: { from: "#f43f5e", to: "#e11d48", id: "sparkSocial" },
};

export default function Home() {
  const [range, setRange] = useState<DateRangeKey>("30d");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data, error, isLoading } = useSWR<DashboardData>(
    `/api/analytics?range=${range}`,
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL,
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-6 card !border-red-200 dark:!border-red-500/20 bg-red-50 dark:bg-red-500/5 p-5">
            <p className="text-red-600 dark:text-red-400 font-semibold text-sm">
              Failed to load analytics data. Please try refreshing the page.
            </p>
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {data && !isLoading && (
          <div className="space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <Header
                  selectedRange={range}
                  onRangeChange={setRange}
                  lastUpdated={data.lastUpdated}
                />
              </div>
              <div className="shrink-0 pt-1">
                <CSVExport data={data} />
              </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                metric={data.kpis.totalAndroidDownloads}
                icon={<Smartphone className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />}
                gradient={KPI_GRADIENTS.android}
                delay={0}
              />
              <KPICard
                metric={data.kpis.totalIosDownloads}
                icon={<Apple className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />}
                gradient={KPI_GRADIENTS.ios}
                delay={80}
              />
              <KPICard
                metric={data.kpis.totalAppOpens}
                icon={<Activity className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />}
                gradient={KPI_GRADIENTS.appOpens}
                delay={160}
              />
              <KPICard
                metric={data.kpis.totalSocialReach}
                icon={<Radio className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400" />}
                gradient={KPI_GRADIENTS.social}
                delay={240}
              />
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <AppStatsChart data={data.appStats} />
              <DownloadsChart data={data.downloads} />
            </div>

            <SocialChart data={data.social} />

            <SummaryStats
              totalDownloads={data.summary.totalDownloads}
              totalAppOpens={data.summary.totalAppOpens}
              totalAppEvents={data.summary.totalAppEvents}
              totalSocialReach={data.summary.totalSocialReach}
            />

            <footer className="pt-4 pb-6 text-center">
              <p className="text-[12px] font-medium text-slate-400 dark:text-slate-600">
                Fielmedina Analytics Dashboard • Data refreshes every 24 hours •{" "}
                <span className="text-slate-500 dark:text-slate-500">
                  {new Date(data.lastUpdated).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
}
