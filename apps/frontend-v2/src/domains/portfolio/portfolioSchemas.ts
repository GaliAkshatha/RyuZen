import { z } from "zod";

/** Mirrors the real backend UpdateUserPortfolioSchema exactly - real URL format validation on every social link, matching the backend precisely. Empty strings are allowed through as "not provided" at the form boundary since a URL field left blank shouldn't fail url() validation. */
const optionalUrl = (label: string) =>
  z.string().trim().url(`Invalid ${label} URL.`).optional().or(z.literal(""));

export const updatePortfolioSettingsSchema = z.object({
  headline: z.string().trim().max(200).optional(),
  summary: z.string().trim().max(2000).optional(),
  github: optionalUrl("GitHub"),
  linkedin: optionalUrl("LinkedIn"),
  leetcode: optionalUrl("LeetCode"),
  codeforces: optionalUrl("Codeforces"),
  portfolio: optionalUrl("portfolio"),
  behance: optionalUrl("Behance"),
  dribbble: optionalUrl("Dribbble"),
  website: optionalUrl("website"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});
export type UpdatePortfolioSettingsFormValues = z.infer<typeof updatePortfolioSettingsSchema>;
