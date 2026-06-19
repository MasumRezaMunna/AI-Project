"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : "";
    router.push(`/explore${params}`);
  }

  return (
    <section className="relative flex min-h-[62vh] flex-col justify-center overflow-hidden border-b border-ink/10 bg-paper dark:border-ink-dark/10 dark:bg-paper-dark md:min-h-[68vh]">
      {/* Signature trail-map background */}
      <svg
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-forest-500/15 dark:text-mustard-300/10"
        aria-hidden
      >
        <path
          d="M -50 420 C 150 380, 220 200, 380 220 S 600 380, 760 240 S 980 80, 1250 140"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="2 18"
          strokeLinecap="round"
        />
        {[
          [150, 380],
          [380, 220],
          [760, 240],
          [980, 80],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="currentColor" />
        ))}
      </svg>

      <div className="relative mx-auto w-full max-w-content px-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-mustard-600 dark:text-mustard-300">
          12 routes · 8 countries · locally guided
        </p>
        <h1 className="mt-4 max-w-2xl text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Travel where the guidebook stops talking.
        </h1>
        <p className="mt-5 max-w-xl text-balance text-lg text-ink/75 dark:text-ink-dark/75">
          Small-group trips built around people who actually live the place: a truffle hunter in Tuscany, a jazz trombonist in Tremé, a Berber family on the Erg Chebbi dunes.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
          <label htmlFor="hero-search" className="sr-only">
            Search experiences
          </label>
          <input
            id="hero-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “coastal”, “Japan”, or “stargazing”"
            className="flex-1 rounded-full border border-ink/15 bg-paper px-5 py-3 text-sm shadow-card placeholder:text-ink/40 dark:border-ink-dark/20 dark:bg-paper-dark dark:placeholder:text-ink-dark/40"
          />
          <button
            type="submit"
            className="rounded-full bg-forest-500 px-6 py-3 text-sm font-medium text-paper transition hover:bg-forest-600"
          >
            Search trips
          </button>
        </form>
      </div>
    </section>
  );
}
