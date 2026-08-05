import { z } from "zod";

/**
 * Mirrors EligibilityCriteria exactly. Empty arrays are normalized to
 * undefined before submission (see PlacementDriveForm) so "nothing
 * selected" genuinely means "no restriction", matching the backend's
 * own default - not an empty-array edge case the evaluator has to
 * special-case.
 */
const eligibilityCriteriaSchema = z
  .object({
    departmentIds: z.array(z.string()).optional(),
    minCgpa: z.coerce.number().min(0).max(10).optional(),
    minSemester: z.coerce.number().int().min(1).max(12).optional(),
    batches: z.array(z.string()).optional(),
  })
  .optional();

/** Mirrors CreatePlacementDriveSchema exactly */
export const createPlacementDriveSchema = z.object({
  companyId: z.string().trim().min(1, "Company id is required."),
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters."),
  description: z
    .string()
    .trim()
    .max(3000, "Description must be at most 3000 characters.")
    .optional(),
  package: z.string().trim().max(100, "Package must be at most 100 characters.").optional(),
  location: z.string().trim().max(200, "Location must be at most 200 characters.").optional(),
  eligibility: z
    .string()
    .trim()
    .max(2000, "Eligibility must be at most 2000 characters.")
    .optional(),
  eligibilityCriteria: eligibilityCriteriaSchema,
  deadline: z.coerce.date({ errorMap: () => ({ message: "Enter a valid deadline." }) }).optional(),
});

export type CreatePlacementDriveFormValues = z.infer<typeof createPlacementDriveSchema>;

/** Mirrors UpdatePlacementDriveSchema exactly — every field optional, no companyId */
export const updatePlacementDriveSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .max(3000, "Description must be at most 3000 characters.")
    .optional(),
  package: z.string().trim().max(100, "Package must be at most 100 characters.").optional(),
  location: z.string().trim().max(200, "Location must be at most 200 characters.").optional(),
  eligibility: z
    .string()
    .trim()
    .max(2000, "Eligibility must be at most 2000 characters.")
    .optional(),
  eligibilityCriteria: eligibilityCriteriaSchema,
  deadline: z.coerce.date({ errorMap: () => ({ message: "Enter a valid deadline." }) }).optional(),
});

export type UpdatePlacementDriveFormValues = z.infer<typeof updatePlacementDriveSchema>;
