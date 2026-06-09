"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { formatINR } from "../../lib/currency";
import { BRAND } from "../../lib/brand";
import { useGourmet } from "../../lib/gourmet-context";

export function PosView() {
  const { menuItems, posCart, setPosCart, setOrders, triggerToast } = useGourmet();
  const [activeCategory, setActiveCategory] = useState("All");
  const [posSearchQuery, setPosSearchQuery] = useState("");
  const [posCustomerName, setPosCustomerName] = useState("Walk-in Patron");
  const [posTable, setPosTable] = useState("Table 2");
  const [posPaymentType, setPosPaymentType] = useState("UPI");

  const filtered = menuItems.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.name.toLowerCase().includes(posSearchQuery.toLowerCase())
  );

  const subtotal = posCart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal * 1.05;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-7">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              value={posSearchQuery}
              onChange={(e) => setPosSearchQuery(e.target.value)}
              placeholder="Quick search by barcode or name (F3)..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            {["All", ...new Set(menuItems.map((m) => m.category))].slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  activeCategory === cat ? "bg-amber-400 font-bold text-slate-950" : "text-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const existing = posCart.find((p) => p.name === item.name);
                if (existing) {
                  setPosCart((p) => p.map((x) => (x.name === item.name ? { ...x, quantity: x.quantity + 1 } : x)));
                } else {
                  setPosCart((p) => [
                    ...p,
                    { menuItemId: item.id, name: item.name, variant: item.variants[0], price: item.price, addons: [], quantity: 1 }
                  ]);
                }
                triggerToast(`Added: ${item.name}`);
              }}
              className="flex h-32 flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-3.5 text-left shadow-md transition-all hover:scale-[1.02] hover:border-amber-400 active:scale-95"
            >
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{item.category}</span>
                <h4 className="line-clamp-2 text-xs font-bold leading-tight text-slate-200">{item.name}</h4>
              </div>
              <div className="flex w-full items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-sm font-extrabold text-amber-300">{formatINR(item.price)}</span>
                <span className="rounded bg-slate-950 px-1.5 py-0.5 text-[8px] font-bold text-slate-400">TAP+</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl lg:col-span-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-200">POS Billing Terminal</h3>
            <p className="text-[10px] text-slate-400">Terminal #01</p>
          </div>
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-300">
            TAX & GST INVOICE
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            value={posCustomerName}
            onChange={(e) => setPosCustomerName(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
            placeholder="Patron name"
          />
          <select
            value={posTable}
            onChange={(e) => setPosTable(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100"
          >
            {["Walk-In", "Table 1", "Table 2", "Table 3", "Table 4"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="min-h-40 max-h-56 space-y-2.5 overflow-y-auto rounded-2xl border border-slate-800/80 bg-slate-950 p-3">
          {posCart.length === 0 ? (
            <p className="flex h-32 items-center justify-center text-xs text-slate-500">Select items from the grid.</p>
          ) : (
            posCart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-900 pb-2 text-xs last:border-0">
                <span className="font-bold text-slate-200">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-bold text-slate-300">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["UPI", "Cash", "Card", "Split"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setPosPaymentType(mode)}
              className={`rounded-lg border py-1.5 text-xs font-bold ${
                posPaymentType === mode
                  ? "border-amber-400 bg-amber-400 font-black text-slate-950"
                  : "border-slate-800 bg-slate-950 text-slate-400"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="space-y-1 border-t border-slate-800 pt-3 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Total</span>
            <span className="text-lg font-black text-amber-300">{formatINR(total)}</span>
          </div>
        </div>
        <button
          type="button"
          disabled={posCart.length === 0}
          onClick={() => {
            const id = `${BRAND.orderPrefix}-POS-${Math.floor(1000 + Math.random() * 9000)}`;
            setOrders((p) => [
              {
                id,
                items: posCart,
                total: parseFloat(total.toFixed(2)),
                status: "Ready",
                type: "Dine In",
                table: posTable,
                customer: posCustomerName,
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                paymentMethod: posPaymentType
              },
              ...p
            ]);
            setPosCart([]);
            triggerToast(`Receipt printed! ${id}`);
          }}
          className={`w-full rounded-2xl py-3.5 text-xs font-black tracking-wide ${
            posCart.length === 0
              ? "cursor-not-allowed bg-slate-800 text-slate-600"
              : "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 shadow-lg"
          }`}
        >
          🖨️ Finalize Order & Print Invoice (F12)
        </button>
      </div>
    </div>
  );
}
