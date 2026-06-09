"use client";

import { Badge, Button } from "@cafe/ui";
import { Leaf, Plus } from "lucide-react";
import Image from "next/image";
import type { MenuItem } from "../lib/types";
import { useCart } from "../lib/cart";

export function FoodCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-amber-400/30 hover:bg-white/[0.08]">
      <div className="relative aspect-[4/3] overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-stone-800 text-white/30">No image</div>
        )}
        {item.isVegetarian && (
          <Badge tone="success" className="absolute left-3 top-3">
            <Leaf className="mr-1 h-3 w-3" /> Veg
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-white">{item.name}</h3>
          <p className="shrink-0 font-bold text-amber-400">₹{item.basePrice}</p>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-white/50">{item.description}</p>
        <Button variant="gold" size="sm" className="mt-4 w-full" onClick={() => addItem(item)}>
          <Plus className="h-4 w-4" /> Add to cart
        </Button>
      </div>
    </article>
  );
}
