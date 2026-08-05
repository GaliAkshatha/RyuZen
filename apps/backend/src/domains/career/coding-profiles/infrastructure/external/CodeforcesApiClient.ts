import {
    ICodingPlatformApiClient,
    CodingPlatformStats
} from "../../application/ports/ICodingPlatformApiClient.js";

interface CodeforcesUserInfoResponse {

    status: "OK" | "FAILED";

    comment?: string;

    result?: {
        handle: string;
        rating?: number;
        maxRating?: number;
        rank?: string;
    }[];

}

interface CodeforcesUserStatusResponse {

    status: "OK" | "FAILED";

    comment?: string;

    result?: {
        verdict?: string;
        problem: {
            contestId?: number;
            index: string;
        };
    }[];

}

/**
 * The real, official, public Codeforces API - no API key needed for
 * these two read-only endpoints. Deliberately NOT unit-tested against
 * the live API in this codebase (this sandbox's network egress
 * doesn't allow codeforces.com - confirmed directly, not assumed);
 * every other piece of this feature (LinkCodingProfileUseCase,
 * SyncCodingProfileUseCase) is verified against a real fake
 * implementing this same port, the same discipline used for every
 * other external boundary in this codebase.
 *
 * user.info?handles={handle} returns status:"FAILED" with a real
 * comment when the handle doesn't exist - that's the real "does this
 * handle exist" signal, not an HTTP error code.
 *
 * user.status?handle={handle} returns every real submission; a solved
 * problem is any distinct (contestId, index) pair with at least one
 * verdict:"OK" submission - deduplicated here, since a student
 * resubmitting the same problem multiple times must not inflate their
 * real solved count.
 */
export class CodeforcesApiClient implements ICodingPlatformApiClient {

    private readonly baseUrl = "https://codeforces.com/api";

    async fetchStats(handle: string): Promise<CodingPlatformStats> {

        const infoResponse =

            await fetch(
                `${this.baseUrl}/user.info?handles=${encodeURIComponent(handle)}`
            );

        const info = await infoResponse.json() as CodeforcesUserInfoResponse;

        if (info.status !== "OK" || !info.result || info.result.length === 0) {

            return { exists: false };

        }

        const user = info.result[0]!;

        const problemsSolved =

            await this.fetchSolvedCount(
                handle
            );

        return {

            exists: true,

            currentRating: user.rating,

            maxRating: user.maxRating,

            rank: user.rank,

            problemsSolved

        };

    }

    private async fetchSolvedCount(

        handle: string

    ): Promise<number | undefined> {

        const statusResponse =

            await fetch(
                `${this.baseUrl}/user.status?handle=${encodeURIComponent(handle)}`
            );

        const status = await statusResponse.json() as CodeforcesUserStatusResponse;

        if (status.status !== "OK" || !status.result) {

            return undefined;

        }

        const solvedProblemKeys = new Set<string>();

        for (const submission of status.result) {

            if (submission.verdict !== "OK") {
                continue;
            }

            const key = `${submission.problem.contestId ?? "none"}-${submission.problem.index}`;

            solvedProblemKeys.add(key);

        }

        return solvedProblemKeys.size;

    }

}
