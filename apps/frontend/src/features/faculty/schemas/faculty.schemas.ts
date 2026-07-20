import { z } from "zod";

/** Mirrors CreateFacultySchema exactly */
export const createFacultySchema = z.object({
  userId: z.string().trim().min(1, "User ID is required."),
  departmentId: z.string().trim().min(1).optional(),
  employeeId: z.string().trim().min(1, "Employee ID is required."),
  designation: z
    .string()
    .trim()
    .min(2, "Designation must be at least 2 characters.")
    .max(100, "Designation must be at most 100 characters."),
  specialization: z
    .string()
    .trim()
    .max(200, "Specialization must be at most 200 characters.")
    .optional(),
});

export type CreateFacultyFormValues = z.infer<typeof createFacultySchema>;

/** Mirrors UpdateFacultySchema exactly */
export const updateFacultySchema = z.object({
  employeeId: z.string().trim().min(1).optional(),
  designation: z
    .string()
    .trim()
    .min(2, "Designation must be at least 2 characters.")
    .max(100, "Designation must be at most 100 characters.")
    .optional(),
  specialization: z
    .string()
    .trim()
    .max(200, "Specialization must be at most 200 characters.")
    .optional(),
});

export type UpdateFacultyFormValues = z.infer<typeof updateFacultySchema>;

/** Mirrors AssignFacultyDepartmentSchema exactly */
export const assignFacultyDepartmentSchema = z.object({
  departmentId: z.string().trim().min(1, "Select a department."),
});

export type AssignFacultyDepartmentFormValues = z.infer<typeof assignFacultyDepartmentSchema>;
