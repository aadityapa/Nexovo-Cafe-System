import type { HTMLAttributes, PropsWithChildren } from "react";

type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  hover?: boolean;
};

export function Card({ children, className = "", hover = false, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ${
        hover ? "transition hover:border-amber-400/30 hover:bg-white/10" : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
