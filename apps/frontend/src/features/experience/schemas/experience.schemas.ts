import { z } from "zod";

import { EmploymentType } from "@/types/enums";

const employmentTypeEnum = z.nativeEnum(EmploymentType);

/** Mirrors CreateExperienceSchema exactly */
export const createExperienceSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company is required.")
    .max(150, "Company must be at most 150 characters."),
  role: z
    .string()
    .trim()
    .min(1, "Role is required.")
    .max(150, "Role must be at most 150 characters."),
  employmentType: employmentTypeEnum.optional(),
  location: z.string().trim().max(150, "Location must be at most 150 characters.").optional(),
  startDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid start date." }) }),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid end date." }) }).optional(),
  currentlyWorking: z.boolean().optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  skills: z.array(z.string().trim()).optional(),
});

export type CreateExperienceFormValues = z.infer<typeof createExperienceSchema>;

/** Mirrors UpdateExperienceSchema exactly — every field optional */
export const updateExperienceSchema = z.object({
  company: z
    .string()
    .trim()
    .min(1, "Company is required.")
    .max(150, "Company must be at most 150 characters.")
    .optional(),
  role: z
    .string()
    .trim()
    .min(1, "Role is required.")
    .max(150, "Role must be at most 150 characters.")
    .optional(),
  employmentType: employmentTypeEnum.optional(),
  location: z.string().trim().max(150, "Location must be at most 150 characters.").optional(),
  startDate: z.coerce
    .date({ errorMap: () => ({ message: "Enter a valid start date." }) })
    .optional(),
  endDate: z.coerce.date({ errorMap: () => ({ message: "Enter a valid end date." }) }).optional(),
  currentlyWorking: z.boolean().optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  skills: z.array(z.string().trim()).optional(),
});

export type UpdateExperienceFormValues = z.infer<typeof updateExperienceSchema>;
