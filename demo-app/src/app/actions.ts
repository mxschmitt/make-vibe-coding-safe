"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { createUser } from "@/lib/users";
import {
  createTodo,
  toggleTodo,
  deleteTodo,
  clearCompleted,
  seedDefaultTodos,
} from "@/lib/todos";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export type FormState = { error?: string } | undefined;

export async function signupAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  let userId: string;
  try {
    const created = await createUser(parsed.data);
    userId = created.id;
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_TAKEN") {
      return { error: "An account with that email already exists" };
    }
    return { error: "Something went wrong. Please try again." };
  }
  seedDefaultTodos(userId);
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Signup succeeded but sign-in failed. Try logging in." };
    }
    throw err;
  }
  redirect("/app");
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password"),
});

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Incorrect email or password" };
    }
    throw err;
  }
  redirect("/app");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/");
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

const titleSchema = z.string().trim().min(1, "Todo cannot be empty").max(200);

export async function addTodoAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const parsed = titleSchema.safeParse(formData.get("title"));
  if (!parsed.success) return;
  createTodo(userId, parsed.data);
  revalidatePath("/app");
}

export async function toggleTodoAction(id: string): Promise<void> {
  const userId = await requireUserId();
  toggleTodo(userId, id);
  revalidatePath("/app");
}

export async function deleteTodoAction(id: string): Promise<void> {
  const userId = await requireUserId();
  deleteTodo(userId, id);
  revalidatePath("/app");
}

export async function clearCompletedAction(): Promise<void> {
  const userId = await requireUserId();
  clearCompleted(userId);
  revalidatePath("/app");
}
