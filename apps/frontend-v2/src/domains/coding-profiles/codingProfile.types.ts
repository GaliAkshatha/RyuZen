/**
 * Matches the real backend exactly. CODEFORCES is the only platform
 * actually linkable right now - confirmed directly against
 * LinkCodingProfileSchema, which only accepts CodingPlatform.CODEFORCES.
 * LEETCODE/HACKERRANK exist in the backend's enum as real future
 * platforms (documented there as such - no official stable public API
 * exists for either yet), not ones a student can link today.
 */
export const CodingPlatform = {
  CODEFORCES: "CODEFORCES",
} as const;
export type CodingPlatform = (typeof CodingPlatform)[keyof typeof CodingPlatform];

export interface CodingProfile {
  id: string;
  platform: CodingPlatform;
  handle: string;
  verified: boolean;
  currentRating?: number;
  maxRating?: number;
  rank?: string;
  problemsSolved?: number;
  lastSyncedAt?: string;
}

/** Matches LinkCodingProfileSchema exactly. */
export interface LinkCodingProfileRequest {
  platform: CodingPlatform;
  handle: string;
}
