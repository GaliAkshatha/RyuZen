import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry.js";

import {
    LeaderboardEntryDocument
} from "../persistence/LeaderboardEntryModel.js";

export class LeaderboardEntryMapper {

    static toDomain(

        document: LeaderboardEntryDocument

    ): LeaderboardEntry {

        return LeaderboardEntry.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            studentId:
                document.studentId.toString(),

            activityPoints:
                document.activityPoints,

            clubPoints:
                document.clubPoints,

            eventPoints:
                document.eventPoints,

            placementPoints:
                document.placementPoints,

            totalPoints:
                document.totalPoints,

            rank:
                document.rank,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        entry: LeaderboardEntry

    ) {

        const data =
            entry.toObject();

        return {

            organizationId:
                data.organizationId,

            studentId:
                data.studentId,

            activityPoints:
                data.activityPoints,

            clubPoints:
                data.clubPoints,

            eventPoints:
                data.eventPoints,

            placementPoints:
                data.placementPoints,

            totalPoints:
                data.totalPoints,

            rank:
                data.rank

        };

    }

}
