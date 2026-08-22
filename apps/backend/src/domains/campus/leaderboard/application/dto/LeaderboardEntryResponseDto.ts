export interface LeaderboardEntryResponseDto {

    id: string;

    organizationId: string;

    studentId: string;

    /** Enriched server-side (GetLeaderboardUseCase) - the frontend
     * previously called the admin-only GET /students to resolve these,
     * which genuinely 403'd for every real student viewing their own
     * leaderboard. Real display data belongs in the response, not
     * behind a second, wrongly-scoped request. */
    studentName?: string;

    studentUsn?: string;

    /** Enriched server-side, same real pattern as studentName/studentUsn - closes a real gap: previously no field existed to filter a leaderboard view by department/batch at all, tenant isolation (organizationId) was the only real boundary. */
    departmentId?: string;

    batch?: string;

    activityPoints: number;

    clubPoints: number;

    eventPoints: number;

    placementPoints: number;

    totalPoints: number;

    rank: number;

    createdAt?: Date;

    updatedAt?: Date;

}
