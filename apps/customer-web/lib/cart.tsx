"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartLine, MenuItem } from "./types";

type CartContextValue = {
  lines: CartLine[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  tax: number;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.basePrice * l.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const count = lines.reduce((s, l) => s + l.quantity, 0);

    return {
      lines,
      subtotal,
      tax,
      total,
      count,
      addItem: (item) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.id === item.id);
          if (existing) {
            return prev.map((l) => (l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l));
          }
          return [...prev, { ...item, quantity: 1 }];
        });
      },
      removeItem: (id) => setLines((prev) => prev.filter((l) => l.id !== id)),
      updateQty: (id, qty) => {
        if (qty < 1) {
          setLines((prev) => prev.filter((l) => l.id !== id));
          return;
        }
        setLines((prev) => prev.map((l) => (l.id === id ? { ...l, quantity: qty } : l)));
      },
      clear: () => setLines([])
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
