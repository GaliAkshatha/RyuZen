import { CodingProfile } from "../../domain/entities/CodingProfile.js";
import { CodingPlatform } from "../../domain/constants/CodingPlatform.js";

import { CodingProfileDocument } from "../persistence/CodingProfileModel.js";

export class CodingProfileMapper {

    static toDomain(document: CodingProfileDocument): CodingProfile {

        return CodingProfile.create({

            id: document.id,
            organizationId: document.organizationId.toString(),
            studentId: document.studentId.toString(),
            platform: document.platform as CodingPlatform,
            handle: document.handle,
            verified: document.verified,
            currentRating: document.currentRating,
            maxRating: document.maxRating,
            rank: document.rank,
            problemsSolved: document.problemsSolved,
            lastSyncedAt: document.lastSyncedAt,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt

        });

    }

    static toPersistence(profile: CodingProfile) {

        const data = profile.toObject();

        return {
            organizationId: data.organizationId,
            studentId: data.studentId,
            platform: data.platform,
            handle: data.handle,
            verified: data.verified,
            currentRating: data.currentRating,
            maxRating: data.maxRating,
            rank: data.rank,
            problemsSolved: data.problemsSolved,
            lastSyncedAt: data.lastSyncedAt
        };

    }

}
