import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry.js";

import { LeaderboardEntryResponseDto } from "../../application/dto/LeaderboardEntryResponseDto.js";

export class LeaderboardEntryResponseMapper {

    static toDto(

        entry: LeaderboardEntry

    ): LeaderboardEntryResponseDto {

        return {

            id:
                entry.id!,

            organizationId:
                entry.organizationId,

            studentId:
                entry.studentId,

            activityPoints:
                entry.activityPoints,

            clubPoints:
                entry.clubPoints,

            eventPoints:
                entry.eventPoints,

            placementPoints:
                entry.placementPoints,

            totalPoints:
                entry.totalPoints,

            rank:
                entry.rank,

            createdAt:
                entry.createdAt,

            updatedAt:
                entry.updatedAt

        };

    }

}
