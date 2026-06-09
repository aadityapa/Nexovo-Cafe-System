"use client";

import { formatINR } from "../../lib/currency";
import type { GourmetMenuItem } from "../../lib/gourmet-types";
import { useGourmet } from "../../lib/gourmet-context";

export function ProductModal({
  product,
  onClose
}: {
  product: GourmetMenuItem | null;
  onClose: () => void;
}) {
  const { setCustomerCart, triggerToast } = useGourmet();
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 font-bold text-slate-400 hover:text-slate-100"
        >
          ✕
        </button>
        <div className="relative h-48">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 space-y-1">
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[9px] font-black uppercase text-slate-950">
              {product.category}
            </span>
            <h3 className="text-xl font-extrabold text-white">{product.name}</h3>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <p className="text-xs leading-relaxed text-slate-400">{product.description}</p>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Select Size Variant</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <span
                  key={v}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${
                    i === 0 ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-slate-800 text-slate-400"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
          {product.addons.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Addons</label>
              {product.addons.map((a) => (
                <div
                  key={a.name}
                  className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-900 p-2 text-xs"
                >
                  <span className="font-semibold text-slate-200">{a.name}</span>
                  <span className="font-extrabold text-emerald-400">+{formatINR(a.price)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <p className="text-2xl font-black text-emerald-400">{formatINR(product.price)}</p>
            <button
              type="button"
              onClick={() => {
                setCustomerCart((p) => [
                  ...p,
                  {
                    menuItemId: product.id,
                    name: product.name,
                    variant: product.variants[0],
                    price: product.price,
                    addons: [],
                    quantity: 1
                  }
                ]);
                onClose();
                triggerToast(`Added ${product.name} to your plate!`);
              }}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg"
            >
              Confirm Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
