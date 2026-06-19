export default function TrailDivider({ label }: { label?: string }) {
  return (
    <div className="mx-auto flex max-w-content items-center gap-4 px-6 py-2 text-forest-500 dark:text-mustard-300">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden />
      <div className="trail-divider flex-1 text-current" aria-hidden />
      {label ? (
        <span className="shrink-0 font-mono text-xs uppercase tracking-[0.18em] opacity-70">
          {label}
        </span>
      ) : null}
      <div className="trail-divider flex-1 text-current" aria-hidden />
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden />
    </div>
  );
}
