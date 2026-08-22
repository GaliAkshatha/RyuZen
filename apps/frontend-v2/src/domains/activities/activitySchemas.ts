import { z } from "zod";

/** Mirrors the real backend CreateActivitySchema - the fields a faculty member fills in directly. Attachments are handled separately (not a form field for this first pass), so this covers the schema's required fields with an empty attachments array supplied at submit time. */
export const createActivitySchema = z.object({
  title: z.string().trim().min(3, "At least 3 characters").max(200),
  description: z.string().trim().min(10, "At least 10 characters").max(5000),
  type: z.enum(["ASSIGNMENT", "WORKSHOP", "EVENT", "HACKATHON", "QUIZ", "FORM", "SURVEY"]),
  visibility: z.enum(["PUBLIC", "DEPARTMENT", "SEMESTER", "YEAR", "PRIVATE"]),
  departmentIds: z.array(z.string()).optional(),
  batches: z.string().trim().optional(),
  points: z.coerce.number().min(0, "Cannot be negative"),
  penaltyPoints: z.coerce.number().min(0, "Cannot be negative"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});
export type CreateActivityFormValues = z.infer<typeof createActivitySchema>;

/** Mirrors the real backend ApproveSubmissionSchema exactly - both fields genuinely required. */
export const approveSubmissionSchema = z.object({
  feedback: z.string().trim().min(1, "Feedback is required").max(1000),
  pointsAwarded: z.coerce.number().int().min(0, "Cannot be negative"),
});
export type ApproveSubmissionFormValues = z.infer<typeof approveSubmissionSchema>;

/** Mirrors the real backend RejectSubmissionSchema exactly. */
export const rejectSubmissionSchema = z.object({
  feedback: z.string().trim().min(1, "Feedback is required").max(1000),
});
export type RejectSubmissionFormValues = z.infer<typeof rejectSubmissionSchema>;
