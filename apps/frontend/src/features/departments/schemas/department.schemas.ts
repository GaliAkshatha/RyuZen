import { z } from "zod";

/** Mirrors CreateDepartmentSchema exactly */
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be at most 150 characters."),
  code: z
    .string()
    .trim()
    .min(2, "Code must be at least 2 characters.")
    .max(20, "Code must be at most 20 characters."),
  description: z.string().trim().max(500, "Description must be at most 500 characters.").optional(),
});

export type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>;

/** Mirrors UpdateDepartmentSchema exactly — "code" is deliberately absent, matching the backend */
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(150, "Name must be at most 150 characters.")
    .optional(),
  description: z.string().trim().max(500, "Description must be at most 500 characters.").optional(),
});

export type UpdateDepartmentFormValues = z.infer<typeof updateDepartmentSchema>;

/** Mirrors AssignHeadOfDepartmentSchema exactly */
export const assignHeadOfDepartmentSchema = z.object({
  userId: z.string().trim().min(1, "Select a faculty member."),
});

export type AssignHeadOfDepartmentFormValues = z.infer<typeof assignHeadOfDepartmentSchema>;
