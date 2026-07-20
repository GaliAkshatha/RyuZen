import { z } from "zod";

const attachmentSchema = z.object({
  name: z.string().trim().min(1, "Attachment name is required."),
  url: z.string().url("Invalid attachment URL."),
  mimeType: z.string().trim().min(1, "MIME type is required."),
});

/** Mirrors CreateSubmissionSchema exactly — attachments requires at least 1 item */
export const createSubmissionSchema = z.object({
  activityId: z.string().trim().min(1, "Activity ID is required."),
  remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters.").default(""),
  attachments: z.array(attachmentSchema).min(1, "At least one attachment is required."),
});

export type CreateSubmissionFormValues = z.infer<typeof createSubmissionSchema>;

/** Mirrors ResubmitSubmissionSchema exactly */
export const resubmitSubmissionSchema = z.object({
  remarks: z.string().trim().max(500, "Remarks cannot exceed 500 characters.").default(""),
  attachments: z.array(attachmentSchema).min(1, "At least one attachment is required."),
});

export type ResubmitSubmissionFormValues = z.infer<typeof resubmitSubmissionSchema>;

/** Mirrors ApproveSubmissionSchema exactly — no "status" field, implied APPROVED */
export const approveSubmissionSchema = z.object({
  feedback: z
    .string()
    .trim()
    .min(1, "Feedback is required.")
    .max(1000, "Feedback cannot exceed 1000 characters."),
  pointsAwarded: z.coerce
    .number()
    .int("Points must be a whole number.")
    .min(0, "Points cannot be negative."),
});

export type ApproveSubmissionFormValues = z.infer<typeof approveSubmissionSchema>;

/** Mirrors RejectSubmissionSchema exactly — feedback only */
export const rejectSubmissionSchema = z.object({
  feedback: z
    .string()
    .trim()
    .min(1, "Feedback is required.")
    .max(1000, "Feedback cannot exceed 1000 characters."),
});

export type RejectSubmissionFormValues = z.infer<typeof rejectSubmissionSchema>;
