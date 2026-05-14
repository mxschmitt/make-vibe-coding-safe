"use client";

import { ConfirmButton } from "@acme/ui";

export function DeleteButton({
  todoTitle,
  deleteAction,
}: {
  todoTitle: string;
  deleteAction: () => Promise<void>;
}) {
  return (
    <ConfirmButton
      label="Delete"
      itemName={todoTitle}
      onConfirm={deleteAction}
      className="text-xs text-zinc-400 hover:text-red-600"
      confirmClassName="text-xs font-medium text-red-600 hover:text-red-800"
    />
  );
}
