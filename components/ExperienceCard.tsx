import Image from "next/image";
import Link from "next/link";
import { Experience } from "@/lib/types";
import Stamp from "./Stamp";

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-paper shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover dark:border-ink-dark/10 dark:bg-paper-dark">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={experience.images[0]}
          alt={experience.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <Stamp label={experience.category} className="absolute left-3 top-3" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {experience.title}
          </h3>
        </div>
        <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
          {experience.location}, {experience.country}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-ink/75 dark:text-ink-dark/75">
          {experience.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-3 font-mono text-xs text-ink/70 dark:text-ink-dark/70">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-mustard-500">
              <path d="M12 2l2.9 6.4 7 .7-5.3 4.6 1.6 6.9L12 17l-6.2 3.6 1.6-6.9-5.3-4.6 7-.7Z" />
            </svg>
            {experience.rating.toFixed(1)} ({experience.reviewCount})
          </span>
          <span>·</span>
          <span>{experience.durationDays}d</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3 dark:border-ink-dark/10">
          <p className="font-mono text-sm">
            <span className="font-semibold">${experience.price}</span>
            <span className="text-ink/50 dark:text-ink-dark/50"> / person</span>
          </p>
          <Link
            href={`/experiences/${experience.id}`}
            className="rounded-full border border-forest-500 px-3 py-1.5 text-xs font-medium text-forest-500 transition hover:bg-forest-500 hover:text-paper dark:border-mustard-300 dark:text-mustard-300 dark:hover:bg-mustard-300 dark:hover:text-forest-700"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
