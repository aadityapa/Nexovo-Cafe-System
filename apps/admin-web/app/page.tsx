"use client";

import { useEffect } from "react";

export default function AdminRedirectPage() {
  useEffect(() => {
    window.location.href = "http://localhost:3000";
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-8 text-center text-slate-100">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-400 text-2xl font-black text-slate-950">
        N
      </div>
      <h1 className="text-lg font-bold text-emerald-400">Nexovo</h1>
      <p className="text-xl font-extrabold">Cafe System</p>
      <p className="mt-2 text-sm text-slate-400">Redirecting to unified platform…</p>
      <a href="http://localhost:3000" className="mt-4 text-sm font-bold text-emerald-400 hover:underline">
        Open Nexovo Cafe System →
      </a>
    </main>
  );
}
