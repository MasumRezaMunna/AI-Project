export default function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-ink/10 bg-paper shadow-card dark:border-ink-dark/10 dark:bg-paper-dark">
      <div className="aspect-[4/3] w-full animate-pulse bg-moss-100 dark:bg-forest-700/40" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
        <div className="h-3 w-full animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
        <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-3 dark:border-ink-dark/10">
          <div className="h-4 w-16 animate-pulse rounded bg-moss-100 dark:bg-forest-700/40" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-moss-100 dark:bg-forest-700/40" />
        </div>
      </div>
    </div>
  );
}
