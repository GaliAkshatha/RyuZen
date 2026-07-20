import { z } from "zod";

import { SkillLevel } from "@/types/enums";

/** Mirrors CreateSkillSchema exactly */
export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required.")
    .max(100, "Skill name must be at most 100 characters."),
  category: z.string().trim().max(100, "Category must be at most 100 characters.").optional(),
  level: z.nativeEnum(SkillLevel).optional(),
});

export type CreateSkillFormValues = z.infer<typeof createSkillSchema>;

/** Mirrors UpdateSkillSchema exactly — every field optional */
export const updateSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Skill name is required.")
    .max(100, "Skill name must be at most 100 characters.")
    .optional(),
  category: z.string().trim().max(100, "Category must be at most 100 characters.").optional(),
  level: z.nativeEnum(SkillLevel).optional(),
});

export type UpdateSkillFormValues = z.infer<typeof updateSkillSchema>;
