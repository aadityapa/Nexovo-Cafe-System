"use client";

import { Badge, Button } from "@cafe/ui";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "../lib/cart";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

export function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { lines, subtotal, tax, total, updateQty, removeItem } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-stone-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-bold">Your order</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <p className="text-center text-white/50">Your cart is empty</p>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3 rounded-xl border border-white/10 p-3">
                  <div className="flex-1">
                    <p className="font-medium">{line.name}</p>
                    <p className="text-sm text-amber-400">₹{line.basePrice * line.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg bg-white/10 p-1"
                      onClick={() => updateQty(line.id, line.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-6 text-center text-sm">{line.quantity}</span>
                    <button
                      className="rounded-lg bg-white/10 p-1"
                      onClick={() => updateQty(line.id, line.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(line.id)} className="text-white/40 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-white/10 p-5">
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white">
                <span>Total</span>
                <span className="text-amber-400">₹{total}</span>
              </div>
            </div>
            <Badge tone="gold" className="mt-3 w-full justify-center py-1">
              Earn {Math.floor(total / 10)} loyalty points
            </Badge>
            <Button variant="gold" size="lg" className="mt-4 w-full" onClick={onCheckout}>
              Proceed to checkout
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}
