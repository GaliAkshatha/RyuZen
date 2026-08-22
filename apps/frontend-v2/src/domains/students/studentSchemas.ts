import { z } from "zod";

/** Mirrors the real backend CreateStudentSchema exactly. */
export const createStudentSchema = z.object({
  userId: z.string().trim().min(1, "User id is required"),
  departmentId: z.string().trim().min(1).optional(),
  usn: z.string().trim().min(2, "USN is required"),
  batch: z.string().trim().min(2, "Batch is required"),
  semester: z.coerce.number().min(1).max(12).optional(),
  cgpa: z.coerce.number().min(0).max(10).optional(),
});
export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;
