import type { HTMLAttributes, PropsWithChildren } from "react";

type BadgeProps = PropsWithChildren<HTMLAttributes<HTMLSpanElement>> & {
  tone?: "default" | "success" | "warning" | "danger" | "gold";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-white/10 text-white/80",
  success: "bg-emerald-500/20 text-emerald-300",
  warning: "bg-amber-500/20 text-amber-300",
  danger: "bg-rose-500/20 text-rose-300",
  gold: "bg-amber-400/20 text-amber-200"
};

export function Badge({ children, className = "", tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}
