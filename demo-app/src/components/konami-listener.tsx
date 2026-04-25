"use client";

import { useEffect, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiListener() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let cursor = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/i.test(target.tagName)) return;
      const expected = SEQUENCE[cursor];
      if (!expected) return;
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        cursor += 1;
        if (cursor === SEQUENCE.length) {
          setActive(true);
          cursor = 0;
        }
      } else {
        cursor = e.key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!active) return null;

  return (
    <div
      role="status"
      data-testid="konami-banner"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-md"
    >
      <span aria-hidden>🎉</span>
      You found it! Welcome to AI Council SF 2026.
      <button
        type="button"
        onClick={() => setActive(false)}
        aria-label="Dismiss"
        className="ml-3 rounded bg-white/20 px-2 py-0.5 text-xs hover:bg-white/30"
      >
        Close
      </button>
    </div>
  );
}
