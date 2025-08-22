import { z } from "zod";

export const createAdServiceValidation = z.object({
  name: z.string().min(1, "Service name is required"),
  image: z.string().url("Image must be a valid URL").optional(),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  duration: z.number().int().positive("Duration must be a positive number"),
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  price: z.number().positive("Price must be positive"),
});

export const updateAdServiceValidation = createAdServiceValidation.partial();

export const AdValidation = {
  createAdServiceValidation,
  updateAdServiceValidation,
};
