"use client";

import { useState } from "react";
import { Database, Server } from "lucide-react";

function ApiSandboxRow({
  method,
  endpoint,
  desc,
  mockRes
}: {
  method: string;
  endpoint: string;
  desc: string;
  mockRes: unknown;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-black ${
              method === "GET" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-400/20 text-amber-300"
            }`}
          >
            {method}
          </span>
          <span className="font-mono text-xs text-slate-100">{endpoint}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-cyan-300"
        >
          {open ? "Close" : "Execute Test"}
        </button>
      </div>
      <p className="text-[11px] text-slate-400">{desc}</p>
      {open && (
        <pre className="max-h-40 overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900 p-3 text-[10px] text-cyan-200">
          {JSON.stringify(mockRes, null, 2)}
        </pre>
      )}
    </div>
  );
}

export function DevSuiteView() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-6">
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 text-cyan-400">
            <Database className="h-5 w-5" />
            <h3 className="font-bold text-slate-200">Prisma Database Schema</h3>
          </div>
          <pre className="max-h-72 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-cyan-300">
            {`datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model MenuItem {
  id          String   @id @default(uuid())
  name        String
  basePrice   Decimal
  category    MenuCategory
}`}
          </pre>
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Server className="h-5 w-5" />
            <h3 className="font-bold text-slate-200">Docker Production</h3>
          </div>
          <pre className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-emerald-300">
            {`services:
  nexovo-api:
    ports: ["4000:4000"]
  postgres:
    image: postgres:16-alpine
  currency: INR`}
          </pre>
        </div>
      </div>
      <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl lg:col-span-6">
        <h3 className="font-extrabold text-slate-200">Swagger API Live Sandbox</h3>
        <ApiSandboxRow method="GET" endpoint="/api/v1/public/bootstrap" desc="Menu & branch bootstrap" mockRes={{ status: "ok" }} />
        <ApiSandboxRow method="GET" endpoint="/api/v1/public/orders" desc="Live order queue" mockRes={[]} />
        <ApiSandboxRow method="POST" endpoint="/api/v1/public/orders" desc="Create customer order" mockRes={{ success: true }} />
        <a
          href="http://localhost:4000/api/docs"
          target="_blank"
          rel="noreferrer"
          className="block text-center text-xs font-bold text-cyan-400 hover:underline"
        >
          Open full Swagger docs →
        </a>
      </div>
    </div>
  );
}
