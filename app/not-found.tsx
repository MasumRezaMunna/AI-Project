import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-6 py-24 text-center">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-forest-500 dark:text-mustard-300">
        <path d="M3 18c3-1 4-7 7-9s5 6 8 4M3 6l3 1M21 18l-3-1" strokeLinecap="round" />
      </svg>
      <h1 className="mt-6 font-display text-4xl font-semibold">This trail goes nowhere</h1>
      <p className="mt-3 max-w-sm text-ink/65 dark:text-ink-dark/65">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        href="/explore"
        className="mt-7 rounded-full bg-forest-500 px-6 py-3 text-sm font-medium text-paper hover:bg-forest-600"
      >
        Browse all experiences
      </Link>
    </div>
  );
}
