import { z } from "zod";

/** Mirrors IssueCertificateSchema exactly */
export const issueCertificateSchema = z.object({
  studentId: z.string().trim().min(1, "Select a student."),
  eventId: z.string().trim().min(1).optional(),
  activityId: z.string().trim().min(1).optional(),
  certificateUrl: z.string().trim().url("A valid certificate URL is required."),
});

export type IssueCertificateFormValues = z.infer<typeof issueCertificateSchema>;
