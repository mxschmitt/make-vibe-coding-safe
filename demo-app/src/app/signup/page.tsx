import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand-mark";
import { SignupForm } from "./signup-form";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/app");

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-6 py-4">
        <BrandMark />
      </header>
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Start a fresh list of tasks you&apos;ll actually test.
          </p>
          <div className="mt-6">
            <SignupForm />
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already signed up?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
