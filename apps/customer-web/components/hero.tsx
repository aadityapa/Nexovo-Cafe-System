import { Badge } from "@cafe/ui";
import { Clock, MapPin, Star } from "lucide-react";

export function Hero({ branchName, city }: { branchName: string; city: string }) {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 px-6 py-12 sm:px-10 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-stone-900 to-stone-950" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative">
        <Badge tone="gold" className="mb-4">Now delivering in 28 min</Badge>
        <h2 className="max-w-xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Crafted coffee.
          <span className="block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            Elevated dining.
          </span>
        </h2>
        <p className="mt-4 max-w-lg text-white/60">
          Swiggy-style ordering with chef-curated menus, live kitchen tracking, and GST-ready billing.
        </p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-amber-400" /> {branchName}, {city}
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.8 (2.4k reviews)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-amber-400" /> Open till 11 PM
          </span>
        </div>
      </div>
    </section>
  );
}
