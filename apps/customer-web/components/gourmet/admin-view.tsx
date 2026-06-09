"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { formatINR } from "../../lib/currency";
import { useGourmet } from "../../lib/gourmet-context";

export function AdminView() {
  const { orders, inventory, setInventory, staff, setStaff, reservations, triggerToast } = useGourmet();
  const lowStock = inventory.filter((i) => i.stock <= i.minStock);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { title: "Total Enterprise Revenue", value: formatINR(9390050), sub: "+18.4% last month", trend: "Up", color: "border-emerald-500/20" },
          { title: "Active Live Orders", value: String(orders.length), sub: "KDS realtime", trend: "Stable", color: "border-amber-400/20" },
          { title: "Critical Low Stocks", value: String(lowStock.length), sub: "Replenish now", trend: lowStock.length ? "Action Required" : "OK", color: "border-rose-500/20" },
          { title: "Staff On Duty", value: String(staff.filter((s) => s.status === "On-Duty").length), sub: "Active shifts", trend: "Full Staff", color: "border-indigo-500/20" }
        ].map((kpi) => (
          <div key={kpi.title} className={`space-y-2 rounded-3xl border bg-slate-900 p-5 shadow-lg ${kpi.color}`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{kpi.title}</p>
            <h3 className="text-2xl font-black text-slate-100">{kpi.value}</h3>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{kpi.sub}</span>
              <span className={`font-bold ${kpi.trend.includes("Action") ? "animate-pulse text-rose-400" : "text-emerald-400"}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-200">Daily Sales Analytics</h3>
              <button
                type="button"
                onClick={() => triggerToast("AI sales forecast queued — premium insight ready.")}
                className="flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-400"
              >
                <Sparkles className="h-3 w-3" /> Run AI Sales Forecast
              </button>
            </div>
            <div className="relative flex h-44 items-end gap-3 rounded-2xl border border-slate-800/80 bg-slate-950 px-4 pt-6">
              {[
                { h1: "32%", h2: "15%" },
                { h1: "45%", h2: "25%" },
                { h1: "68%", h2: "40%" },
                { h1: "85%", h2: "65%" },
                { h1: "95%", h2: "88%" }
              ].map((bar, i) => (
                <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end">
                  <div className="flex h-[80%] w-full items-end justify-center gap-1 pb-1">
                    <div style={{ height: bar.h1 }} className="w-3 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400" />
                    <div style={{ height: bar.h2 }} className="w-3 rounded-t-sm bg-gradient-to-t from-amber-500 to-amber-300" />
                  </div>
                </div>
              ))}
              <TrendingUp className="absolute right-4 top-2 h-5 w-5 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-200">Raw Materials & Sourcing</h3>
              <button
                type="button"
                onClick={() => {
                  setInventory((p) => p.map((i) => (i.stock <= i.minStock ? { ...i, stock: i.stock + 5000 } : i)));
                  triggerToast("Purchase order issued for critical materials.");
                }}
                className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-600"
              >
                Instant Purchase Order
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="pb-2.5">Material</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5">Stock</th>
                    <th className="pb-2.5">Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-950/40">
                      <td className="py-3 font-bold text-slate-200">{item.item}</td>
                      <td className="py-3">
                        {item.stock <= item.minStock ? (
                          <span className="rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                            ⚠️ Critical Low
                          </span>
                        ) : (
                          <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-bold text-slate-300">
                        {item.stock} {item.unit}
                      </td>
                      <td className="py-3 text-[11px] text-slate-400">{item.vendor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-extrabold text-slate-200">Shift Roster</h3>
            {staff.map((emp, idx) => (
              <div key={emp.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-200">{emp.name}</h4>
                  <p className="text-[10px] text-slate-400">
                    {emp.role} • {emp.shift}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setStaff((p) =>
                      p.map((e, i) => (i === idx ? { ...e, status: e.status === "On-Duty" ? "Off-Duty" : "On-Duty" } : e))
                    )
                  }
                  className={`rounded-xl px-2.5 py-1 text-[10px] font-black uppercase ${
                    emp.status === "On-Duty"
                      ? "border border-emerald-500/20 bg-emerald-500/20 text-emerald-300"
                      : "border border-slate-800 bg-slate-900 text-slate-500"
                  }`}
                >
                  {emp.status}
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5">
            <h3 className="font-extrabold text-slate-200">Reservations</h3>
            {reservations.map((res) => (
              <div key={res.id} className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-amber-300">{res.customerName}</span>
                  <span className="rounded bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">{res.time}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Guests: {res.guests}</span>
                  <span>Table {res.tableId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
