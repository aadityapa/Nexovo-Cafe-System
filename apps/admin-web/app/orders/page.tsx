"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "../../components/admin-shell";
import { OrderCard } from "../../components/order-card";
import { fetchBootstrap, fetchOrders, updateOrderStatus } from "../../lib/api";

export default function OrdersPage() {
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
    fetchOrders(id).then((o) => setOrders(o));
  }, []);

  useEffect(() => {
    fetchBootstrap().then((data) => {
      if (data.branch?.id) {
        setBranchId(data.branch.id);
        load(data.branch.id);
      }
    });
  }, [load]);

  const handleAdvance = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    if (branchId) load(branchId);
  };

  return (
    <AdminShell title="Order Management">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onAdvance={handleAdvance} />
        ))}
      </div>
    </AdminShell>
  );
}
