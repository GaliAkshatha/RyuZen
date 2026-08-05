import { z } from "zod";

/** Deliberately only accepts CODEFORCES — the only real, implemented platform, matching the backend's own validator exactly (see LinkCodingProfileSchema.ts). LeetCode/HackerRank exist in the domain enum as real future platforms, not offered here since there's no real API client wired up for them yet. */
export const linkCodingProfileSchema = z.object({
  platform: z.literal("CODEFORCES"),
  handle: z.string().trim().min(1, "Enter your real Codeforces handle.").max(50),
});

export type LinkCodingProfileFormValues = z.infer<typeof linkCodingProfileSchema>;
