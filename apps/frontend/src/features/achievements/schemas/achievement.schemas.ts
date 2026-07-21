import { z } from "zod";

import { AchievementLevel } from "@/types/enums";

const achievementLevelEnum = z.nativeEnum(AchievementLevel);

/** Mirrors CreateAchievementSchema exactly */
export const createAchievementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters."),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  category: z.string().trim().max(100, "Category must be at most 100 characters.").optional(),
  level: achievementLevelEnum.optional(),
  position: z.string().trim().max(100, "Position must be at most 100 characters.").optional(),
  certificateUrl: z.string().trim().url("Invalid certificate URL.").optional(),
  proofUrl: z.string().trim().url("Invalid proof URL.").optional(),
  achievementDate: z.coerce.date({
    errorMap: () => ({ message: "Enter a valid achievement date." }),
  }),
});

export type CreateAchievementFormValues = z.infer<typeof createAchievementSchema>;

/** Mirrors UpdateAchievementSchema exactly — every field optional */
export const updateAchievementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be at most 200 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  category: z.string().trim().max(100, "Category must be at most 100 characters.").optional(),
  level: achievementLevelEnum.optional(),
  position: z.string().trim().max(100, "Position must be at most 100 characters.").optional(),
  certificateUrl: z.string().trim().url("Invalid certificate URL.").optional(),
  proofUrl: z.string().trim().url("Invalid proof URL.").optional(),
  achievementDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid achievement date." }) })
    .optional(),
});

export type UpdateAchievementFormValues = z.infer<typeof updateAchievementSchema>;
