"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "../../components/admin-shell";
import { OrderCard } from "../../components/order-card";
import { fetchBootstrap, fetchOrders, updateOrderStatus } from "../../lib/api";

export default function KitchenPage() {
  const [orders, setOrders] = useState<
    {
      id: string;
      orderNumber: string;
      status: string;
      orderType: string;
      totalAmount: number;
      placedAt: string;
      orderItems: { itemName: string; quantity: number }[];
    }[]
  >([]);
  const [branchId, setBranchId] = useState("");

  const load = useCallback((id: string) => {
    fetchOrders(id).then((all) => {
      setOrders(
        (all as { status: string }[]).filter((o) =>
          ["PENDING", "PREPARING", "READY"].includes(o.status)
        ) as typeof orders
      );
    });
  }, []);

  useEffect(() => {
    fetchBootstrap().then((data) => {
      if (data.branch?.id) {
        setBranchId(data.branch.id);
        load(data.branch.id);
      }
    });
    const interval = setInterval(() => {
      if (branchId) load(branchId);
    }, 5000);
    return () => clearInterval(interval);
  }, [branchId, load]);

  const handleAdvance = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    if (branchId) load(branchId);
  };

  const columns = [
    { key: "PENDING", label: "New orders", color: "border-amber-500" },
    { key: "PREPARING", label: "Cooking", color: "border-orange-500" },
    { key: "READY", label: "Ready to serve", color: "border-emerald-500" }
  ];

  return (
    <AdminShell title="Kitchen Display (KDS)">
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((col) => (
          <div key={col.key} className={`rounded-2xl border-t-4 ${col.color} bg-zinc-900/50 p-4`}>
            <h2 className="mb-4 font-bold">{col.label}</h2>
            <div className="space-y-3">
              {orders
                .filter((o) => o.status === col.key)
                .map((order) => (
                  <OrderCard key={order.id} order={order} onAdvance={handleAdvance} />
                ))}
              {orders.filter((o) => o.status === col.key).length === 0 && (
                <p className="text-center text-sm text-zinc-500">No orders</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
