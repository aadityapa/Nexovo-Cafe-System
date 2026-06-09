export type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  imageUrl: string | null;
  basePrice: number;
  isVegetarian: boolean;
  categoryId: string;
  categoryName: string;
  prepTimeMinutes?: number | null;
};

export type Bootstrap = {
  restaurant: { id: string; name: string; slug: string; currency: string };
  branch: { id: string; name: string; code: string; city: string } | null;
  categories: { id: string; name: string; sortOrder: number; itemCount: number }[];
  items: MenuItem[];
};

export type CartLine = MenuItem & { quantity: number };

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  orderType: string;
  totalAmount: number;
  taxAmount: number;
  subtotalAmount: number;
  orderItems: { itemName: string; quantity: number; lineTotal: number }[];
};
