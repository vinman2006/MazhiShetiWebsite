"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-zinc-950 text-white">
      <h2 className="text-3xl font-bold text-emerald-400">404 - Page Not Found</h2>
      <p className="mt-2 text-zinc-400">The requested page could not be found.</p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-black hover:bg-emerald-400 transition"
      >
        Return Home
      </Link>
    </div>
  );
}
