"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getExperiences } from "@/lib/api";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/login");
    else if (user.role !== "admin") router.replace("/account");
  }, [authLoading, user, router]);

  const { data, isLoading: dataLoading } = useQuery({
    queryKey: ["experiences", "admin-overview"],
    queryFn: () => getExperiences({ limit: 24, page: 1 }),
    enabled: !!(user && user.role === "admin"),
  });

  // Compute catalog stats from the live API response.
  const stats = useMemo(() => {
    const items = data?.items ?? [];
    if (!items.length) return null;

    const byCategory = items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + 1;
      return acc;
    }, {});

    const sorted = (Object.entries(byCategory) as [string, number][]).sort(
      (a, b) => b[1] - a[1]
    );

    return {
      total: items.length,
      byCategory: sorted,
      avgRating: items.reduce((s, i) => s + i.rating, 0) / items.length,
      totalReviews: items.reduce((s, i) => s + i.reviewCount, 0),
      avgPrice: items.reduce((s, i) => s + i.price, 0) / items.length,
      countries: new Set(items.map((i) => i.country)).size,
    };
  }, [data]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-full bg-moss-100 dark:bg-forest-700/40" />
          <div className="space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
            <div className="h-4 w-32 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-clay-500 font-display text-xl font-semibold text-paper">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin overview</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
            {user.name} · {user.email}
          </p>
        </div>
        <span className="ml-auto inline-block rounded-full bg-clay-300/25 px-3 py-1 font-mono text-xs uppercase tracking-wide text-clay-600">
          admin
        </span>
      </div>

      {/* Overview cards */}
      {dataLoading || !stats ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-card bg-moss-100 dark:bg-forest-700/40"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: String(stats.total), label: "Live listings" },
              { value: stats.avgRating.toFixed(2), label: "Avg. rating" },
              { value: stats.totalReviews.toLocaleString(), label: "Total reviews" },
              { value: `$${Math.round(stats.avgPrice)}`, label: "Avg. price" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-card border border-ink/10 bg-paper p-5 dark:border-ink-dark/10 dark:bg-paper-dark"
              >
                <p className="font-mono text-3xl font-semibold text-forest-500 dark:text-mustard-300">
                  {value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink/60 dark:text-ink-dark/60">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div className="mt-8 rounded-card border border-ink/10 bg-paper p-6 dark:border-ink-dark/10 dark:bg-paper-dark">
            <h2 className="font-display text-xl font-semibold">Listings by category</h2>
            <ul className="mt-5 space-y-3">
              {stats.byCategory.map(([category, count]) => (
                <li key={category} className="flex items-center gap-4 text-sm">
                  <span className="w-24 shrink-0 text-ink/80 dark:text-ink-dark/80">
                    {category}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-moss-100 dark:bg-forest-700/40">
                    <div
                      className="h-full rounded-full bg-forest-500 transition-all dark:bg-mustard-300"
                      style={{ width: `${((count as number) / stats.total) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 shrink-0 text-right font-mono text-xs text-ink/55 dark:text-ink-dark/55">
                    {count as number}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick actions */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/explore"
              className="rounded-card border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-ink-dark/10 dark:bg-paper-dark"
            >
              <p className="font-display text-lg font-semibold">View full catalog</p>
              <p className="mt-1 text-sm text-ink/65 dark:text-ink-dark/65">
                Browse all {stats.total} experiences across {stats.countries} countries.
              </p>
            </Link>
            <Link
              href="/explore#concierge"
              className="rounded-card border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-ink-dark/10 dark:bg-paper-dark"
            >
              <p className="font-display text-lg font-semibold">AI Trip Concierge</p>
              <p className="mt-1 text-sm text-ink/65 dark:text-ink-dark/65">
                Test the AI recommendation feature with different prompts.
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
