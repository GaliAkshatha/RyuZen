export type CodingPlatform = "CODEFORCES" | "LEETCODE" | "HACKERRANK";

/**
 * Mirrors CodingProfileResponseDto exactly. `verified` only ever
 * becomes true server-side, after LinkCodingProfileUseCase confirms
 * the real handle genuinely exists via the platform's real public
 * API - a student typing a handle is never treated as evidence on its
 * own. Every stat field is only ever written from a real synced API
 * response, never accepted directly from the student.
 */
export interface CodingProfileResponseDto {
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

export interface LinkCodingProfilePayload {
  platform: CodingPlatform;
  handle: string;
}
