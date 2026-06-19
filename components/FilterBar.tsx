"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api";

export interface FilterValues {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export default function FilterBar({
  values,
  onChange,
}: {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={values.category || "All"}
        onChange={(e) => onChange({ ...values, category: e.target.value })}
        aria-label="Filter by category"
        className="rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm dark:border-ink-dark/20 dark:bg-paper-dark"
      >
        <option value="All">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={values.minRating ?? ""}
        onChange={(e) =>
          onChange({
            ...values,
            minRating: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        aria-label="Filter by minimum rating"
        className="rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm dark:border-ink-dark/20 dark:bg-paper-dark"
      >
        <option value="">Any rating</option>
        <option value="4">4.0+</option>
        <option value="4.5">4.5+</option>
        <option value="4.8">4.8+</option>
      </select>

      <div className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm dark:border-ink-dark/20">
        <span className="font-mono text-xs text-ink/60 dark:text-ink-dark/60">$</span>
        <input
          type="number"
          min={0}
          value={values.minPrice ?? ""}
          onChange={(e) =>
            onChange({
              ...values,
              minPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="Min"
          aria-label="Minimum price"
          className="w-16 bg-transparent outline-none placeholder:text-ink/40 dark:placeholder:text-ink-dark/40"
        />
        <span className="text-ink/30">–</span>
        <input
          type="number"
          min={0}
          value={values.maxPrice ?? ""}
          onChange={(e) =>
            onChange({
              ...values,
              maxPrice: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="Max"
          aria-label="Maximum price"
          className="w-16 bg-transparent outline-none placeholder:text-ink/40 dark:placeholder:text-ink-dark/40"
        />
      </div>

      {(values.category !== "All" ||
        values.minPrice ||
        values.maxPrice ||
        values.minRating) && (
        <button
          type="button"
          onClick={() => onChange({ category: "All" })}
          className="text-xs font-medium text-clay-500 underline-offset-2 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
