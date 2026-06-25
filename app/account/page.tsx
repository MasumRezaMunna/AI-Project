"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  // Skeleton while session is being restored from Firebase.
  if (isLoading) {
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

  if (!user) return null; // redirect in progress

  return (
    <div className="mx-auto max-w-content px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-500 font-display text-xl font-semibold text-paper">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">{user.email}</p>
        </div>
        <span className="ml-auto inline-block rounded-full bg-forest-50 px-3 py-1 font-mono text-xs uppercase tracking-wide text-forest-500 dark:bg-forest-700/30 dark:text-mustard-300">
          {user.role}
        </span>
      </div>

      {/* Quick actions */}
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {[
          {
            title: "Browse all trips",
            href: "/explore",
            desc: "Search, filter, and sort the full catalog of 12 curated experiences.",
          },
          {
            title: "Ask the AI Concierge",
            href: "/explore#concierge",
            desc: "Describe what you're after in plain language and get matched trips with reasons.",
          },
          {
            title: "Top-rated trips",
            href: "/explore?sort=rating-desc",
            desc: "Jump straight to the highest-rated experiences across every category.",
          },
        ].map(({ title, href, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-card border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-ink-dark/10 dark:bg-paper-dark"
          >
            <p className="font-display text-lg font-semibold">{title}</p>
            <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Account details */}
      <div className="mt-10 rounded-card border border-ink/10 bg-paper p-6 dark:border-ink-dark/10 dark:bg-paper-dark">
        <h2 className="font-display text-xl font-semibold">Account details</h2>
        <dl className="mt-5 divide-y divide-ink/10 dark:divide-ink-dark/10">
          {[
            ["Name", user.name],
            ["Email", user.email],
            ["Role", user.role.charAt(0).toUpperCase() + user.role.slice(1)],
            ["Firebase UID", user.id],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-3 text-sm">
              <dt className="text-ink/60 dark:text-ink-dark/60">{label}</dt>
              <dd className={label === "Firebase UID" ? "font-mono text-xs" : ""}>
                {label === "Firebase UID" ? `${value.slice(0, 12)}…` : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
