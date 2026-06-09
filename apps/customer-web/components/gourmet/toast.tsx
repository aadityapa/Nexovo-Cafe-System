"use client";

import { Info } from "lucide-react";
import { useGourmet } from "../../lib/gourmet-context";

export function GourmetToast() {
  const { toastMessage } = useGourmet();
  if (!toastMessage) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex max-w-sm animate-bounce items-center gap-3 rounded-2xl border-2 border-emerald-500 bg-slate-900 px-5 py-4 text-slate-100 shadow-2xl">
      <div className="rounded-lg bg-emerald-500 p-2 text-slate-950">
        <Info className="h-4 w-4" />
      </div>
      <p className="text-xs font-semibold tracking-wide">{toastMessage}</p>
    </div>
  );
}
