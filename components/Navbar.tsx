"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/providers/AuthProvider";

const CATEGORIES = [
  "Adventure",
  "Culinary",
  "Cultural",
  "Wildlife",
  "Wellness",
  "Coastal",
  "Mountain",
  "City",
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    setProfileOpen(false);
    setMobileOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink/10 bg-paper/90 backdrop-blur dark:border-ink-dark/10 dark:bg-paper-dark/90">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mustard-500">
            <path d="M3 18c3-1 4-7 7-9s5 6 8 4M3 6l3 1M21 18l-3-1" strokeLinecap="round" />
          </svg>
          Wanderlust Trails
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-mustard-600 dark:hover:text-mustard-300">
            Home
          </Link>
          <Link href="/explore" className="text-sm font-medium hover:text-mustard-600 dark:hover:text-mustard-300">
            Explore
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCategoryOpen((o) => !o)}
              aria-expanded={categoryOpen}
              className="flex items-center gap-1 text-sm font-medium hover:text-mustard-600 dark:hover:text-mustard-300"
            >
              Browse by category
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {categoryOpen && (
              <div className="absolute left-1/2 top-full grid w-[420px] -translate-x-1/2 grid-cols-2 gap-1 rounded-card border border-ink/10 bg-paper p-3 shadow-card dark:border-ink-dark/10 dark:bg-paper-dark">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/explore?category=${encodeURIComponent(cat)}`}
                    className="rounded-md px-3 py-2 text-sm hover:bg-forest-50 dark:hover:bg-forest-700/30"
                    onClick={() => setCategoryOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/explore#concierge"
            className="rounded-full bg-forest-500 px-4 py-2 text-sm font-medium text-paper transition hover:bg-forest-600"
          >
            Ask the AI Concierge
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {!isLoading && !user && (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="text-sm font-medium hover:text-mustard-600 dark:hover:text-mustard-300"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-medium hover:border-forest-500 dark:border-ink-dark/20"
              >
                Sign up
              </Link>
            </div>
          )}

          {!isLoading && user && (
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                aria-expanded={profileOpen}
                aria-label="Account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-500 font-mono text-sm font-semibold text-paper"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full w-56 rounded-card border border-ink/10 bg-paper p-3 shadow-card dark:border-ink-dark/10 dark:bg-paper-dark">
                  <p className="truncate px-2 text-sm font-medium">{user.name}</p>
                  <p className="truncate px-2 text-xs text-ink/55 dark:text-ink-dark/55">{user.email}</p>
                  <span className="mx-2 mt-2 inline-block rounded-full bg-mustard-100 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-mustard-600 dark:bg-forest-700/40 dark:text-mustard-300">
                    {user.role}
                  </span>
                  <hr className="my-3 border-ink/10 dark:border-ink-dark/10" />
                  <Link
                    href={user.role === "admin" ? "/admin" : "/account"}
                    onClick={() => setProfileOpen(false)}
                    className="block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-forest-50 dark:hover:bg-forest-700/30"
                  >
                    {user.role === "admin" ? "Admin overview" : "My account"}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-md px-2 py-2 text-left text-sm text-clay-600 hover:bg-clay-300/15"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 md:hidden dark:border-ink-dark/20"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 px-6 py-4 md:hidden dark:border-ink-dark/10">
          <Link href="/" className="rounded-md px-2 py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link href="/explore" className="rounded-md px-2 py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
            Explore
          </Link>
          <p className="mt-2 px-2 text-xs font-mono uppercase tracking-wider opacity-60">Browse by category</p>
          <div className="grid grid-cols-2 gap-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/explore?category=${encodeURIComponent(cat)}`}
                className="rounded-md px-2 py-2 text-sm"
                onClick={() => setMobileOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>
          <Link
            href="/explore#concierge"
            className="mt-3 rounded-full bg-forest-500 px-4 py-2 text-center text-sm font-medium text-paper"
            onClick={() => setMobileOpen(false)}
          >
            Ask the AI Concierge
          </Link>

          <hr className="my-3 border-ink/10 dark:border-ink-dark/10" />

          {!isLoading && !user && (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-full border border-ink/15 px-4 py-2 text-center text-sm font-medium dark:border-ink-dark/20"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-full bg-forest-600 px-4 py-2 text-center text-sm font-medium text-paper"
              >
                Sign up
              </Link>
            </div>
          )}

          {!isLoading && user && (
            <div className="px-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-ink/55 dark:text-ink-dark/55">
                {user.email} · {user.role}
              </p>
              <Link
                href={user.role === "admin" ? "/admin" : "/account"}
                onClick={() => setMobileOpen(false)}
                className="mt-3 block w-full rounded-full border border-ink/15 px-4 py-2 text-center text-sm font-medium dark:border-ink-dark/20"
              >
                {user.role === "admin" ? "Admin overview" : "My account"}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-full border border-clay-500 px-4 py-2 text-sm font-medium text-clay-600"
              >
                Log out
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
