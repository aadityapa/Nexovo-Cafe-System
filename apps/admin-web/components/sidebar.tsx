"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  LayoutDashboard,
  LogOut,
  Monitor,
  Receipt,
  ShoppingBag
} from "lucide-react";
import { useAuth } from "../lib/auth-context";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/pos", label: "POS Billing", icon: Receipt },
  { href: "/kitchen", label: "Kitchen (KDS)", icon: ChefHat }
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-zinc-950">
      <div className="border-b border-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-zinc-900">
            B
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-400/80">Enterprise</p>
            <p className="font-bold">Brew & Bite</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-amber-400/15 text-amber-300"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/5 p-3">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          <Monitor className="h-5 w-5" /> Customer app
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:bg-rose-500/10 hover:text-rose-300"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </div>
    </aside>
  );
}
