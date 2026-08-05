import { ICodingProfileRepository } from "../../infrastructure/repositories/ICodingProfileRepository.js";
import { ICodingPlatformApiClient } from "../ports/ICodingPlatformApiClient.js";

import { CodingProfileResponseMapper } from "../../infrastructure/mappers/CodingProfileResponseMapper.js";
import { CodingProfileResponseDto } from "../dto/CodingProfileResponseDto.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Re-fetches real, fresh stats from the real platform API and
 * overwrites the stored ones entirely - never merges or trusts the
 * old values. A growth event fires only when problemsSolved genuinely
 * INCREASED since the last sync (real, measurable progress a human
 * can verify by checking the same public profile) - a sync that finds
 * no real change, or a rating that simply fluctuates, emits nothing.
 * This mirrors the same "only genuine positive progress counts"
 * discipline used for every other Growth Profile integration.
 */
export class SyncCodingProfileUseCase {

    constructor(

        private readonly repository: ICodingProfileRepository,

        private readonly apiClient: ICodingPlatformApiClient,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase

    ) {}

    async execute(

        profileId: string

    ): Promise<CodingProfileResponseDto> {

        const profile =

            await this.repository.findById(
                profileId
            );

        if (!profile) {

            throw new ApiError(

                "Coding profile not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const stats =

            await this.apiClient.fetchStats(
                profile.handle
            );

        if (!stats.exists) {

            throw new ApiError(

                `The real ${profile.platform} handle "${profile.handle}" could no longer be found.`,

                HttpStatus.BAD_REQUEST

            );

        }

        const previousSolved =
            profile.problemsSolved ?? 0;

        profile.applySyncedStats({

            currentRating: stats.currentRating,

            maxRating: stats.maxRating,

            rank: stats.rank,

            problemsSolved: stats.problemsSolved

        });

        const updated =

            await this.repository.save(
                profile
            );

        const newSolved =
            stats.problemsSolved ?? 0;

        if (newSolved > previousSolved) {

            await this.recordGrowthEvent.execute({

                organizationId: profile.organizationId,

                studentId: profile.studentId,

                domain: "career",

                eventType: `CODING_PROBLEMS_SOLVED_${profile.platform}`,

                evidence: { entityType: "CodingProfile", entityId: updated.id! },

                verifiedBy: "system",

                contributionWeight: newSolved - previousSolved

            }).catch(() => {
                // Growth Profile recording must never break a real, already-completed sync.
            });

        }

        return CodingProfileResponseMapper.toDto(

            updated

        );

    }

}
