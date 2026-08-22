import { z } from "zod";

/** Mirrors the real backend CreateSubmissionSchema exactly - attachments genuinely requires at least one entry (confirmed directly), not an optional nicety. */
export const createSubmissionSchema = z.object({
  remarks: z.string().trim().max(500, "Under 500 characters").optional(),
  attachments: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Required"),
        url: z.string().trim().url("Enter a valid URL"),
        mimeType: z.string().trim().min(1, "Required"),
      }),
    )
    .min(1, "At least one attachment is required"),
});
export type CreateSubmissionFormValues = z.infer<typeof createSubmissionSchema>;
