import { toggleTodoAction, deleteTodoAction } from "@/app/actions";
import type { Todo } from "@/lib/todos";
import type { Filter } from "./filter-tabs";

function EmptyState({ hasAny, filter }: { hasAny: boolean; filter: Filter }) {
  if (!hasAny) {
    return (
      <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
        Vibe-coded this app. Now it needs tests.
      </div>
    );
  }
  return (
    <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
      Nothing {filter === "active" ? "to do" : "completed"} here.
    </div>
  );
}

export function TodoList({
  todos,
  hasAny,
  filter,
}: {
  todos: Todo[];
  hasAny: boolean;
  filter: Filter;
}) {
  if (todos.length === 0) {
    return <EmptyState hasAny={hasAny} filter={filter} />;
  }

  return (
    <ul
      data-testid="todo-list"
      className="divide-y divide-zinc-200 rounded-md border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800"
    >
      {todos.map((todo) => (
        <li
          key={todo.id}
          data-testid="todo-item"
          data-completed={todo.completed ? "true" : "false"}
          className="flex items-center gap-3 px-4 py-3"
        >
          <form action={toggleTodoAction.bind(null, todo.id)}>
            <button
              type="submit"
              aria-pressed={todo.completed}
              aria-label={
                todo.completed ? `Mark "${todo.title}" as active` : `Mark "${todo.title}" as completed`
              }
              className={`grid h-5 w-5 place-items-center rounded-full border ${
                todo.completed
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                  : "border-zinc-300 text-transparent hover:border-zinc-500 dark:border-zinc-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M2 6l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
          <span
            className={`flex-1 text-sm ${
              todo.completed ? "text-zinc-400 line-through" : ""
            }`}
          >
            {todo.title}
          </span>
          <form action={deleteTodoAction.bind(null, todo.id)}>
            <button
              type="submit"
              aria-label={`Delete "${todo.title}"`}
              className="text-xs text-zinc-400 hover:text-red-600"
            >
              Delete
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
