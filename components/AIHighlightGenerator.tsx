"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { aiHighlight } from "@/lib/api";

export default function AIHighlightGenerator({ experienceId }: { experienceId: string }) {
  const [interest, setInterest] = useState("");

  const mutation = useMutation({
    mutationFn: () => aiHighlight(experienceId, interest || undefined),
  });

  return (
    <div className="rounded-card border border-mustard-500/30 bg-mustard-100/40 p-5 dark:border-mustard-300/20 dark:bg-forest-700/20">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mustard-500 text-forest-700">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </span>
        <h3 className="font-display text-lg font-semibold">Why you'll love this</h3>
      </div>

      <p className="mt-2 text-sm text-ink/70 dark:text-ink-dark/70">
        Optionally tell the AI what you're into, and it'll write a short, specific take on this trip.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="e.g. photography, food, solo travel (optional)"
          className="flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm placeholder:text-ink/40 dark:border-ink-dark/20 dark:bg-paper-dark dark:placeholder:text-ink-dark/40"
        />
        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="shrink-0 rounded-full bg-mustard-500 px-5 py-2 text-sm font-medium text-forest-700 transition hover:bg-mustard-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Writing…" : "Generate"}
        </button>
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-clay-600">
          {mutation.error instanceof Error && mutation.error.message.includes("503")
            ? "AI features need a free GEMINI_API_KEY set in the server's .env file."
            : "Couldn't generate a highlight right now. Try again."}
        </p>
      )}

      {mutation.isSuccess && (
        <p className="mt-4 rounded-xl bg-paper p-4 text-sm leading-relaxed dark:bg-paper-dark">
          {mutation.data.highlight}
        </p>
      )}
    </div>
  );
}
