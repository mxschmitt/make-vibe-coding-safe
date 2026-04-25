import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="px-6 py-4">
        <BrandMark />
      </header>
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            404 — route not found
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            The demo worked until the next iteration broke it.
          </h1>
          <p className="mt-4 text-sm text-zinc-500">
            A Playwright test would have caught this. Go home and we&apos;ll
            pretend it didn&apos;t happen.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Back to safety
          </Link>
        </div>
      </main>
    </div>
  );
}
