import { z } from "zod";

export const createRestaurantSchema = z.object({
  slug: z.string().min(2),
  legalName: z.string().min(2),
  displayName: z.string().min(2),
  timezone: z.string().default("Asia/Kolkata"),
  currency: z.string().default("INR"),
  supportEmail: z.string().email().optional(),
  supportPhone: z.string().min(10).max(20).optional()
});

export const createBranchSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  addressLine1: z.string().min(2),
  phone: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  country: z.string().default("India"),
  postalCode: z.string().optional(),
  email: z.string().email().optional()
});
