import type { GourmetMenuItem, Branch, InventoryRow, StaffMember, Reservation } from "./gourmet-types";

export const MOCK_BRANCHES: Branch[] = [
  { id: "br1", name: "Nexovo Indiranagar (HQ)", location: "12th Main, Bengaluru, Karnataka", sales: 4895000, performance: "Outstanding" },
  { id: "br2", name: "Nexovo Koramangala", location: "5th Block, Bengaluru", sales: 3241050, performance: "Optimal" },
  { id: "br3", name: "Nexovo Whitefield Tech Park", location: "ITPL Road, Bengaluru", sales: 1254000, performance: "Awaiting Growth" }
];

export const FALLBACK_MENU: GourmetMenuItem[] = [
  {
    id: "m1",
    name: "Truffle Mushroom Artisan Pizza",
    category: "Pizza",
    price: 1599,
    rating: 4.9,
    reviews: 124,
    description: "Fresh black winter truffles, wild porcini, cream-infused mozzarella, and micro-herbs on sourdough.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
    variants: ['Personal 8"', 'Medium 12"', 'Enterprise 16"'],
    addons: [
      { name: "Extra Fresh Truffle Shavings", price: 499 },
      { name: "Artisan Burrata", price: 375 },
      { name: "Gluten-Free Crust", price: 199 }
    ],
    bestSeller: true
  },
  {
    id: "m2",
    name: "Dry-Aged Wagyu Truffle Smash",
    category: "Burger",
    price: 1449,
    rating: 4.8,
    reviews: 312,
    description: "Double custom-blend dry-aged Wagyu beef patties, melted aged cheddar, secret sauce, brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    variants: ["Single Stack", "Double Smash", "Imperial Triple"],
    addons: [
      { name: "Crispy Applewood Bacon", price: 149 },
      { name: "Organic Fried Egg", price: 99 }
    ],
    bestSeller: true
  },
  {
    id: "m3",
    name: "Kyoto Gold-Leaf Cold Brew",
    category: "Coffee",
    price: 549,
    rating: 4.95,
    reviews: 89,
    description: "Slow-dripped for 24 hours through Kyoto towers with edible 24k gold leaf.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600",
    variants: ["Standard 12oz", "Imperial 16oz"],
    addons: [{ name: "Oat Milk Alternative", price: 59 }],
    bestSeller: false
  },
  {
    id: "m4",
    name: "Pistachio Kunafa Baklava Cheesecake",
    category: "Desserts",
    price: 799,
    rating: 4.92,
    reviews: 245,
    description: "Creamy New York cheesecake with crispy kunafa and Turkish pistachio butter.",
    image: "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&q=80&w=600",
    variants: ["Slice", "Whole Cake (Pre-order)"],
    addons: [{ name: "Madagascar Vanilla Gelato", price: 249 }],
    bestSeller: true
  }
];

export const INITIAL_INVENTORY: InventoryRow[] = [
  { item: "Wagyu Beef (g)", stock: 8500, minStock: 2000, costPerUnit: 6.5, unit: "g", vendor: "Global Meats India" },
  { item: "Mozzarella (g)", stock: 6200, minStock: 1500, costPerUnit: 1.6, unit: "g", vendor: "Artisanal Dairy Co." },
  { item: "Arabica Beans (g)", stock: 4500, minStock: 1000, costPerUnit: 4.2, unit: "g", vendor: "Coorg Roast Imports" },
  { item: "Brioche Buns (pcs)", stock: 82, minStock: 20, costPerUnit: 48, unit: "pcs", vendor: "Supreme Bakers" }
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: "st1", name: "Aarav Mehta", role: "Manager", shift: "Morning", phone: "+91 98765 43210", status: "On-Duty" },
  { id: "st2", name: "Priya Nair", role: "Chef", shift: "Morning", phone: "+91 98765 43211", status: "On-Duty" },
  { id: "st3", name: "John Doe", role: "Cashier", shift: "Evening", phone: "+91 98765 43212", status: "Off-Duty" },
  { id: "st4", name: "Elena Rostova", role: "Waiter", shift: "Morning", phone: "+91 98765 43213", status: "On-Duty" }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  { id: "res1", customerName: "Sophia Loren", guests: 4, date: "2026-06-01", time: "19:30", status: "Confirmed", tableId: 5 },
  { id: "res2", customerName: "Marcus Aurelius", guests: 2, date: "2026-06-01", time: "20:15", status: "Confirmed", tableId: 3 }
];

const CATEGORY_VARIANTS: Record<string, string[]> = {
  Pizza: ['Personal 8"', 'Medium 12"', 'Enterprise 16"'],
  Burger: ["Single Stack", "Double Smash", "Imperial Triple"],
  Coffee: ["Standard 12oz", "Imperial 16oz", "Hot", "Iced"],
  Desserts: ["Slice", "Whole Cake"],
  default: ["Regular", "Large"]
};

export function mapApiItemToGourmet(item: {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  imageUrl: string | null;
  categoryName: string;
  isVegetarian: boolean;
}): GourmetMenuItem {
  const cat = item.categoryName || "Specials";
  return {
    id: item.id,
    name: item.name,
    category: cat,
    price: item.basePrice,
    rating: 4.7 + Math.random() * 0.25,
    reviews: 50 + Math.floor(Math.random() * 200),
    description: item.description || "Chef-crafted premium selection.",
    image: item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    variants: CATEGORY_VARIANTS[cat] || CATEGORY_VARIANTS.default,
    addons: item.isVegetarian
      ? [{ name: "Extra Garnish", price: 99 }]
      : [
          { name: "Premium Add-on", price: 149 },
          { name: "Extra Portion", price: 199 }
        ],
    bestSeller: item.name.toLowerCase().includes("wagyu") || item.name.toLowerCase().includes("truffle")
  };
}

export function mapApiOrder(o: {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  totalAmount: number;
  placedAt: string;
  orderItems: { itemName: string; quantity: number; unitPrice: number }[];
}): import("./gourmet-types").PlatformOrder {
  const statusMap: Record<string, string> = {
    PENDING: "New",
    CONFIRMED: "New",
    ACCEPTED: "New",
    PREPARING: "Cooking",
    READY: "Ready",
    OUT_FOR_DELIVERY: "Ready",
    COMPLETED: "Delivered",
    CANCELLED: "Delivered"
  };
  return {
    id: o.orderNumber,
    items: o.orderItems.map((i) => ({
      name: i.itemName,
      variant: "Standard",
      price: Number(i.unitPrice),
      addons: [],
      quantity: i.quantity
    })),
    total: Number(o.totalAmount),
    status: statusMap[o.status] || o.status,
    type: o.orderType.replace(/_/g, " "),
    customer: "Guest",
    timestamp: new Date(o.placedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    paymentStatus: "Paid",
    paymentMethod: "UPI"
  };
}
