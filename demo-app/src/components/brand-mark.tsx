import Link from "next/link";

export function BrandMark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-semibold tracking-tight"
    >
      <span
        aria-hidden
        className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500"
      />
      <span>
        AI Council <span className="text-zinc-500">Tasks</span>
      </span>
    </Link>
  );
}
