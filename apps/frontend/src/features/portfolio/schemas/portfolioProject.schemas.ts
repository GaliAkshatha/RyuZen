import { z } from "zod";

/** Mirrors CreatePortfolioProjectSchema exactly */
export const createPortfolioProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be at most 150 characters."),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  techStack: z.array(z.string().trim()).optional(),
  github: z.string().trim().url("Invalid GitHub URL.").optional(),
  liveDemo: z.string().trim().url("Invalid live demo URL.").optional(),
  images: z.array(z.string().trim().url("Invalid image URL.")).optional(),
  video: z.string().trim().url("Invalid video URL.").optional(),
  featured: z.boolean().optional(),
});

export type CreatePortfolioProjectFormValues = z.infer<typeof createPortfolioProjectSchema>;

/** Mirrors UpdatePortfolioProjectSchema exactly — every field optional */
export const updatePortfolioProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must be at most 150 characters.")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be at most 2000 characters.")
    .optional(),
  techStack: z.array(z.string().trim()).optional(),
  github: z.string().trim().url("Invalid GitHub URL.").optional(),
  liveDemo: z.string().trim().url("Invalid live demo URL.").optional(),
  images: z.array(z.string().trim().url("Invalid image URL.")).optional(),
  video: z.string().trim().url("Invalid video URL.").optional(),
  featured: z.boolean().optional(),
});

export type UpdatePortfolioProjectFormValues = z.infer<typeof updatePortfolioProjectSchema>;
