"use client";

import { SortOption } from "@/lib/types";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "rating-desc", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      aria-label="Sort experiences"
      className="rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm dark:border-ink-dark/20 dark:bg-paper-dark"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
