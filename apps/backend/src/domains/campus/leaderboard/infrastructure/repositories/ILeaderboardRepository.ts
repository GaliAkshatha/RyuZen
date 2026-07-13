import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry.js";

export interface ILeaderboardRepository {

    findByOrganization(
        organizationId: string
    ): Promise<LeaderboardEntry[]>;

    findByStudentId(
        organizationId: string,
        studentId: string
    ): Promise<LeaderboardEntry | null>;

    upsert(
        entry: LeaderboardEntry
    ): Promise<LeaderboardEntry>;

    reRank(
        organizationId: string
    ): Promise<LeaderboardEntry[]>;

}
