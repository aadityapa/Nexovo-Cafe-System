import { Card } from "@cafe/ui";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "text-amber-400"
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: string;
}) {
  return (
    <Card className="!bg-zinc-900/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">{label}</p>
          <p className={`mt-1 text-3xl font-bold ${accent}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <Icon className={`h-6 w-6 ${accent}`} />
        </div>
      </div>
    </Card>
  );
}
