import { Review } from "@/lib/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-mustard-500"
        >
          <path d="M12 2l2.9 6.4 7 .7-5.3 4.6 1.6 6.9L12 17l-6.2 3.6 1.6-6.9-5.3-4.6 7-.7Z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-ink/60 dark:text-ink-dark/60">
        No reviews yet for this experience.
      </p>
    );
  }

  return (
    <ul className="space-y-5">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-ink/10 pb-5 last:border-0 dark:border-ink-dark/10">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium">{review.author}</p>
            <time className="font-mono text-xs text-ink/50 dark:text-ink-dark/50" dateTime={review.date}>
              {new Date(review.date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <div className="mt-1">
            <Stars rating={review.rating} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/80 dark:text-ink-dark/80">
            {review.comment}
          </p>
        </li>
      ))}
    </ul>
  );
}
