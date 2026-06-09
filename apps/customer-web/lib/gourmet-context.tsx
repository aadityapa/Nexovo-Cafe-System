"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { BRAND } from "./brand";
import {
  FALLBACK_MENU,
  INITIAL_INVENTORY,
  INITIAL_RESERVATIONS,
  INITIAL_STAFF,
  MOCK_BRANCHES,
  mapApiItemToGourmet,
  mapApiOrder
} from "./gourmet-data";
import { fetchBootstrap, fetchOrders, placeOrder } from "./api";
import type {
  CartLine,
  GourmetMenuItem,
  InventoryRow,
  PlatformOrder,
  Reservation,
  RoleId,
  StaffMember
} from "./gourmet-types";

type GourmetContextValue = {
  activeRole: RoleId;
  setActiveRole: (r: RoleId) => void;
  currentBranch: string;
  setCurrentBranch: (id: string) => void;
  branches: typeof MOCK_BRANCHES;
  menuItems: GourmetMenuItem[];
  inventory: InventoryRow[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryRow[]>>;
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  reservations: Reservation[];
  orders: PlatformOrder[];
  setOrders: React.Dispatch<React.SetStateAction<PlatformOrder[]>>;
  restaurantId: string;
  branchId: string;
  customerCart: CartLine[];
  setCustomerCart: React.Dispatch<React.SetStateAction<CartLine[]>>;
  posCart: CartLine[];
  setPosCart: React.Dispatch<React.SetStateAction<CartLine[]>>;
  toastMessage: string;
  triggerToast: (msg: string) => void;
  refreshOrders: () => Promise<void>;
  placeCustomerOrder: (payload: {
    deliveryType: string;
    customerTable: string;
    appliedDiscount: number;
  }) => Promise<void>;
  advanceOrderStatus: (orderId: string, nextStatus: string) => Promise<void>;
  apiReady: boolean;
};

const GourmetContext = createContext<GourmetContextValue | null>(null);

export function GourmetProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<RoleId>("Customer");
  const [currentBranch, setCurrentBranch] = useState("br1");
  const [menuItems, setMenuItems] = useState<GourmetMenuItem[]>(FALLBACK_MENU);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [reservations] = useState(INITIAL_RESERVATIONS);
  const [orders, setOrders] = useState<PlatformOrder[]>([
    {
      id: `${BRAND.orderPrefix}-1024`,
      items: [{ name: "Truffle Mushroom Artisan Pizza", variant: 'Medium 12"', price: 18.99, addons: [], quantity: 1 }],
      total: 25.84,
      status: "Cooking",
      type: "Dine In",
      table: "Table 5",
      customer: "Sophia Loren",
      timestamp: "11:45 AM"
    }
  ]);
  const [customerCart, setCustomerCart] = useState<CartLine[]>([]);
  const [posCart, setPosCart] = useState<CartLine[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [apiReady, setApiReady] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  }, []);

  useEffect(() => {
    fetchBootstrap()
      .then((data) => {
        setRestaurantId(data.restaurant.id);
        setBranchId(data.branch?.id ?? "");
        if (data.items?.length) {
          setMenuItems(data.items.map(mapApiItemToGourmet));
        }
        setApiReady(true);
        if (data.branch?.id) {
          fetchOrders(data.branch.id)
            .then((list) => {
              if (list.length) setOrders(list.map(mapApiOrder));
            })
            .catch(() => undefined);
        }
        if (typeof window !== "undefined") {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
          const tryLogin = async (email: string) => {
            const r = await fetch(`${apiUrl}/api/v1/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password: "Demo@123" })
            });
            if (!r.ok) return null;
            const d = await r.json();
            return d.accessToken as string | null;
          };
          tryLogin("owner@nexovo.demo")
            .then((token) => token ?? tryLogin("owner@brewbite.demo"))
            .then((token) => token && setAdminToken(token))
            .catch(() => undefined);
        }
      })
      .catch(() => {
        triggerToast("API offline — using premium demo data.");
      });
  }, [triggerToast]);

  const refreshOrders = useCallback(async () => {
    if (!branchId) return;
    try {
      const list = await fetchOrders(branchId);
      if (list.length) setOrders(list.map(mapApiOrder));
    } catch {
      // API offline — keep local demo orders
    }
  }, [branchId]);

  const placeCustomerOrder = useCallback(
    async ({
      deliveryType,
      customerTable,
      appliedDiscount
    }: {
      deliveryType: string;
      customerTable: string;
      appliedDiscount: number;
    }) => {
      const subtotal = customerCart.reduce(
        (s, item) => s + (item.price + item.addons.reduce((a, x) => a + x.price, 0)) * item.quantity,
        0
      );
      const total = subtotal * (1 - appliedDiscount / 100) * 1.05;

      if (apiReady && restaurantId && branchId) {
        try {
          const orderItems = customerCart
            .map((l) => {
              const menuItemId = l.menuItemId || menuItems.find((m) => m.name === l.name)?.id;
              if (!menuItemId) return null;
              return {
                menuItemId,
                itemName: l.name,
                itemSku: undefined as string | undefined,
                quantity: l.quantity,
                unitPrice: l.price + l.addons.reduce((a, x) => a + x.price, 0)
              };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null);

          if (orderItems.length === 0) {
            throw new Error("No valid menu items in cart");
          }

          const order = await placeOrder({
            restaurantId,
            branchId,
            orderType: deliveryType === "Dine In" ? "DINE_IN" : deliveryType === "Pickup" ? "TAKEAWAY" : "DELIVERY",
            items: orderItems
          });
          setOrders((prev) => [
            {
              id: order.orderNumber,
              items: customerCart,
              total: Number(order.totalAmount),
              status: "New",
              type: deliveryType,
              table: deliveryType === "Dine In" ? customerTable : null,
              customer: "Guest",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            },
            ...prev
          ]);
        } catch {
          triggerToast("Order failed — check API is running. Using local queue.");
          const id = `${BRAND.orderPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
          setOrders((prev) => [
            {
              id,
              items: [...customerCart],
              total: parseFloat(total.toFixed(2)),
              status: "New",
              type: deliveryType,
              table: deliveryType === "Dine In" ? customerTable : null,
              customer: "Guest",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            },
            ...prev
          ]);
        }
      } else {
        const id = `${BRAND.orderPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrders((prev) => [
          {
            id,
            items: [...customerCart],
            total: parseFloat(total.toFixed(2)),
            status: "New",
            type: deliveryType,
            table: deliveryType === "Dine In" ? customerTable : null,
            customer: "Guest",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          },
          ...prev
        ]);
      }
      setCustomerCart([]);
      triggerToast("Order dispatched to kitchen queue!");
    },
    [apiReady, branchId, customerCart, menuItems, restaurantId, triggerToast]
  );

  const advanceOrderStatus = useCallback(
    async (orderNumber: string, nextStatus: string) => {
      const statusMap: Record<string, string> = {
        Cooking: "PREPARING",
        Ready: "READY",
        Delivered: "COMPLETED",
        New: "PREPARING"
      };
      setOrders((prev) => prev.map((o) => (o.id === orderNumber ? { ...o, status: nextStatus } : o)));
      if (apiReady && adminToken && branchId) {
        try {
          const list = await fetchOrders(branchId);
          const match = list.find((x: { orderNumber: string }) => x.orderNumber === orderNumber);
          if (match) {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/v1/public/orders/${match.id}/status`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${adminToken}`
                },
                body: JSON.stringify({ status: statusMap[nextStatus] || "PREPARING" })
              }
            );
            if (!res.ok) throw new Error("status update failed");
            await refreshOrders();
          }
        } catch {
          triggerToast(`Updated locally: ${orderNumber} → ${nextStatus}`);
          return;
        }
      }
      triggerToast(`Order ${orderNumber} → ${nextStatus}`);
    },
    [adminToken, apiReady, branchId, triggerToast, refreshOrders]
  );

  const value = useMemo(
    () => ({
      activeRole,
      setActiveRole,
      currentBranch,
      setCurrentBranch,
      branches: MOCK_BRANCHES,
      menuItems,
      inventory,
      setInventory,
      staff,
      setStaff,
      reservations,
      orders,
      setOrders,
      restaurantId,
      branchId,
      customerCart,
      setCustomerCart,
      posCart,
      setPosCart,
      toastMessage,
      triggerToast,
      refreshOrders,
      placeCustomerOrder,
      advanceOrderStatus,
      apiReady
    }),
    [
      activeRole,
      currentBranch,
      menuItems,
      inventory,
      staff,
      reservations,
      orders,
      restaurantId,
      branchId,
      customerCart,
      posCart,
      toastMessage,
      triggerToast,
      refreshOrders,
      placeCustomerOrder,
      advanceOrderStatus,
      apiReady
    ]
  );

  return <GourmetContext.Provider value={value}>{children}</GourmetContext.Provider>;
}

export function useGourmet() {
  const ctx = useContext(GourmetContext);
  if (!ctx) throw new Error("useGourmet requires GourmetProvider");
  return ctx;
}
