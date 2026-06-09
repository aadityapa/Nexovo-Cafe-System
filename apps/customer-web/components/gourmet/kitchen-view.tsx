"use client";

import { useEffect } from "react";
import { useGourmet } from "../../lib/gourmet-context";

export function KitchenView() {
  const { orders, advanceOrderStatus, refreshOrders, triggerToast } = useGourmet();

  useEffect(() => {
    const t = setInterval(() => refreshOrders().catch(() => undefined), 8000);
    return () => clearInterval(t);
  }, [refreshOrders]);

  const active = orders.filter((o) => o.status !== "Delivered");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-100">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-orange-500" />
            Kitchen Display System (KDS)
          </h2>
          <p className="text-xs text-slate-400">Real-time queue synced with POS & customer app.</p>
        </div>
        <span className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-slate-300">
          👨‍🍳 Active Chef: Mei Lin
        </span>
      </div>

      {active.length === 0 ? (
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
          <p className="text-sm font-semibold text-slate-400">Kitchen clear! All plates served.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {active.map((order) => (
            <div
              key={order.id}
              className={`space-y-4 rounded-3xl border-2 bg-slate-900 p-5 shadow-xl ${
                order.status === "New"
                  ? "animate-pulse border-indigo-500/80"
                  : order.status === "Cooking"
                    ? "border-orange-500/80"
                    : "border-emerald-500/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-200">{order.id}</h3>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                    order.status === "New"
                      ? "bg-indigo-500/20 text-indigo-300"
                      : order.status === "Cooking"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-800/80 bg-slate-950 p-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-semibold">
                    <span>
                      <span className="font-extrabold text-amber-400">{item.quantity}×</span> {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.variant}</span>
                  </div>
                ))}
              </div>
              {order.status === "New" && (
                <button
                  type="button"
                  onClick={() => advanceOrderStatus(order.id, "Cooking")}
                  className="w-full rounded-xl bg-orange-500 py-2 text-xs font-black text-slate-950 hover:bg-orange-600"
                >
                  🔥 Start Cooking
                </button>
              )}
              {order.status === "Cooking" && (
                <button
                  type="button"
                  onClick={() => advanceOrderStatus(order.id, "Ready")}
                  className="w-full rounded-xl bg-emerald-500 py-2 text-xs font-black text-slate-950 hover:bg-emerald-600"
                >
                  ✅ Mark Ready
                </button>
              )}
              {order.status === "Ready" && (
                <button
                  type="button"
                  onClick={() => advanceOrderStatus(order.id, "Delivered")}
                  className="w-full rounded-xl bg-slate-800 py-2 text-xs font-black text-slate-300 hover:bg-slate-700"
                >
                  📦 Archive & Deliver
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
