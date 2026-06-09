"use client";

import { Badge } from "@cafe/ui";
import { CheckCircle2, ChefHat, Package, Truck } from "lucide-react";
import type { Order } from "../lib/types";

const steps = [
  { key: "PENDING", label: "Order received", icon: CheckCircle2 },
  { key: "PREPARING", label: "Preparing", icon: ChefHat },
  { key: "READY", label: "Ready", icon: Package },
  { key: "OUT_FOR_DELIVERY", label: "On the way", icon: Truck },
  { key: "COMPLETED", label: "Delivered", icon: CheckCircle2 }
];

const statusOrder = ["PENDING", "CONFIRMED", "ACCEPTED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED"];

export function OrderTracker({ order }: { order: Order }) {
  const currentIdx = statusOrder.indexOf(order.status);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-transparent p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">Order #{order.orderNumber}</p>
          <h3 className="text-xl font-bold">Tracking your order</h3>
        </div>
        <Badge tone="gold">{order.status.replace(/_/g, " ")}</Badge>
      </div>
      <div className="mt-8 space-y-4">
        {steps.map((step, idx) => {
          const stepIdx = statusOrder.indexOf(step.key);
          const done = currentIdx >= stepIdx && stepIdx >= 0;
          const active = order.status === step.key;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  done ? "bg-amber-400 text-stone-900" : "bg-white/10 text-white/40"
                } ${active ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-stone-950" : ""}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <p className={done ? "font-medium text-white" : "text-white/40"}>{step.label}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-center text-2xl font-bold text-amber-400">₹{order.totalAmount}</p>
    </div>
  );
}
