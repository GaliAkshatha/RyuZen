import { z } from "zod";

/** Mirrors UpdateMentorshipSchema exactly — "remarks" is the only field, and it's required (not optional) */
export const updateMentorshipSchema = z.object({
  remarks: z
    .string()
    .trim()
    .min(1, "Remarks are required.")
    .max(1000, "Remarks must be at most 1000 characters."),
});

export type UpdateMentorshipFormValues = z.infer<typeof updateMentorshipSchema>;
