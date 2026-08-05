export interface CodingPlatformStats {

    exists: boolean;

    currentRating?: number;

    maxRating?: number;

    rank?: string;

    problemsSolved?: number;

}

/**
 * One real port every platform implements the same way - the
 * application layer never knows which HTTP API is actually behind it.
 * `exists: false` is a real, distinct outcome from a network/API
 * error - LinkCodingProfileUseCase treats "handle genuinely doesn't
 * exist" (reject the link) very differently from "the platform's API
 * is temporarily unreachable" (a real ApiError, not a false rejection
 * of a genuinely valid handle).
 */
export interface ICodingPlatformApiClient {

    fetchStats(handle: string): Promise<CodingPlatformStats>;

}
