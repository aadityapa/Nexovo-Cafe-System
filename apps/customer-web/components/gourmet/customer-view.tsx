"use client";

import { useMemo, useState } from "react";
import { Plus, Search, ShoppingCart, Sparkles } from "lucide-react";
import { formatINR } from "../../lib/currency";
import { useGourmet } from "../../lib/gourmet-context";
import type { GourmetMenuItem } from "../../lib/gourmet-types";

function lineTotal(item: { price: number; quantity: number; addons: { price: number }[] }) {
  return (item.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity;
}

export function CustomerView({ onSelectProduct }: { onSelectProduct: (item: GourmetMenuItem) => void }) {
  const {
    menuItems,
    customerCart,
    setCustomerCart,
    orders,
    placeCustomerOrder,
    triggerToast
  } = useGourmet();

  const [activeCategory, setActiveCategory] = useState("All");
  const [customerSearch, setCustomerSearch] = useState("");
  const [deliveryType, setDeliveryType] = useState("Delivery");
  const [customerTable, setCustomerTable] = useState("Table 4");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map((m) => m.category));
    return ["All", ...Array.from(cats)];
  }, [menuItems]);

  const filtered = menuItems.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const subtotal = customerCart.reduce((s, item) => s + lineTotal(item), 0);
  const grandTotal = subtotal * (1 - appliedDiscount / 100) * 1.05;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-3">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Dynamic Menu Filter</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Search premium dishes..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-8 pr-3 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-950"
                }`}
              >
                <span>{cat === "All" ? "✨ Full Menu" : cat}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  {cat === "All" ? menuItems.length : menuItems.filter((m) => m.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative space-y-3 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-center shadow-md">
          <div className="absolute -right-20 -top-20 h-24 w-24 rounded-full bg-teal-500/10 blur-xl" />
          <div className="mx-auto grid h-16 w-16 grid-cols-4 gap-1 rounded-xl border border-slate-700 bg-white p-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`rounded-sm ${i % 3 === 0 ? "bg-slate-900" : "bg-white"}`} />
            ))}
          </div>
          <h4 className="text-xs font-bold text-amber-300">Dine-In QR Table Ordering Active</h4>
          <p className="text-[11px] text-slate-400">Order instantly from your table. {customerTable} selected.</p>
          <div className="flex justify-center gap-2 text-xs">
            <select
              value={customerTable}
              onChange={(e) => {
                setCustomerTable(e.target.value);
                triggerToast(`QR refreshed: ${e.target.value}`);
              }}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-slate-300"
            >
              {["Table 1", "Table 2", "Table 3", "Table 4", "Table 5", "Table 6"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
              Live Session
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 lg:col-span-6">
        <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-900 to-slate-900 p-6 shadow-xl md:flex-row">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="h-4 w-4" /> Signature Blend of the Week
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
              Wagyu Double Smash & Kyoto Cold Brew Combo
            </h2>
            <p className="text-xs leading-relaxed text-slate-300">
              A luxurious gourmet experience coupling premium Wagyu with gold-flake Kyoto brew.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-emerald-400">
                {formatINR(1666)}{" "}
                <span className="text-xs text-slate-400 line-through">{formatINR(1999)}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const burger = menuItems.find((m) => m.name.includes("Wagyu")) || menuItems[0];
                  const brew = menuItems.find((m) => m.category === "Coffee") || menuItems[1];
                  if (burger)
                    setCustomerCart((p) => [
                      ...p,
                      { menuItemId: burger.id, name: burger.name, variant: burger.variants[0], price: burger.price, addons: [], quantity: 1 }
                    ]);
                  if (brew)
                    setCustomerCart((p) => [
                      ...p,
                      { menuItemId: brew.id, name: brew.name, variant: brew.variants[0], price: brew.price, addons: [], quantity: 1 }
                    ]);
                  triggerToast("Premium Combo added to your plate!");
                }}
                className="rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition-all hover:from-amber-500 hover:to-amber-600"
              >
                Quick Add Combo
              </button>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80"
            alt="Special"
            className="h-28 w-28 rounded-2xl border border-teal-400/20 object-cover"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-200">Gourmet Selection</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-lg transition-all duration-300 hover:border-slate-700"
              >
                {item.bestSeller && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-950 shadow-md">
                    Best Seller
                  </span>
                )}
                <div className="space-y-3">
                  <div className="relative aspect-video overflow-hidden rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-slate-900/90 px-2 py-0.5 text-xs font-extrabold text-amber-400 backdrop-blur-md">
                      ★ {item.rating.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 transition-colors group-hover:text-emerald-400">{item.name}</h4>
                    <p className="line-clamp-2 text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-lg font-extrabold text-emerald-400">{formatINR(item.price)}</span>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(item)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-bold text-emerald-400 transition-all hover:border-emerald-500 hover:bg-emerald-500 hover:text-slate-950"
                  >
                    <Plus className="h-4 w-4" /> Customise & Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 lg:col-span-3">
        <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="font-extrabold text-slate-200">Your Plate</h3>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">
              {customerCart.length} Items
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
            {["Delivery", "Pickup", "Dine In"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDeliveryType(type)}
                className={`rounded-lg py-1 text-[11px] font-bold transition-all ${
                  deliveryType === type ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {customerCart.length === 0 ? (
            <p className="py-8 text-center text-xs font-medium text-slate-500">Your basket is waiting to be filled.</p>
          ) : (
            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
              {customerCart.map((cartItem, idx) => (
                <div key={idx} className="relative rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setCustomerCart((p) => p.filter((_, i) => i !== idx))}
                    className="absolute right-2 top-2 text-rose-500 hover:text-rose-400"
                  >
                    ✕
                  </button>
                  <div className="font-bold text-slate-200">{cartItem.name}</div>
                  <div className="mt-0.5 text-[10px] text-slate-400">Size: {cartItem.variant}</div>
                  <div className="mt-2 flex items-center justify-between border-t border-slate-900/60 pt-1">
                    <span className="font-bold text-slate-300">×{cartItem.quantity}</span>
                    <span className="font-bold text-emerald-400">{formatINR(lineTotal(cartItem))}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5 border-t border-slate-800 pt-3">
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon (TRY: CHAMPION25)"
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (couponCode.toUpperCase() === "CHAMPION25") {
                    setAppliedDiscount(25);
                    setCouponSuccessMsg("🎉 25% Off Luxury Code Applied!");
                    triggerToast("Coupon 25% applied.");
                  } else triggerToast('Try "CHAMPION25" for 25% off.');
                }}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-600"
              >
                Apply
              </button>
            </div>
            {couponSuccessMsg && <p className="text-[10px] font-bold text-emerald-400">{couponSuccessMsg}</p>}
          </div>

          <div className="space-y-1 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Promo ({appliedDiscount}%)</span>
                <span>-{formatINR(subtotal * (appliedDiscount / 100))}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>GST (5%)</span>
              <span>{formatINR(subtotal * (1 - appliedDiscount / 100) * 0.05)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-slate-800 pt-1.5 text-sm font-extrabold text-slate-200">
              <span>Grand Total</span>
              <span className="text-emerald-400">{formatINR(grandTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={customerCart.length === 0}
            onClick={() => placeCustomerOrder({ deliveryType, customerTable, appliedDiscount })}
            className={`w-full rounded-xl py-3 text-xs font-bold shadow-md transition-all ${
              customerCart.length === 0
                ? "cursor-not-allowed bg-slate-800 text-slate-500"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 font-black text-slate-950 hover:from-emerald-600 hover:to-teal-600"
            }`}
          >
            💳 Place Order
          </button>
        </div>

        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Dining Status Tracker</h4>
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400">{o.id}</span>
                <span
                  className={`rounded px-2 py-0.5 text-[9px] font-black uppercase ${
                    o.status === "New"
                      ? "bg-indigo-500/20 text-indigo-300"
                      : o.status === "Cooking"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </p>
              <div className="mt-2 flex justify-between border-t border-slate-900 pt-1">
                <span className="text-[10px] text-slate-500">
                  {o.type} {o.table ? `(${o.table})` : ""}
                </span>
                <span className="font-bold text-slate-300">{formatINR(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
