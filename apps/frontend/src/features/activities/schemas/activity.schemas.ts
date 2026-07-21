import { z } from "zod";

import { ActivityType, ActivityVisibility } from "@/types/enums";

const activityAttachmentSchema = z.object({
  name: z.string(),
  url: z.string().url("Enter a valid URL."),
  mimeType: z.string(),
});

const activityTypeEnum = z.nativeEnum(ActivityType);
const activityVisibilityEnum = z.nativeEnum(ActivityVisibility);

/** Mirrors CreateActivitySchema exactly */
export const createActivitySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title must be at most 150 characters."),
  description: z.string().max(3000, "Description must be at most 3000 characters."),
  type: activityTypeEnum,
  visibility: activityVisibilityEnum,
  points: z.coerce.number().min(0, "Points must be at least 0."),
  penaltyPoints: z.coerce.number().min(0, "Penalty points must be at least 0."),
  startDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid start date." }) }),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid end date." }) }),
  attachments: z.array(activityAttachmentSchema),
});

export type CreateActivityFormValues = z.infer<typeof createActivitySchema>;

/** Mirrors UpdateActivitySchema exactly — every field optional */
export const updateActivitySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(150, "Title must be at most 150 characters.")
    .optional(),
  description: z.string().max(3000, "Description must be at most 3000 characters.").optional(),
  type: activityTypeEnum.optional(),
  visibility: activityVisibilityEnum.optional(),
  points: z.coerce.number().min(0, "Points must be at least 0.").optional(),
  penaltyPoints: z.coerce.number().min(0, "Penalty points must be at least 0.").optional(),
  startDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid start date." }) })
    .optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid end date." }) }).optional(),
  attachments: z.array(activityAttachmentSchema).optional(),
});

export type UpdateActivityFormValues = z.infer<typeof updateActivitySchema>;
