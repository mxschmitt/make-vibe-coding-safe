"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signupAction, type FormState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? "Creating account…" : "Sign up"}
    </button>
  );
}

export function SignupForm() {
  const [state, action] = useActionState<FormState, FormData>(
    signupAction,
    undefined
  );
  return (
    <form action={action} className="flex flex-col gap-3">
      <label className="text-sm font-medium" htmlFor="name">
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        required
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        placeholder="Ada Lovelace"
      />
      <label className="mt-2 text-sm font-medium" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        placeholder="you@aicouncil.com"
      />
      <label className="mt-2 text-sm font-medium" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
        placeholder="At least 8 characters"
      />
      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
