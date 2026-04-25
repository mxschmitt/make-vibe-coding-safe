import Link from "next/link";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand-mark";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <BrandMark />
        <nav className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <Link
              href="/app"
              className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Open my tasks
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <p className="mb-4 inline-block rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            AI Council SF 2026 · May 12–14
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            Make your todos <span className="italic">vibe-coded safe</span>.
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A tiny todo app built live on stage — then kept honest by Playwright
            tests an agent can run, trace, and repair. Demo app for Max
            Schmitt&apos;s lightning talk.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get started
            </Link>
            <a
              href="https://aicouncil.com/talks26/make-vibe-coding-safe-how-to-test-with-playwright"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Watch the talk →
            </a>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-zinc-500 dark:text-zinc-500">
        Built live for AI Council SF 2026. Psst — try the Konami code.
      </footer>
    </div>
  );
}
