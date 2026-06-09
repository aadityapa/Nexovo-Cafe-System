"use client";

import { Badge, Button } from "@cafe/ui";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "../lib/cart";

export function Header({ restaurantName, onCartOpen }: { restaurantName: string; onCartOpen: () => void }) {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-stone-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-bold text-stone-900">
            B
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-amber-400/80">Premium Dining</p>
            <h1 className="text-lg font-bold text-white">{restaurantName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="gold" className="hidden sm:inline-flex">
            <Sparkles className="mr-1 h-3 w-3" /> 420 pts
          </Badge>
          <Button variant="gold" size="sm" onClick={onCartOpen} className="relative">
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-amber-400">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
