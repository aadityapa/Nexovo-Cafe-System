import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.string().uuid(),
  branchId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY", "QR_TABLE"]),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid().optional(),
        itemName: z.string().min(2),
        itemSku: z.string().optional(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().positive()
      })
    )
    .min(1)
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "ACCEPTED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED", "REFUNDED"])
});
