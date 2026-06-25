"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name (at least 2 characters)."),
    email: z.string().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
      .regex(/[0-9]/, "Password must include at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setIsSubmitting(true);
    try {
      // AuthProvider.register throws a plain Error with a human-readable
      // message already translated from the Firebase error code.
      await registerUser(values.name, values.email, values.password);
      router.push("/account");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Couldn't create your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">Create your account</h1>
      <p className="mt-2 text-sm text-ink/65 dark:text-ink-dark/65">
        Sign up to save trips and leave reviews. Takes about 20 seconds.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 flex flex-col gap-4"
        noValidate
      >
        <div>
          <label htmlFor="reg-name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            {...register("name")}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition focus:border-forest-500 dark:border-ink-dark/20 dark:bg-paper-dark dark:focus:border-mustard-300"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-clay-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reg-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="reg-email"
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
          <label htmlFor="reg-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition focus:border-forest-500 dark:border-ink-dark/20 dark:bg-paper-dark dark:focus:border-mustard-300"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-clay-600" role="alert">
              {errors.password.message}
            </p>
          )}
          <p className="mt-1 text-xs text-ink/45 dark:text-ink-dark/45">
            Min 8 characters, one uppercase letter, one number.
          </p>
        </div>

        <div>
          <label htmlFor="reg-confirm" className="text-sm font-medium">
            Confirm password
          </label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition focus:border-forest-500 dark:border-ink-dark/20 dark:bg-paper-dark dark:focus:border-mustard-300"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-clay-600" role="alert">
              {errors.confirmPassword.message}
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
          disabled={isSubmitting}
          className="mt-1 rounded-full bg-forest-500 py-2.5 text-sm font-medium text-paper transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink/65 dark:text-ink-dark/65">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-forest-500 hover:underline dark:text-mustard-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
