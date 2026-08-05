import { CodingPlatform } from "../constants/CodingPlatform.js";

/**
 * "Results should be based only on verified institutional data, not
 * self-declared claims" - the same discipline the rest of Growth
 * Profile follows. A student typing a handle isn't evidence; `verified`
 * only becomes true once LinkCodingProfileUseCase confirms the real
 * handle actually exists via the platform's real public API. Every
 * stat field below (rating, problemsSolved, etc.) is only ever written
 * by SyncCodingProfileUseCase from a real API response - never
 * accepted directly from the student.
 */
export interface ICodingProfile {

    id?: string;

    organizationId: string;

    studentId: string;

    platform: CodingPlatform;

    handle: string;

    verified: boolean;

    currentRating?: number;

    maxRating?: number;

    rank?: string;

    problemsSolved?: number;

    lastSyncedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
