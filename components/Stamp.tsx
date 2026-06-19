import clsx from "clsx";

const CATEGORY_ROTATION: Record<string, string> = {
  Adventure: "-rotate-6",
  Culinary: "rotate-3",
  Cultural: "-rotate-3",
  Wildlife: "rotate-6",
  Wellness: "-rotate-2",
  Coastal: "rotate-2",
  Mountain: "-rotate-4",
  City: "rotate-4",
};

export default function Stamp({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const rotation = CATEGORY_ROTATION[label] ?? "-rotate-3";

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-stamp border-2 px-3 py-1",
        "font-mono text-[0.65rem] uppercase tracking-[0.12em]",
        "border-forest-500/70 text-forest-500 dark:border-mustard-300/80 dark:text-mustard-300",
        "bg-paper/90 dark:bg-paper-dark/90",
        rotation,
        className
      )}
    >
      {label}
    </span>
  );
}
