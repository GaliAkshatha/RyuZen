import { z } from "zod";

/** Mirrors the real backend CreateDepartmentSchema exactly. */
export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(150),
  code: z.string().trim().min(2, "At least 2 characters").max(20, "At most 20 characters"),
  description: z.string().trim().max(500, "At most 500 characters").optional(),
});
export type CreateDepartmentFormValues = z.infer<typeof createDepartmentSchema>;

/** Mirrors the real backend UpdateDepartmentSchema exactly - code deliberately absent, confirmed immutable after creation. */
export const updateDepartmentSchema = z.object({
  name: z.string().trim().min(2, "At least 2 characters").max(150).optional(),
  description: z.string().trim().max(500, "At most 500 characters").optional(),
});
export type UpdateDepartmentFormValues = z.infer<typeof updateDepartmentSchema>;
