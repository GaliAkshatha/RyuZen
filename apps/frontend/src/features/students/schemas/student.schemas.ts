import { z } from "zod";

/** Mirrors CreateStudentSchema exactly */
export const createStudentSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required."),
  departmentId: z.string().trim().min(1).optional(),
  usn: z.string().trim().min(2, "USN is required."),
  batch: z.string().trim().min(2, "Batch is required."),
  semester: z.coerce
    .number()
    .min(1, "Semester must be at least 1.")
    .max(12, "Semester must be at most 12.")
    .optional(),
  cgpa: z.coerce
    .number()
    .min(0, "CGPA must be at least 0.")
    .max(10, "CGPA must be at most 10.")
    .optional(),
});

export type CreateStudentFormValues = z.infer<typeof createStudentSchema>;

/** Mirrors UpdateStudentSchema exactly — "semester" is deliberately absent, matching the backend (promote-only) */
export const updateStudentSchema = z.object({
  usn: z.string().trim().min(2).optional(),
  batch: z.string().trim().min(2).optional(),
  cgpa: z.coerce
    .number()
    .min(0, "CGPA must be at least 0.")
    .max(10, "CGPA must be at most 10.")
    .optional(),
});

export type UpdateStudentFormValues = z.infer<typeof updateStudentSchema>;

/** Mirrors AssignMentorSchema exactly */
export const assignMentorSchema = z.object({
  facultyId: z.string().trim().min(1, "Select a mentor."),
});

export type AssignMentorFormValues = z.infer<typeof assignMentorSchema>;
