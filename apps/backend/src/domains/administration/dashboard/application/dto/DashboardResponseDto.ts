import { PlacementAnalyticsResponseDto } from "../../../../placements/analytics/application/dto/PlacementAnalyticsResponseDto.js";

export interface DashboardUserCounts {

    total: number;

    students: number;

    faculty: number;

    alumni: number;

    orgAdmins: number;

}

export interface DashboardActivityCounts {

    total: number;

    published: number;

    pendingReviews: number;

}

export interface DashboardEventCounts {

    total: number;

    published: number;

}

export interface DashboardAiUsage {

    /** Count of distinct AI Chat conversations started - not message count, kept simple and honest. */
    chatConversations: number;

    /** Count of Mock Interview sessions started. */
    mockInterviews: number;

}

export interface DashboardTrendPoint {

    /** "2026-W04" for a week, "2026-07" for a month. */
    period: string;

    points: number;

}

export interface DashboardDepartmentStat {

    departmentId: string;

    departmentName: string;

    studentCount: number;

    averagePoints: number;

}

export interface DashboardResponseDto {

    users: DashboardUserCounts;

    departments: number;

    activities: DashboardActivityCounts;

    clubs: number;

    events: DashboardEventCounts;

    placements: PlacementAnalyticsResponseDto;

    /** Students with a real login (User.auth.lastLogin) within the last 7 days. */
    activeStudents: number;

    /** % of students with a real login within the last 30 days - a genuinely different, longer-window signal than activeStudents. */
    studentEngagementPercent: number;

    /** Sum of totalPoints across every real Leaderboard entry in the organization. */
    xpEarned: number;

    /** Count of real APPROVED submissions. */
    activitiesCompleted: number;

    /** Count of real Certificate records issued to this organization's students. */
    certificatesEarned: number;

    /**
     * Only Chat and Mock Interview are counted - Resume Review, Career
     * Score, and Recommendations are ephemeral (computed fresh on
     * every request, never persisted), confirmed by checking each
     * domain's infrastructure layer directly. Fabricating usage counts
     * for those would misrepresent data that doesn't exist.
     */
    aiUsage: DashboardAiUsage;

    /** Last 8 weeks of real point-ledger activity, oldest first. */
    weeklyTrend: DashboardTrendPoint[];

    /** Last 6 months of real point-ledger activity, oldest first. */
    monthlyTrend: DashboardTrendPoint[];

    /** Every department with at least one student, sorted by average points descending. */
    departmentComparison: DashboardDepartmentStat[];

}
