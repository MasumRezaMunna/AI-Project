"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getExperienceById } from "@/lib/api";
import Stamp from "@/components/Stamp";
import ReviewList from "@/components/ReviewList";
import AIHighlightGenerator from "@/components/AIHighlightGenerator";
import ExperienceCard from "@/components/ExperienceCard";
import SkeletonCard from "@/components/SkeletonCard";

export default function ExperienceDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["experience", id],
    queryFn: () => getExperienceById(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="aspect-[16/9] w-full animate-pulse rounded-card bg-moss-100 dark:bg-forest-700/40" />
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
            <div className="h-4 w-full animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
          </div>
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-content px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">We couldn't find that trip</h1>
        <p className="mt-2 text-ink/65 dark:text-ink-dark/65">
          It may have been removed, or the link might be off.
        </p>
        <Link href="/explore" className="mt-6 inline-block rounded-full bg-forest-500 px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600">
          Browse all experiences
        </Link>
      </div>
    );
  }

  const { experience, related } = data;

  return (
    <div className="mx-auto max-w-content px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink/55 dark:text-ink-dark/55" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-forest-500 dark:hover:text-mustard-300">Home</Link>
        <span>/</span>
        <Link href="/explore" className="hover:text-forest-500 dark:hover:text-mustard-300">Explore</Link>
        <span>/</span>
        <span className="text-ink/80 dark:text-ink-dark/80">{experience.title}</span>
      </nav>

      {/* Gallery */}
      <div>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-card">
          <Image
            src={experience.images[activeImage]}
            alt={`${experience.title} — photo ${activeImage + 1}`}
            fill
            sizes="(max-width: 1240px) 100vw, 1240px"
            priority
            className="object-cover"
          />
          <Stamp label={experience.category} className="absolute left-4 top-4" />
        </div>
        {experience.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {experience.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === activeImage}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === activeImage ? "border-mustard-500" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-10 lg:col-span-2">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight">{experience.title}</h1>
            <p className="mt-2 text-ink/65 dark:text-ink-dark/65">
              {experience.location}, {experience.country}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-sm text-ink/70 dark:text-ink-dark/70">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-mustard-500">
                  <path d="M12 2l2.9 6.4 7 .7-5.3 4.6 1.6 6.9L12 17l-6.2 3.6 1.6-6.9-5.3-4.6 7-.7Z" />
                </svg>
                {experience.rating.toFixed(1)} ({experience.reviewCount} reviews)
              </span>
              <span>·</span>
              <span>{experience.durationDays} day{experience.durationDays > 1 ? "s" : ""}</span>
              <span>·</span>
              <span>{experience.difficulty}</span>
              <span>·</span>
              <span>{experience.groupSize}</span>
            </div>
          </div>

          {/* Overview */}
          <section>
            <h2 className="font-display text-2xl font-semibold">Overview</h2>
            <p className="mt-3 leading-relaxed text-ink/80 dark:text-ink-dark/80">{experience.description}</p>
          </section>

          {/* Key info / specifications */}
          <section>
            <h2 className="font-display text-2xl font-semibold">What's included</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {experience.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/80 dark:text-ink-dark/80">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-forest-500 dark:text-mustard-300">
                    <path d="m20 6-11 11-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-display text-lg font-semibold">Highlights</h3>
            <ul className="mt-3 space-y-2">
              {experience.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/80 dark:text-ink-dark/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mustard-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* AI Highlight Generator */}
          <section>
            <AIHighlightGenerator experienceId={experience.id} />
          </section>

          {/* Reviews */}
          <section>
            <h2 className="font-display text-2xl font-semibold">
              Reviews ({experience.reviewCount})
            </h2>
            <div className="mt-4">
              <ReviewList reviews={experience.reviews} />
            </div>
          </section>
        </div>

        {/* Booking card */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-card border border-ink/10 bg-paper p-6 shadow-card dark:border-ink-dark/10 dark:bg-paper-dark">
            <p className="font-mono text-3xl font-semibold">
              ${experience.price}
              <span className="text-base font-normal text-ink/50 dark:text-ink-dark/50"> / person</span>
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60 dark:text-ink-dark/60">Duration</dt>
                <dd>{experience.durationDays} day{experience.durationDays > 1 ? "s" : ""}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60 dark:text-ink-dark/60">Group size</dt>
                <dd>{experience.groupSize}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60 dark:text-ink-dark/60">Difficulty</dt>
                <dd>{experience.difficulty}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60 dark:text-ink-dark/60">Location</dt>
                <dd className="text-right">{experience.location}</dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-6 w-full rounded-full bg-forest-500 py-3 text-sm font-medium text-paper transition hover:bg-forest-600"
            >
              Reserve this trip
            </button>
            <p className="mt-2 text-center text-xs text-ink/45 dark:text-ink-dark/45">
              Demo project — no real booking is made.
            </p>
          </div>
        </aside>
      </div>

      {/* Related items */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-ink/10 pt-10 dark:border-ink-dark/10">
          <h2 className="font-display text-2xl font-semibold">More {experience.category.toLowerCase()} trips</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
