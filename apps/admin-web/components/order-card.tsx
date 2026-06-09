"use client";

import { Badge, Button } from "@cafe/ui";
import { Clock } from "lucide-react";

const statusTone: Record<string, "default" | "warning" | "success" | "danger" | "gold"> = {
  PENDING: "warning",
  PREPARING: "gold",
  READY: "success",
  COMPLETED: "default",
  CANCELLED: "danger"
};

const nextStatus: Record<string, string> = {
  PENDING: "PREPARING",
  PREPARING: "READY",
  READY: "COMPLETED"
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  totalAmount: number;
  placedAt: string;
  orderItems: { itemName: string; quantity: number }[];
};

export function OrderCard({
  order,
  onAdvance,
  compact = false
}: {
  order: Order;
  onAdvance?: (id: string, status: string) => void;
  compact?: boolean;
}) {
  const next = nextStatus[order.status];

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-zinc-900/80 p-4 ${
        order.status === "PREPARING" ? "border-l-4 border-l-amber-400" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold">#{order.orderNumber}</p>
          <p className="text-xs text-zinc-500">{order.orderType.replace(/_/g, " ")}</p>
        </div>
        <Badge tone={statusTone[order.status] ?? "default"}>{order.status}</Badge>
      </div>
      {!compact && (
        <ul className="mt-3 space-y-1 text-sm text-zinc-400">
          {order.orderItems.map((item, i) => (
            <li key={i}>
              {item.quantity}× {item.itemName}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-zinc-500">
          <Clock className="h-3 w-3" />
          {new Date(order.placedAt).toLocaleTimeString()}
        </span>
        <span className="font-bold text-amber-400">₹{order.totalAmount}</span>
      </div>
      {next && onAdvance && (
        <Button variant="gold" size="sm" className="mt-3 w-full" onClick={() => onAdvance(order.id, next)}>
          Mark {next.replace(/_/g, " ").toLowerCase()}
        </Button>
      )}
    </div>
  );
}
