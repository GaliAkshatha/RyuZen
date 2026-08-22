import { z } from "zod";

/**
 * Mirrors the real backend CreatePlacementDriveSchema. eligibilityCriteria
 * was previously silently stripped by the Zod schema (a confirmed
 * backend gap from earlier this engagement) - that's fixed, so it's
 * a genuine, reachable set of fields here. minSemester is a real
 * threshold ("6th semester or later"), not an exact list - a
 * different real shape than Activities' semesters array, since
 * Activities and Placement Drives model targeting independently in
 * the backend.
 */
export const createPlacementDriveSchema = z.object({
  companyId: z.string().trim().min(1, "Select a company"),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(3000).optional(),
  package: z.string().trim().max(100).optional(),
  location: z.string().trim().max(200).optional(),
  eligibility: z.string().trim().max(2000).optional(),
  eligibilityDepartmentIds: z.array(z.string()).optional(),
  eligibilityBatches: z.string().trim().optional(),
  eligibilityMinSemester: z.coerce.number().int().min(1).max(12).optional(),
  eligibilityMinCgpa: z.coerce.number().min(0).max(10).optional(),
  deadline: z.string().optional(),
});
export type CreatePlacementDriveFormValues = z.infer<typeof createPlacementDriveSchema>;
