"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { aiRecommend, getExperiences } from "@/lib/api";
import { AIRecommendResponse } from "@/lib/types";
import Stamp from "./Stamp";

const schema = z.object({
  prompt: z
    .string()
    .min(8, "Tell us a bit more — try mentioning a vibe, budget, or activity.")
    .max(400, "Keep it under 400 characters."),
});

type FormValues = z.infer<typeof schema>;

const EXAMPLES = [
  "A relaxing trip under $300 with water and good food",
  "Something physically challenging with mountains, 4-5 days",
  "Wildlife encounters that don't feel like a zoo",
];

export default function AIConciergeBox() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Pull the full catalog so we can render matched cards by id.
  const { data: catalog } = useQuery({
    queryKey: ["experiences", "all-for-concierge"],
    queryFn: () => getExperiences({ limit: 24, page: 1 }),
    staleTime: 60_000,
  });

  const mutation = useMutation<AIRecommendResponse, Error, string>({
    mutationFn: (prompt: string) => aiRecommend(prompt),
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values.prompt);
  }

  return (
    <div
      id="concierge"
      className="rounded-card border border-forest-500/20 bg-forest-50 p-6 dark:border-mustard-300/20 dark:bg-forest-700/20 md:p-8"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-500 text-paper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </span>
        <h2 className="font-display text-2xl font-semibold">AI Trip Concierge</h2>
      </div>
      <p className="mt-2 max-w-xl text-sm text-ink/70 dark:text-ink-dark/70">
        Describe what you're after in plain language. The AI reads the live catalog and picks the closest matches, with reasons.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <textarea
          {...register("prompt")}
          rows={2}
          placeholder="e.g. A relaxing trip under $300 with water and good food"
          className="w-full resize-none rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-sm shadow-card placeholder:text-ink/40 dark:border-ink-dark/20 dark:bg-paper-dark dark:placeholder:text-ink-dark/40"
        />
        {errors.prompt && (
          <p className="mt-1 text-xs text-clay-600">{errors.prompt.message}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setValue("prompt", ex, { shouldValidate: true })}
              className="rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/70 hover:border-mustard-500 hover:text-mustard-600 dark:border-ink-dark/20 dark:text-ink-dark/70 dark:hover:text-mustard-300"
            >
              {ex}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-4 rounded-full bg-forest-500 px-6 py-2.5 text-sm font-medium text-paper transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "Thinking…" : "Get recommendations"}
        </button>
      </form>

      {mutation.isError && (
        <p className="mt-4 rounded-xl bg-clay-300/20 px-4 py-3 text-sm text-clay-600">
          {mutation.error.message.includes("GEMINI_API_KEY") || mutation.error.message.includes("503")
            ? "The AI concierge isn't configured yet — add a free GEMINI_API_KEY to the server's .env file."
            : "Couldn't reach the AI concierge. Please try again."}
        </p>
      )}

      {mutation.isSuccess && (
        <div className="mt-6 border-t border-ink/10 pt-5 dark:border-ink-dark/10">
          <p className="text-sm italic text-ink/70 dark:text-ink-dark/70">
            “{mutation.data.summary}”
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {mutation.data.recommendations.map((rec) => {
              const match = catalog?.items.find((e) => e.id === rec.id);
              if (!match) return null;
              return (
                <Link
                  key={rec.id}
                  href={`/experiences/${rec.id}`}
                  className="block rounded-xl border border-ink/10 bg-paper p-4 transition hover:border-mustard-500 dark:border-ink-dark/10 dark:bg-paper-dark"
                >
                  <Stamp label={match.category} />
                  <p className="mt-2 font-display text-base font-semibold leading-tight">
                    {match.title}
                  </p>
                  <p className="mt-1 text-xs text-ink/60 dark:text-ink-dark/60">
                    {match.location} · ${match.price}
                  </p>
                  <p className="mt-2 text-xs text-ink/70 dark:text-ink-dark/70">{rec.reason}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
