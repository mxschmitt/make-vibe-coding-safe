import Link from "next/link";
import { clearCompletedAction } from "@/app/actions";

export type Filter = "all" | "active" | "completed";

const TABS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

export function FilterTabs({ current }: { current: Filter }) {
  return (
    <div className="flex w-full items-center justify-between">
      <nav
        className="flex gap-1 rounded-md border border-zinc-200 p-1 text-sm dark:border-zinc-800"
        aria-label="Filter tasks"
      >
        {TABS.map((tab) => {
          const active = tab.key === current;
          return (
            <Link
              key={tab.key}
              href={tab.key === "all" ? "/app" : `/app?filter=${tab.key}`}
              aria-current={active ? "page" : undefined}
              className={`rounded-md px-3 py-1 font-medium transition-colors ${
                active
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <form action={clearCompletedAction}>
        <button
          type="submit"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          Clear completed
        </button>
      </form>
    </div>
  );
}
