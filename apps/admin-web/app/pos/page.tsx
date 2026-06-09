"use client";

import { useEffect, useState } from "react";
import { Badge, Button } from "@cafe/ui";
import { Plus, Trash2 } from "lucide-react";
import { AdminShell } from "../../components/admin-shell";
import { createPosOrder, fetchBootstrap } from "../../lib/api";

type MenuItem = {
  id: string;
  name: string;
  basePrice: number;
  sku: string | null;
  isVegetarian: boolean;
};

type CartLine = MenuItem & { qty: number };

export default function PosPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBootstrap().then((data) => {
      setRestaurantId(data.restaurant.id);
      setBranchId(data.branch?.id ?? "");
      setItems(data.items);
    });
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (existing) return prev.map((l) => (l.id === item.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const total = cart.reduce((s, l) => s + l.basePrice * l.qty, 0);
  const tax = Math.round(total * 0.05);

  const bill = async () => {
    if (!branchId || cart.length === 0) return;
    const order = await createPosOrder({
      restaurantId,
      branchId,
      orderType: "DINE_IN",
      items: cart.map((l) => ({
        menuItemId: l.id,
        itemName: l.name,
        itemSku: l.sku ?? undefined,
        quantity: l.qty,
        unitPrice: l.basePrice
      }))
    });
    setCart([]);
    setMessage(`Bill created: ${order.orderNumber} · ₹${order.totalAmount}`);
  };

  return (
    <AdminShell title="POS Billing">
      {message && (
        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">
          {message}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/80 p-4 text-left transition hover:border-amber-400/40"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-amber-400">₹{item.basePrice}</p>
                </div>
                {item.isVegetarian && <Badge tone="success">Veg</Badge>}
                <Plus className="h-5 w-5 text-amber-400" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-5 lg:col-span-2">
          <h2 className="text-lg font-bold">Current bill</h2>
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {cart.map((line) => (
              <li key={line.id} className="flex justify-between text-sm">
                <span>
                  {line.qty}× {line.name}
                </span>
                <span className="text-amber-400">₹{line.basePrice * line.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>GST 5%</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-amber-400">₹{total + tax}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setCart([])}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
            <Button variant="gold" className="flex-1" onClick={bill} disabled={cart.length === 0}>
              Print bill
            </Button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
