import { DashboardResponseDto, DashboardTrendPoint, DashboardDepartmentStat } from "../dto/DashboardResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    IDepartmentRepository,
} from "../../../../academic/departments/infrastructure/repositories/IDepartmentRepository.js";

import {
    IActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/IActivityRepository.js";

import { ActivityStatus } from "../../../../academic/activities/domain/constants/ActivityStatus.js";

import {
    ISubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/ISubmissionRepository.js";

import { SubmissionStatus } from "../../../../academic/submissions/domain/constants/SubmissionStatus.js";

import {
    IClubRepository,
} from "../../../../campus/clubs/infrastructure/repositories/IClubRepository.js";

import {
    IEventRepository,
} from "../../../../campus/events/infrastructure/repositories/IEventRepository.js";

import { EventStatus } from "../../../../campus/events/domain/constants/EventStatus.js";

import {
    GetPlacementAnalyticsUseCase,
} from "../../../../placements/analytics/application/use-cases/GetPlacementAnalyticsUseCase.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    ILeaderboardRepository,
} from "../../../../campus/leaderboard/infrastructure/repositories/ILeaderboardRepository.js";

import {
    ICertificateRepository,
} from "../../../../campus/certificates/infrastructure/repositories/ICertificateRepository.js";

import {
    IPointLedgerRepository,
} from "../../../../campus/point-ledger/infrastructure/repositories/IPointLedgerRepository.js";

import {
    IAIChatRepository,
} from "../../../../ai/chat/infrastructure/repositories/IAIChatRepository.js";

import {
    IMockInterviewSessionRepository,
} from "../../../../ai/interview/infrastructure/repositories/IMockInterviewSessionRepository.js";

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

const DASHBOARD_CACHE_TTL_SECONDS = 60;

const ACTIVE_WINDOW_DAYS = 7;
const ENGAGEMENT_WINDOW_DAYS = 30;
const WEEKLY_TREND_WEEKS = 8;
const MONTHLY_TREND_MONTHS = 6;

function daysAgo(days: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

function isoWeekKey(date: Date): string {
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = (target.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNumber + 3);
    const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
    const week =
        1 +
        Math.round(
            ((target.getTime() - firstThursday.getTime()) / 86400000 -
                3 +
                ((firstThursday.getUTCDay() + 6) % 7)) /
                7
        );
    return `${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function monthKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function buildTrend(
    entries: { timestamp: Date; points: number }[],
    count: number,
    keyOf: (date: Date) => string,
    stepBack: (date: Date, i: number) => Date
): DashboardTrendPoint[] {

    const totals = new Map<string, number>();

    for (const entry of entries) {
        const key = keyOf(entry.timestamp);
        totals.set(key, (totals.get(key) ?? 0) + entry.points);
    }

    const periods: DashboardTrendPoint[] = [];

    for (let i = count - 1; i >= 0; i--) {
        const date = stepBack(new Date(), i);
        const key = keyOf(date);
        periods.push({ period: key, points: totals.get(key) ?? 0 });
    }

    return periods;

}

export class GetDashboardUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly departmentRepository: IDepartmentRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly submissionRepository: ISubmissionRepository,

        private readonly clubRepository: IClubRepository,

        private readonly eventRepository: IEventRepository,

        private readonly placementAnalyticsUseCase: GetPlacementAnalyticsUseCase,

        private readonly studentRepository: IStudentRepository,

        private readonly leaderboardRepository: ILeaderboardRepository,

        private readonly certificateRepository: ICertificateRepository,

        private readonly pointLedgerRepository: IPointLedgerRepository,

        private readonly aiChatRepository: IAIChatRepository,

        private readonly mockInterviewSessionRepository: IMockInterviewSessionRepository,

        private readonly cacheService: ICacheService

    ) {}

    async execute(

        organizationId: string

    ): Promise<DashboardResponseDto> {

        const cacheKey =
            `dashboard:${organizationId}`;

        const cached =
            await this.cacheService.get<DashboardResponseDto>(cacheKey);

        if (cached) {
            return cached;
        }

        const [
            users,
            departments,
            activities,
            submissions,
            clubs,
            events,
            placements,
            students,
            leaderboardEntries,
            pointLedgerEntries
        ] = await Promise.all([

            this.userRepository.findByOrganization(organizationId),
            this.departmentRepository.findByOrganization(organizationId),
            this.activityRepository.findAll({ organizationId }),
            this.submissionRepository.findAll({ organizationId }),
            this.clubRepository.findByOrganization(organizationId),
            this.eventRepository.findByOrganization(organizationId, {}),
            this.placementAnalyticsUseCase.execute(organizationId),
            this.studentRepository.findByOrganization(organizationId, {}),
            this.leaderboardRepository.findByOrganization(organizationId),
            this.pointLedgerRepository.findAllForOrganization(organizationId)

        ]);

        const studentUserIds =
            users
                .filter(user => user.role === UserRole.STUDENT)
                .map(user => user.id!);

        const studentIds =
            students.map(student => student.id!);

        const [certificates, chatConversations, mockInterviews] = await Promise.all([

            this.certificateRepository.findByStudentIds(studentIds),
            this.aiChatRepository.countByUserIds(studentUserIds),
            this.mockInterviewSessionRepository.countByUserIds(studentUserIds)

        ]);

        const studentUsers =
            users.filter(user => user.role === UserRole.STUDENT);

        const activeStudents =
            studentUsers.filter(
                user => user.auth.lastLogin && user.auth.lastLogin >= daysAgo(ACTIVE_WINDOW_DAYS)
            ).length;

        const engagedStudents =
            studentUsers.filter(
                user => user.auth.lastLogin && user.auth.lastLogin >= daysAgo(ENGAGEMENT_WINDOW_DAYS)
            ).length;

        const studentEngagementPercent =
            studentUsers.length > 0
                ? Math.round((engagedStudents / studentUsers.length) * 100)
                : 0;

        const xpEarned =
            leaderboardEntries.reduce((sum, entry) => sum + entry.totalPoints, 0);

        const activitiesCompleted =
            submissions.filter(
                submission => submission.status === SubmissionStatus.APPROVED
            ).length;

        const ledgerForTrends =
            pointLedgerEntries.map(entry => ({ timestamp: entry.timestamp, points: entry.points }));

        const weeklyTrend =
            buildTrend(
                ledgerForTrends,
                WEEKLY_TREND_WEEKS,
                isoWeekKey,
                (date, i) => {
                    const d = new Date(date);
                    d.setDate(d.getDate() - i * 7);
                    return d;
                }
            );

        const monthlyTrend =
            buildTrend(
                ledgerForTrends,
                MONTHLY_TREND_MONTHS,
                monthKey,
                (date, i) => {
                    const d = new Date(date);
                    d.setMonth(d.getMonth() - i);
                    return d;
                }
            );

        const pointsByStudentId =
            new Map(leaderboardEntries.map(entry => [entry.studentId, entry.totalPoints]));

        const departmentGroups = new Map<string, { name: string; studentCount: number; totalPoints: number }>();

        for (const student of students) {

            if (!student.departmentId) continue;

            const department = departments.find(d => d.id === student.departmentId);
            if (!department) continue;

            const group =
                departmentGroups.get(student.departmentId) ??
                { name: department.name, studentCount: 0, totalPoints: 0 };

            group.studentCount += 1;
            group.totalPoints += pointsByStudentId.get(student.id!) ?? 0;

            departmentGroups.set(student.departmentId, group);

        }

        const departmentComparison: DashboardDepartmentStat[] =
            [...departmentGroups.entries()]
                .map(([departmentId, group]) => ({
                    departmentId,
                    departmentName: group.name,
                    studentCount: group.studentCount,
                    averagePoints:
                        group.studentCount > 0
                            ? Math.round(group.totalPoints / group.studentCount)
                            : 0
                }))
                .sort((a, b) => b.averagePoints - a.averagePoints);

        const dashboard: DashboardResponseDto = {

            users: {

                total: users.length,
                students: studentUsers.length,
                faculty: users.filter(user => user.role === UserRole.FACULTY).length,
                alumni: users.filter(user => user.role === UserRole.ALUMNI).length,
                orgAdmins: users.filter(user => user.role === UserRole.ORG_ADMIN).length

            },

            departments: departments.length,

            activities: {

                total: activities.length,
                published: activities.filter(activity => activity.status === ActivityStatus.PUBLISHED).length,
                pendingReviews: submissions.filter(
                    submission =>
                        submission.status === SubmissionStatus.PENDING ||
                        submission.status === SubmissionStatus.UNDER_REVIEW ||
                        submission.status === SubmissionStatus.RESUBMITTED
                ).length

            },

            clubs: clubs.length,

            events: {

                total: events.length,
                published: events.filter(event => event.status === EventStatus.PUBLISHED).length

            },

            placements,

            activeStudents,

            studentEngagementPercent,

            xpEarned,

            activitiesCompleted,

            certificatesEarned: certificates.length,

            aiUsage: {
                chatConversations,
                mockInterviews
            },

            weeklyTrend,

            monthlyTrend,

            departmentComparison

        };

        await this.cacheService.set(cacheKey, dashboard, DASHBOARD_CACHE_TTL_SECONDS);

        return dashboard;

    }

}
