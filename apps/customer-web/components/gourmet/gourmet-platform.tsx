"use client";

import { useState } from "react";
import { BRAND } from "../../lib/brand";
import { GourmetProvider, useGourmet } from "../../lib/gourmet-context";
import type { GourmetMenuItem } from "../../lib/gourmet-types";
import { PlatformHeader } from "./platform-header";
import { GourmetToast } from "./toast";
import { CustomerView } from "./customer-view";
import { PosView } from "./pos-view";
import { KitchenView } from "./kitchen-view";
import { AdminView } from "./admin-view";
import { SuperAdminView } from "./super-admin-view";
import { DevSuiteView } from "./dev-suite-view";
import { ProductModal } from "./product-modal";
import { AiChat } from "./ai-chat";

function PlatformBody() {
  const { activeRole, triggerToast } = useGourmet();
  const [selectedProduct, setSelectedProduct] = useState<GourmetMenuItem | null>(null);
  const [cloudSyncModal, setCloudSyncModal] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500 selection:text-white">
      <PlatformHeader onCloudSync={() => setCloudSyncModal(true)} />
      <GourmetToast />

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 lg:p-6">
        {activeRole === "Customer" && <CustomerView onSelectProduct={setSelectedProduct} />}
        {activeRole === "POS" && <PosView />}
        {activeRole === "Kitchen" && <KitchenView />}
        {activeRole === "Admin" && <AdminView />}
        {activeRole === "SuperAdmin" && <SuperAdminView />}
        {activeRole === "DevSuite" && <DevSuiteView />}
      </main>

      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-6">
        <div className="mx-auto max-w-7xl space-y-4 px-4">
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {["GST Compliant", "PCI-DSS Ready", "ISO 27001", "UPI / Razorpay", "Multi-Branch ERP"].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 md:flex-row">
            <div>
              <p className="font-semibold text-slate-400">© 2026 {BRAND.product}. All rights reserved.</p>
              <p className="mt-0.5 text-[10px]">GSTIN {BRAND.gstin} · {BRAND.supportEmail}</p>
            </div>
            <div className="flex gap-4 font-medium">
              <span className="cursor-pointer hover:text-slate-300">Security Protocol</span>
              <a href="http://localhost:4000/api/docs" className="hover:text-slate-300">
                REST API Swagger
              </a>
            </div>
          </div>
        </div>
      </footer>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <AiChat />

      {cloudSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md space-y-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setCloudSyncModal(false)}
              className="absolute right-4 top-4 font-bold text-slate-400 hover:text-slate-100"
            >
              ✕
            </button>
            <div className="space-y-2 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-xl text-emerald-400">
                ☁️
              </div>
              <h3 className="text-lg font-extrabold text-slate-100">Activate Secure Cloud Sync</h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Sync orders, reservations, and inventory across all Nexovo Cafe System nodes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCloudSyncModal(false);
                triggerToast("Cloud sync simulation enabled!");
              }}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 text-xs font-black text-slate-950"
            >
              Enable Online Save Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GourmetPlatform() {
  return (
    <GourmetProvider>
      <PlatformBody />
    </GourmetProvider>
  );
}

/** Primary export — Nexovo Cafe System */
export const NexovoPlatform = GourmetPlatform;
