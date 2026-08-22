import { z } from "zod";

/**
 * Mirrors the real backend CreateActivitySchema. `type` is set by the
 * wizard's own step-1 state, not this form. Targeting fields
 * (department/batch/semester/section) are real, independent arrays -
 * confirmed directly that SubmissionEligibilityService enforces
 * whichever ones are populated regardless of what `visibility` is set
 * to. departmentIds is genuinely required now (backend schema change,
 * per explicit product direction: an activity must specify at least
 * one real target department, not be open to the whole organization
 * by default) - batches/semesters/sections stay optional refinements
 * within that department.
 */
export const createActivitySchema = z.object({
  title: z.string().trim().min(3, "At least 3 characters").max(200),
  description: z.string().trim().min(10, "At least 10 characters").max(5000),
  visibility: z.enum(["PUBLIC", "DEPARTMENT", "SEMESTER", "YEAR", "PRIVATE"]),
  departmentIds: z.array(z.string()).min(1, "Select at least one department"),
  batches: z.string().trim().optional(),
  semesters: z.string().trim().optional(),
  sections: z.string().trim().optional(),
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
