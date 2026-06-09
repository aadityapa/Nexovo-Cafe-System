import { z } from "zod";

export const createCategorySchema = z.object({
  restaurantId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  sortOrder: z.number().int().default(0)
});

export const createMenuItemSchema = z.object({
  restaurantId: z.string().uuid(),
  categoryId: z.string().uuid(),
  sku: z.string().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  taxRate: z.number().nonnegative().default(0),
  isVeg: z.boolean().default(false)
});
