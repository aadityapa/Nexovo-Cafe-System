"use client";

import { formatINR } from "../../lib/currency";
import { useGourmet } from "../../lib/gourmet-context";

export function SuperAdminView() {
  const { branches, triggerToast } = useGourmet();
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-black text-slate-100">Nexovo Super Admin — Multi-Branch Control Tower</h2>
        <p className="text-xs text-slate-400">Manage branches, subscriptions, and cross-platform payouts.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {branches.map((b) => (
          <div key={b.id} className="relative space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <span className="absolute right-4 top-4 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-400">
              Active Node
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-100">{b.name}</h3>
              <p className="text-xs text-slate-400">{b.location}</p>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
              <span className="text-slate-400">Monthly Sales</span>
              <span className="text-lg font-extrabold text-emerald-400">{formatINR(b.sales)}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => triggerToast(`Connecting API node: ${b.name}`)}
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
              >
                🖥️ Connect API
              </button>
              <button
                type="button"
                onClick={() => triggerToast(`Audit generated for ${b.name}`)}
                className="rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-slate-950"
              >
                Audit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
