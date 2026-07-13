export interface ILeaderboardEntry {

    id?: string;

    organizationId: string;

    studentId: string;

    activityPoints: number;

    clubPoints: number;

    eventPoints: number;

    placementPoints: number;

    totalPoints: number;

    rank: number;

    createdAt?: Date;

    updatedAt?: Date;

}
