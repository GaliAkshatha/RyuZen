import { z } from "zod";

import { ResumeVisibility } from "@/types/enums";

/** Mirrors GenerateResumeSchema exactly */
export const generateResumeSchema = z.object({
  selectedTemplate: z.string().trim().min(1, "A resume template must be selected."),
  resumeUrl: z.string().trim().url("A valid resume file URL is required."),
});

export type GenerateResumeFormValues = z.infer<typeof generateResumeSchema>;

/** Mirrors UpdateResumeVisibilitySchema exactly */
export const updateResumeVisibilitySchema = z.object({
  visibility: z.nativeEnum(ResumeVisibility),
});

export type UpdateResumeVisibilityFormValues = z.infer<typeof updateResumeVisibilitySchema>;

/** Mirrors CreateResumeTemplateSchema exactly */
export const createResumeTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters."),
  thumbnail: z.string().trim().url("Invalid thumbnail URL.").optional(),
  templateFile: z.string().trim().url("Invalid template file URL.").optional(),
  premium: z.boolean().optional(),
});

export type CreateResumeTemplateFormValues = z.infer<typeof createResumeTemplateSchema>;

/** Mirrors UpdateResumeTemplateSchema exactly — every field optional */
export const updateResumeTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be at most 100 characters.")
    .optional(),
  thumbnail: z.string().trim().url("Invalid thumbnail URL.").optional(),
  templateFile: z.string().trim().url("Invalid template file URL.").optional(),
  premium: z.boolean().optional(),
});

export type UpdateResumeTemplateFormValues = z.infer<typeof updateResumeTemplateSchema>;
