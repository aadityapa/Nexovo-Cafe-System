"use client";

import { Button } from "@cafe/ui";
import { Bike, Store, UtensilsCrossed } from "lucide-react";
import { useState } from "react";

const types = [
  { id: "DELIVERY", label: "Delivery", icon: Bike },
  { id: "TAKEAWAY", label: "Pickup", icon: Store },
  { id: "DINE_IN", label: "Dine-in", icon: UtensilsCrossed }
] as const;

type CheckoutModalProps = {
  open: boolean;
  total: number;
  loading: boolean;
  onClose: () => void;
  onConfirm: (orderType: string) => void;
};

export function CheckoutModal({ open, total, loading, onClose, onConfirm }: CheckoutModalProps) {
  const [orderType, setOrderType] = useState("DELIVERY");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-stone-900 p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Checkout</h2>
        <p className="mt-1 text-white/50">Select how you&apos;d like to receive your order</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {types.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setOrderType(id)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition ${
                orderType === id
                  ? "border-amber-400 bg-amber-400/10 text-amber-300"
                  : "border-white/10 text-white/60 hover:border-white/20"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-white/5 p-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Pay via UPI</span>
            <span className="text-amber-400">₹{total}</span>
          </div>
          <p className="mt-1 text-xs text-white/40">Demo payment — no real charge</p>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" disabled={loading} onClick={() => onConfirm(orderType)}>
            {loading ? "Placing…" : "Place order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
