export type GourmetMenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  variants: string[];
  addons: { name: string; price: number }[];
  bestSeller: boolean;
};

export type CartLine = {
  menuItemId?: string;
  name: string;
  variant: string;
  price: number;
  addons: { name: string; price: number }[];
  quantity: number;
};

export type PlatformOrder = {
  id: string;
  items: CartLine[];
  total: number;
  status: string;
  type: string;
  table?: string | null;
  address?: string;
  customer: string;
  timestamp: string;
  paymentStatus?: string;
  paymentMethod?: string;
};

export type Branch = { id: string; name: string; location: string; sales: number; performance: string };

export type InventoryRow = {
  item: string;
  stock: number;
  minStock: number;
  costPerUnit: number;
  unit: string;
  vendor: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  shift: string;
  phone: string;
  status: string;
};

export type Reservation = {
  id: string;
  customerName: string;
  guests: number;
  date: string;
  time: string;
  status: string;
  tableId: number;
};

export type RoleId = "Customer" | "POS" | "Kitchen" | "Admin" | "SuperAdmin" | "DevSuite";
