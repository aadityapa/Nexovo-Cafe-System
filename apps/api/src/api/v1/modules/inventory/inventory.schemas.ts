import { z } from "zod";

export const createInventoryItemSchema = z.object({
  restaurantId: z.string().uuid(),
  sku: z.string().min(1),
  name: z.string().min(2),
  unit: z.string().min(1),
  reorderLevel: z.number().positive().optional()
});

export const recordMovementSchema = z.object({
  branchId: z.string().uuid(),
  inventoryItemId: z.string().uuid(),
  movementType: z.enum(["IN", "OUT", "ADJUSTMENT", "WASTAGE"]),
  quantity: z.number().positive(),
  reason: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional()
});
