"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar({
  initialValue,
  onSearch,
}: {
  initialValue: string;
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  const debounced = useDebouncedCallback((v: string) => {
    onSearch(v);
  }, 400);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="relative w-full">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-ink-dark/40"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          debounced(e.target.value);
        }}
        placeholder="Search by destination, country, or tag…"
        aria-label="Search experiences"
        className="w-full rounded-full border border-ink/15 bg-paper py-3 pl-11 pr-4 text-sm shadow-card placeholder:text-ink/40 dark:border-ink-dark/20 dark:bg-paper-dark dark:placeholder:text-ink-dark/40"
      />
    </div>
  );
}
