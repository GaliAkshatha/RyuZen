import { z } from "zod";

import { NotificationType } from "../../domain/constants/NotificationType.js";
import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";

export const SendNotificationSchema = z.object({

    title: z.string()

        .trim()

        .min(1, "Title is required.")

        .max(200),

    message: z.string()

        .trim()

        .min(1, "Message is required.")

        .max(2000),

    type: z.enum([

        NotificationType.ANNOUNCEMENT,

        NotificationType.ALERT,

        NotificationType.INFO,

        NotificationType.REMINDER

    ])

        .optional(),

    targetAudience: z.enum([

        NotificationAudience.ALL,

        NotificationAudience.ORG_ADMIN,

        NotificationAudience.FACULTY,

        NotificationAudience.STUDENT,

        NotificationAudience.ALUMNI

    ])

        .optional()

});
