"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { getExperiences } from "@/lib/api";
import { SortOption } from "@/lib/types";
import ExperienceCard from "@/components/ExperienceCard";
import SkeletonCard from "@/components/SkeletonCard";
import SearchBar from "@/components/SearchBar";
import FilterBar, { FilterValues } from "@/components/FilterBar";
import SortDropdown from "@/components/SortDropdown";
import Pagination from "@/components/Pagination";
import AIConciergeBox from "@/components/AIConciergeBox";

const LIMIT = 8;

function ExplorePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort = (searchParams.get("sort") as SortOption) || "rating-desc";
  const page = Number(searchParams.get("page") || "1");

  const [localSearch, setLocalSearch] = useState(search);

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "All") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      // Any change other than page should reset pagination
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/explore?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const filters = useMemo(
    () => ({
      search,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sort,
      page,
      limit: LIMIT,
    }),
    [search, category, minPrice, maxPrice, minRating, sort, page]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["experiences", "explore", filters],
    queryFn: () => getExperiences(filters),
  });

  const filterValues: FilterValues = {
    category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
  };

  return (
    <div className="mx-auto max-w-content px-6 py-10">
      <h1 className="font-display text-4xl font-semibold">Explore experiences</h1>
      <p className="mt-2 text-ink/65 dark:text-ink-dark/65">
        {data ? `${data.total} trip${data.total === 1 ? "" : "s"} found` : "Searching the catalog…"}
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <SearchBar
          initialValue={localSearch}
          onSearch={(value) => {
            setLocalSearch(value);
            updateParams({ search: value });
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterBar values={filterValues} onChange={(v) => updateParams({ ...v })} />
          <SortDropdown value={sort} onChange={(v) => updateParams({ sort: v })} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
          : data?.items.map((exp) => <ExperienceCard key={exp.id} experience={exp} />)}
      </div>

      {!isLoading && data?.items.length === 0 && (
        <div className="mt-12 rounded-card border border-dashed border-ink/20 p-10 text-center dark:border-ink-dark/20">
          <p className="font-display text-xl font-semibold">No trips match those filters</p>
          <p className="mt-2 text-sm text-ink/60 dark:text-ink-dark/60">
            Try widening your price range or clearing a filter — or ask the AI Concierge below instead.
          </p>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={(p) => updateParams({ page: p })}
          />
        </div>
      )}

      <div className="mt-16">
        <AIConciergeBox />
      </div>

      {isFetching && !isLoading && (
        <p className="sr-only" role="status">
          Updating results…
        </p>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExplorePageInner />
    </Suspense>
  );
}
