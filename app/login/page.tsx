"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
} from "@/lib/demoAccounts";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function submitLogin(email: string, password: string) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      // AuthProvider.login throws a plain Error with a human-readable message
      // translated from the Firebase error code.
      const loggedInUser = await login(email, password);
      router.push(loggedInUser.role === "admin" ? "/admin" : "/account");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't sign in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmit(values: FormValues) {
    submitLogin(values.email, values.password);
  }

  function fillAndSubmit(email: string, password: string) {
    setValue("email", email, { shouldValidate: true });
    setValue("password", password, { shouldValidate: true });
    submitLogin(email, password);
  }

  async function handleGoogleLogin() {
    setServerError(null);
    setSocialNotice(false);
    setIsGoogleLoading(true);
    try {
      const loggedInUser = await loginWithGoogle();
      router.push(loggedInUser.role === "admin" ? "/admin" : "/account");
    } catch (err: unknown) {
      // AuthProvider already translates and re-throws; empty string means the
      // user dismissed the popup — we simply ignore that.
      const msg = err instanceof Error ? err.message : "";
      if (msg) setServerError(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  }

  const busy = isSubmitting || isGoogleLoading;

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-sm text-ink/65 dark:text-ink-dark/65">
        Sign in to manage your trips and reviews.
      </p>

      {/* ── Demo quick-login buttons ──────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => fillAndSubmit(DEMO_USER_EMAIL, DEMO_USER_PASSWORD)}
          disabled={busy}
          className="flex-1 rounded-full border border-forest-500 px-4 py-2.5 text-sm font-medium text-forest-500 transition hover:bg-forest-500 hover:text-paper disabled:opacity-60 dark:border-mustard-300 dark:text-mustard-300 dark:hover:bg-mustard-300 dark:hover:text-forest-700"
        >
          Demo login — User
        </button>
        <button
          type="button"
          onClick={() => fillAndSubmit(DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD)}
          disabled={busy}
          className="flex-1 rounded-full border border-clay-500 px-4 py-2.5 text-sm font-medium text-clay-500 transition hover:bg-clay-500 hover:text-paper disabled:opacity-60"
        >
          Demo login — Admin
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-ink/45 dark:text-ink-dark/45">
        Pre-seeded Firebase accounts — auto-fill and sign you in instantly.
      </p>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/40 dark:text-ink-dark/40">
        <span className="h-px flex-1 bg-ink/10 dark:bg-ink-dark/10" />
        or sign in with email
        <span className="h-px flex-1 bg-ink/10 dark:bg-ink-dark/10" />
      </div>

      {/* ── Email / password form ─────────────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="login-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition focus:border-forest-500 dark:border-ink-dark/20 dark:bg-paper-dark dark:focus:border-mustard-300"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-clay-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition focus:border-forest-500 dark:border-ink-dark/20 dark:bg-paper-dark dark:focus:border-mustard-300"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-clay-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="rounded-xl bg-clay-300/20 px-4 py-3 text-sm text-clay-600" role="alert">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-1 rounded-full bg-forest-500 py-2.5 text-sm font-medium text-paper transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {/* ── Social login ─────────────────────────────────────────────────── */}
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-ink/40 dark:text-ink-dark/40">
        <span className="h-px flex-1 bg-ink/10 dark:bg-ink-dark/10" />
        or continue with
        <span className="h-px flex-1 bg-ink/10 dark:bg-ink-dark/10" />
      </div>

      <div className="flex gap-3">
        {/* Real Firebase Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 py-2.5 text-sm font-medium transition hover:border-forest-500 disabled:opacity-60 dark:border-ink-dark/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.05H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.95l3.66-2.85Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38Z" />
          </svg>
          {isGoogleLoading ? "Signing in…" : "Google"}
        </button>

        {/* Facebook is UI-only — requires a separate Meta developer app */}
        <button
          type="button"
          onClick={() => setSocialNotice(true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 py-2.5 text-sm font-medium transition hover:border-forest-500 dark:border-ink-dark/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
            <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.5 0-1.96.94-1.96 1.9v2.24h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
          </svg>
          Facebook
        </button>
      </div>

      {socialNotice && (
        <p className="mt-3 rounded-xl bg-moss-100 px-4 py-3 text-center text-xs text-ink/70 dark:bg-forest-700/30 dark:text-ink-dark/70">
          Facebook login requires a separate Meta developer app registration — not wired up for this demo. Use Google, a demo account, or email/password instead.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-ink/65 dark:text-ink-dark/65">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-forest-500 hover:underline dark:text-mustard-300"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
