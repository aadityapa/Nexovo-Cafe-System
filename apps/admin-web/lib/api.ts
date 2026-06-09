const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cafe_admin_token");
}

export function setToken(token: string) {
  localStorage.setItem("cafe_admin_token", token);
}

export function clearToken() {
  localStorage.removeItem("cafe_admin_token");
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function fetchAnalytics(branchId: string) {
  const res = await fetch(`${API_URL}/api/v1/public/analytics?branchId=${branchId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load analytics");
  return res.json();
}

export async function fetchOrders(branchId: string) {
  const res = await fetch(`${API_URL}/api/v1/public/orders?branchId=${branchId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export async function fetchBootstrap() {
  const res = await fetch(`${API_URL}/api/v1/public/bootstrap`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load data");
  return res.json();
}

export async function updateOrderStatus(orderId: string, status: string) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/v1/public/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function createPosOrder(payload: {
  restaurantId: string;
  branchId: string;
  orderType: string;
  items: { menuItemId: string; itemName: string; itemSku?: string; quantity: number; unitPrice: number }[];
}) {
  const res = await fetch(`${API_URL}/api/v1/public/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("POS order failed");
  return res.json();
}
