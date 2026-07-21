import { z } from "zod";

/** Mirrors CreateBadgeSchema exactly */
export const createBadgeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  description: z.string().trim().max(500, "Description must be at most 500 characters.").optional(),
  icon: z.string().trim().max(500, "Icon URL must be at most 500 characters.").optional(),
  criteria: z.string().trim().max(500, "Criteria must be at most 500 characters.").optional(),
  points: z.coerce.number().min(0, "Points must be at least 0.").optional(),
});

export type CreateBadgeFormValues = z.infer<typeof createBadgeSchema>;

/** Mirrors UpdateBadgeSchema exactly — every field optional (identical shape to create, just all optional, matching the backend) */
export const updateBadgeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters.")
    .optional(),
  description: z.string().trim().max(500, "Description must be at most 500 characters.").optional(),
  icon: z.string().trim().max(500, "Icon URL must be at most 500 characters.").optional(),
  criteria: z.string().trim().max(500, "Criteria must be at most 500 characters.").optional(),
  points: z.coerce.number().min(0, "Points must be at least 0.").optional(),
});

export type UpdateBadgeFormValues = z.infer<typeof updateBadgeSchema>;

/** Mirrors AwardBadgeSchema exactly */
export const awardBadgeSchema = z.object({
  studentId: z.string().trim().min(1, "Select a student."),
});

export type AwardBadgeFormValues = z.infer<typeof awardBadgeSchema>;
