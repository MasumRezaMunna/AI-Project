"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import ExperienceCard from "@/components/ExperienceCard";
import SkeletonCard from "@/components/SkeletonCard";
import TrailDivider from "@/components/TrailDivider";
import Stamp from "@/components/Stamp";
import { getExperiences } from "@/lib/api";

const CATEGORY_BLURBS: { category: string; copy: string }[] = [
  { category: "Adventure", copy: "Treks, climbs, and desert camps that earn the view." },
  { category: "Culinary", copy: "Meals built around the people who actually cook them." },
  { category: "Wildlife", copy: "Encounters timed to migrations and seasons, not schedules." },
  { category: "Wellness", copy: "Slow mornings, real practitioners, no resort gloss." },
];

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["experiences", "featured"],
    queryFn: () => getExperiences({ sort: "rating-desc", limit: 8, page: 1 }),
  });

  return (
    <>
      <Hero />

      {/* Stats / proof section */}
      <section className="mx-auto max-w-content px-6 py-10">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ["12", "curated trips"],
            ["8", "countries"],
            ["4.7", "average rating"],
            ["1,800+", "travelers hosted"],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="font-display text-3xl font-semibold text-forest-500 dark:text-mustard-300">
                {num}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-ink/60 dark:text-ink-dark/60">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <TrailDivider label="featured trips" />

      {/* Featured listing */}
      <section className="mx-auto max-w-content px-6 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold">Top-rated right now</h2>
            <p className="mt-1 text-sm text-ink/65 dark:text-ink-dark/65">
              The highest-rated trips across every category.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden shrink-0 text-sm font-medium text-forest-500 hover:underline dark:text-mustard-300 sm:block"
          >
            View all experiences →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.items.map((exp) => <ExperienceCard key={exp.id} experience={exp} />)}
        </div>

        <Link
          href="/explore"
          className="mt-8 block text-center text-sm font-medium text-forest-500 hover:underline dark:text-mustard-300 sm:hidden"
        >
          View all experiences →
        </Link>
      </section>

      <TrailDivider label="by category" />

      {/* Category highlights */}
      <section className="mx-auto max-w-content px-6 py-12">
        <h2 className="font-display text-3xl font-semibold">Find your kind of trip</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_BLURBS.map(({ category, copy }) => (
            <Link
              key={category}
              href={`/explore?category=${encodeURIComponent(category)}`}
              className="rounded-card border border-ink/10 bg-paper p-5 transition hover:-translate-y-0.5 hover:shadow-card dark:border-ink-dark/10 dark:bg-paper-dark"
            >
              <Stamp label={category} />
              <p className="mt-3 text-sm text-ink/75 dark:text-ink-dark/75">{copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <TrailDivider label="how it works" />

      {/* Process section */}
      <section className="mx-auto max-w-content px-6 py-12">
        <h2 className="font-display text-3xl font-semibold">How a trip comes together</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            ["Browse or ask", "Filter the catalog yourself, or describe what you want to the AI Trip Concierge."],
            ["Check the details", "Every trip lists exactly what's included, who's guiding, and real traveler reviews."],
            ["Go", "Small groups, local guides, and an itinerary built around the place — not a bus schedule."],
          ].map(([title, copy]) => (
            <div key={title as string}>
              <p className="font-display text-xl font-semibold">{title}</p>
              <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <TrailDivider label="ask the concierge" />

      {/* AI Concierge teaser */}
      <section className="mx-auto max-w-content px-6 py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold">
              Not sure where to start?
            </h2>
            <p className="mt-3 max-w-md text-ink/70 dark:text-ink-dark/70">
              Tell the AI Trip Concierge your budget, pace, and what you're in the mood for. It reads the live catalog and explains exactly why each pick fits.
            </p>
            <Link
              href="/explore#concierge"
              className="mt-5 inline-block rounded-full bg-forest-500 px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600"
            >
              Try the AI Concierge
            </Link>
          </div>
          <div className="rounded-card border border-ink/10 bg-forest-50 p-6 font-mono text-sm dark:border-ink-dark/10 dark:bg-forest-700/20">
            <p className="text-ink/50 dark:text-ink-dark/50">You</p>
            <p className="mt-1">"Something physically challenging with mountains, 4–5 days"</p>
            <p className="mt-4 text-ink/50 dark:text-ink-dark/50">Concierge</p>
            <p className="mt-1 text-ink/80 dark:text-ink-dark/80">
              Patagonia Trekking Expedition — 5 days, Torres del Paine, rated 4.8. Matches your timeframe and difficulty exactly...
            </p>
          </div>
        </div>
      </section>

      <TrailDivider label="what people say" />

      {/* Testimonials */}
      <section className="mx-auto max-w-content px-6 py-12">
        <h2 className="font-display text-3xl font-semibold">From recent travelers</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { quote: "Our guide Felipe spotted a weather window nobody else saw and got us to the towers right as the light broke through.", name: "Marco T.", trip: "Patagonia Trekking" },
            { quote: "Snorkelling with sea lions was the best wildlife encounter of my life — they were genuinely playing with us.", name: "Carla V.", trip: "Galápagos Cruise" },
            { quote: "Felt like visiting family, not a tour. The wine pairing with truffle pasta is something I still think about.", name: "Daniel W.", trip: "Tuscany Truffle Hunting" },
          ].map((t) => (
            <figure key={t.name} className="rounded-card border border-ink/10 bg-paper p-5 dark:border-ink-dark/10 dark:bg-paper-dark">
              <blockquote className="text-sm leading-relaxed text-ink/80 dark:text-ink-dark/80">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-3 font-mono text-xs text-ink/50 dark:text-ink-dark/50">
                {t.name} · {t.trip}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <TrailDivider />

      {/* CTA */}
      <section className="mx-auto max-w-content px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          Twelve trips. Eight countries. Zero filler days.
        </h2>
        <Link
          href="/explore"
          className="mt-6 inline-block rounded-full bg-forest-500 px-7 py-3.5 text-sm font-medium text-paper hover:bg-forest-600"
        >
          Browse all experiences
        </Link>
      </section>
    </>
  );
}
