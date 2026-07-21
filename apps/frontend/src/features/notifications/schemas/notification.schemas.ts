import { z } from "zod";

import { NotificationAudience, NotificationType } from "@/types/enums";

/** Mirrors SendNotificationSchema exactly */
export const sendNotificationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters."),
  message: z
    .string()
    .trim()
    .min(1, "Message is required.")
    .max(2000, "Message must be at most 2000 characters."),
  type: z
    .enum([
      NotificationType.ANNOUNCEMENT,
      NotificationType.ALERT,
      NotificationType.INFO,
      NotificationType.REMINDER,
    ])
    .optional(),
  targetAudience: z
    .enum([
      NotificationAudience.ALL,
      NotificationAudience.ORG_ADMIN,
      NotificationAudience.FACULTY,
      NotificationAudience.STUDENT,
      NotificationAudience.ALUMNI,
    ])
    .optional(),
});

export type SendNotificationFormValues = z.infer<typeof sendNotificationSchema>;
