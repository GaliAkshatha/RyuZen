import { z } from "zod";

/** Mirrors the real backend CreatePlacementDriveSchema exactly - deliberately no eligibilityCriteria field, see the type file's comment for why. */
export const createPlacementDriveSchema = z.object({
  companyId: z.string().trim().min(1, "Select a company"),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(3000).optional(),
  package: z.string().trim().max(100).optional(),
  location: z.string().trim().max(200).optional(),
  eligibility: z.string().trim().max(2000).optional(),
  deadline: z.string().optional(),
});
export type CreatePlacementDriveFormValues = z.infer<typeof createPlacementDriveSchema>;
