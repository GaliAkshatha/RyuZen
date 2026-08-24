import { z } from "zod";

/** Mirrors the real backend SendNotificationSchema exactly. */
export const sendNotificationSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
  type: z.enum(["ANNOUNCEMENT", "ALERT", "INFO", "REMINDER"]).optional(),
  targetAudience: z.enum(["ALL", "ORG_ADMIN", "FACULTY", "STUDENT", "ALUMNI"]),
  departmentIds: z.array(z.string()).optional(),
});
export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;
