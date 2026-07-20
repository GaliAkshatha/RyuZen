import { z } from "zod";

/** Mirrors CreateEducationSchema exactly */
export const createEducationSchema = z.object({
  institution: z
    .string()
    .trim()
    .min(1, "Institution is required.")
    .max(200, "Institution must be at most 200 characters."),
  degree: z
    .string()
    .trim()
    .min(1, "Degree is required.")
    .max(150, "Degree must be at most 150 characters."),
  branch: z.string().trim().max(150, "Branch must be at most 150 characters.").optional(),
  cgpa: z.coerce
    .number()
    .min(0, "CGPA must be at least 0.")
    .max(10, "CGPA must be at most 10.")
    .optional(),
  startYear: z.coerce
    .number()
    .min(1950, "Enter a valid start year.")
    .max(2100, "Enter a valid start year."),
  endYear: z.coerce
    .number()
    .min(1950, "Enter a valid end year.")
    .max(2100, "Enter a valid end year.")
    .optional(),
});

export type CreateEducationFormValues = z.infer<typeof createEducationSchema>;

/** Mirrors UpdateEducationSchema exactly — every field optional */
export const updateEducationSchema = z.object({
  institution: z
    .string()
    .trim()
    .min(1, "Institution is required.")
    .max(200, "Institution must be at most 200 characters.")
    .optional(),
  degree: z
    .string()
    .trim()
    .min(1, "Degree is required.")
    .max(150, "Degree must be at most 150 characters.")
    .optional(),
  branch: z.string().trim().max(150, "Branch must be at most 150 characters.").optional(),
  cgpa: z.coerce
    .number()
    .min(0, "CGPA must be at least 0.")
    .max(10, "CGPA must be at most 10.")
    .optional(),
  startYear: z.coerce
    .number()
    .min(1950, "Enter a valid start year.")
    .max(2100, "Enter a valid start year.")
    .optional(),
  endYear: z.coerce
    .number()
    .min(1950, "Enter a valid end year.")
    .max(2100, "Enter a valid end year.")
    .optional(),
});

export type UpdateEducationFormValues = z.infer<typeof updateEducationSchema>;
