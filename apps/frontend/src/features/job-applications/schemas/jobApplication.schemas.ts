import { z } from "zod";

import { JobApplicationStatus } from "@/types/enums";

/** Mirrors ApplyToPlacementSchema exactly */
export const applyToPlacementSchema = z.object({
  resume: z.string().trim().url("Invalid resume URL.").optional(),
});

export type ApplyToPlacementFormValues = z.infer<typeof applyToPlacementSchema>;

/** Mirrors UpdateJobApplicationStatusSchema exactly */
export const updateJobApplicationStatusSchema = z.object({
  status: z.enum([
    JobApplicationStatus.APPLIED,
    JobApplicationStatus.SHORTLISTED,
    JobApplicationStatus.REJECTED,
    JobApplicationStatus.SELECTED,
  ]),
  remarks: z.string().trim().max(1000, "Remarks must be at most 1000 characters.").optional(),
});

export type UpdateJobApplicationStatusFormValues = z.infer<typeof updateJobApplicationStatusSchema>;
