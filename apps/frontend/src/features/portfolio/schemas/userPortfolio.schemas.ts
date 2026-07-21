import { z } from "zod";

import { PortfolioVisibility } from "@/types/enums";

/** Mirrors UpdateUserPortfolioSchema exactly */
export const updateUserPortfolioSchema = z.object({
  headline: z.string().trim().max(200, "Headline must be at most 200 characters.").optional(),
  summary: z.string().trim().max(2000, "Summary must be at most 2000 characters.").optional(),
  github: z.string().trim().url("Invalid GitHub URL.").optional(),
  linkedin: z.string().trim().url("Invalid LinkedIn URL.").optional(),
  leetcode: z.string().trim().url("Invalid LeetCode URL.").optional(),
  codeforces: z.string().trim().url("Invalid Codeforces URL.").optional(),
  portfolio: z.string().trim().url("Invalid portfolio URL.").optional(),
  behance: z.string().trim().url("Invalid Behance URL.").optional(),
  dribbble: z.string().trim().url("Invalid Dribbble URL.").optional(),
  website: z.string().trim().url("Invalid website URL.").optional(),
  visibility: z.nativeEnum(PortfolioVisibility).optional(),
  theme: z.string().trim().max(50, "Theme must be at most 50 characters.").optional(),
});

export type UpdateUserPortfolioFormValues = z.infer<typeof updateUserPortfolioSchema>;
