import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listTodos } from "@/lib/todos";
import { BrandMark } from "@/components/brand-mark";
import { LogoutButton } from "@/components/logout-button";
import { KonamiListener } from "@/components/konami-listener";
import { TodoComposer } from "./todo-composer";
import { TodoList } from "./todo-list";
import { FilterTabs, type Filter } from "./filter-tabs";

type SearchParams = { filter?: string };

function parseFilter(value: string | undefined): Filter {
  return value === "active" || value === "completed" ? value : "all";
}

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const todos = listTodos(session.user.id);
  const visible = todos.filter((t) =>
    filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
  );
  const remaining = todos.filter((t) => !t.completed).length;
  const completed = todos.length - remaining;

  return (
    <div className="flex flex-1 flex-col">
      <KonamiListener />
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <BrandMark />
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-500" data-testid="current-user">
            {session.user.name}
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Your tasks</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {todos.length === 0
            ? "Vibe-coded this app. Now it needs tests."
            : `${remaining} remaining · ${completed} done`}
        </p>

        <div className="mt-6">
          <TodoComposer />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <FilterTabs current={filter} />
        </div>

        <div className="mt-4">
          <TodoList todos={visible} hasAny={todos.length > 0} filter={filter} />
        </div>
      </main>
    </div>
  );
}
