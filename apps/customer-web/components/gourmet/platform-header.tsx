"use client";

import { BRAND } from "../../lib/brand";
import { useGourmet } from "../../lib/gourmet-context";
import type { RoleId } from "../../lib/gourmet-types";

const ROLES: { id: RoleId; name: string; color: string }[] = [
  { id: "Customer", name: "📱 Customer App", color: "hover:text-emerald-400" },
  { id: "POS", name: "💳 POS Terminal", color: "hover:text-amber-400" },
  { id: "Kitchen", name: "🍳 Kitchen (KDS)", color: "hover:text-orange-400" },
  { id: "Admin", name: "📊 Admin Portal", color: "hover:text-indigo-400" },
  { id: "SuperAdmin", name: "👑 Super Admin", color: "hover:text-purple-400" },
  { id: "DevSuite", name: "🛠️ Developer Suite", color: "hover:text-cyan-400" }
];

export function PlatformHeader({ onCloudSync }: { onCloudSync: () => void }) {
  const { activeRole, setActiveRole, currentBranch, setCurrentBranch, branches, triggerToast } = useGourmet();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 px-4 py-3 shadow-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 lg:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-lg shadow-emerald-500/10">
            <span className="text-xl font-extrabold tracking-tight text-slate-950">N</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div>
                <h1 className="text-lg font-extrabold leading-tight tracking-tight text-emerald-400/90">Nexovo</h1>
                <p className="text-xl font-extrabold leading-tight text-slate-100">Cafe System</p>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                {BRAND.version}
              </span>
            </div>
            <p className="text-xs text-slate-400">{BRAND.tagline}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">GSTIN {BRAND.gstin} · India (INR)</p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-950/80 p-1.5 shadow-inner lg:w-auto">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeRole === role.id
                  ? "scale-105 bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-slate-950 shadow-md"
                  : `text-slate-400 hover:bg-slate-900 ${role.color}`
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentBranch}
            onChange={(e) => {
              setCurrentBranch(e.target.value);
              triggerToast(`Switched to: ${branches.find((b) => b.id === e.target.value)?.name}`);
            }}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-amber-300 focus:border-amber-400 focus:outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onCloudSync}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20"
          >
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400" />
            Cloud Storage Sync
          </button>
        </div>
      </div>
    </header>
  );
}
