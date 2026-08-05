import { CodingProfile } from "../../domain/entities/CodingProfile.js";

import { CodingProfileResponseDto } from "../../application/dto/CodingProfileResponseDto.js";

export class CodingProfileResponseMapper {

    static toDto(profile: CodingProfile): CodingProfileResponseDto {

        return {
            id: profile.id!,
            platform: profile.platform,
            handle: profile.handle,
            verified: profile.verified,
            currentRating: profile.currentRating,
            maxRating: profile.maxRating,
            rank: profile.rank,
            problemsSolved: profile.problemsSolved,
            lastSyncedAt: profile.lastSyncedAt
        };

    }

}
