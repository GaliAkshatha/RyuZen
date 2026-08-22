import { z } from "zod";

/** Mirrors the real backend UpdateProfileSchema exactly. */
export const updateProfileSchema = z.object({
  name: z.string().trim().min(3, "At least 3 characters").max(100).optional(),
  image: z.string().trim().max(500).optional(),
  phone: z.string().trim().max(20).optional(),
  bio: z.string().trim().max(300).optional(),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
