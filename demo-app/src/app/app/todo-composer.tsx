"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { addTodoAction } from "@/app/actions";

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      Add
    </button>
  );
}

export function TodoComposer() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTodoAction(formData);
        formRef.current?.reset();
      }}
      className="flex items-center gap-2"
    >
      <label htmlFor="todo-title" className="sr-only">
        New task
      </label>
      <input
        id="todo-title"
        name="title"
        type="text"
        required
        maxLength={200}
        placeholder="What needs doing?"
        className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
      />
      <AddButton />
    </form>
  );
}
