const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function safeFetch(input: string, init?: RequestInit) {
  try {
    const res = await fetch(input, { ...init, cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchBootstrap() {
  const data = await safeFetch(`${API_URL}/api/v1/public/bootstrap`);
  if (!data) throw new Error("Failed to load menu");
  return data;
}

export async function placeOrder(payload: {
  restaurantId: string;
  branchId: string;
  orderType: string;
  notes?: string;
  items: { menuItemId: string; itemName: string; itemSku?: string; quantity: number; unitPrice: number }[];
}) {
  const res = await fetch(`${API_URL}/api/v1/public/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Order failed");
  return res.json();
}

export async function trackOrder(orderId: string) {
  const data = await safeFetch(`${API_URL}/api/v1/public/orders/${orderId}`);
  if (!data) throw new Error("Order not found");
  return data;
}

export async function fetchOrders(branchId: string) {
  if (!branchId) return [];
  const data = await safeFetch(`${API_URL}/api/v1/public/orders?branchId=${encodeURIComponent(branchId)}`);
  return Array.isArray(data) ? data : [];
}

export async function updateOrderStatus(orderId: string, status: string, token: string) {
  const res = await fetch(`${API_URL}/api/v1/public/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}
