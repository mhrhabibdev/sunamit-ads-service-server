// modules/Order/order.validation.ts
import { z } from "zod";

// Logged-in user schema
export const userOrderSchema = z.object({
  serviceId: z.string({ error: "Service ID is required" }),
  quantity: z.number().int().positive().optional().default(1),
});

// Guest user schema
export const guestOrderSchema = z.object({
  serviceId: z.string({ error: "Service ID is required" }),
  quantity: z.number().int().positive().optional().default(1),
  guestName: z.string({ error: "Guest name is required" }).min(1),
  guestEmail: z.string().email({ message: "Invalid email address" }),
  guestPhone: z.string({ error: "Guest phone is required" }).min(1),
  guestLink: z.string().url().optional().or(z.literal('')),
});

export type UserOrderInput = z.infer<typeof userOrderSchema>;
export type GuestOrderInput = z.infer<typeof guestOrderSchema>;