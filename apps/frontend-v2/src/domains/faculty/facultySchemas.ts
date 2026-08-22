import { z } from "zod";

/** Mirrors the real backend CreateFacultySchema exactly. */
export const createFacultySchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
  departmentId: z.string().trim().min(1).optional(),
  employeeId: z.string().trim().min(1, "Employee id is required"),
  designation: z.string().trim().min(2, "At least 2 characters").max(100),
  specialization: z.string().trim().max(200).optional(),
});
export type CreateFacultyFormValues = z.infer<typeof createFacultySchema>;

/** Mirrors the real backend UpdateFacultySchema exactly - userId/departmentId deliberately absent. */
export const updateFacultySchema = z.object({
  employeeId: z.string().trim().min(1).optional(),
  designation: z.string().trim().min(2).max(100).optional(),
  specialization: z.string().trim().max(200).optional(),
});
export type UpdateFacultyFormValues = z.infer<typeof updateFacultySchema>;
