import { DashboardResponseDto } from "../dto/DashboardResponseDto.js";

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

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

const DASHBOARD_CACHE_TTL_SECONDS = 60;

export class GetDashboardUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly departmentRepository: IDepartmentRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly submissionRepository: ISubmissionRepository,

        private readonly clubRepository: IClubRepository,

        private readonly eventRepository: IEventRepository,

        private readonly placementAnalyticsUseCase: GetPlacementAnalyticsUseCase,

        private readonly cacheService: ICacheService

    ) {}

    async execute(

        organizationId: string

    ): Promise<DashboardResponseDto> {

        const cacheKey =

            `dashboard:${organizationId}`;

        const cached =

            await this.cacheService.get<DashboardResponseDto>(
                cacheKey
            );

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

            placements

        ] = await Promise.all([

            this.userRepository.findByOrganization(
                organizationId
            ),

            this.departmentRepository.findByOrganization(
                organizationId
            ),

            this.activityRepository.findAll({

                organizationId

            }),

            this.submissionRepository.findAll({

                organizationId

            }),

            this.clubRepository.findByOrganization(
                organizationId
            ),

            this.eventRepository.findByOrganization(

                organizationId,

                {}

            ),

            this.placementAnalyticsUseCase.execute(
                organizationId
            )

        ]);

        const dashboard: DashboardResponseDto = {

            users: {

                total:
                    users.length,

                students:
                    users.filter(
                        user => user.role === UserRole.STUDENT
                    ).length,

                faculty:
                    users.filter(
                        user => user.role === UserRole.FACULTY
                    ).length,

                alumni:
                    users.filter(
                        user => user.role === UserRole.ALUMNI
                    ).length,

                orgAdmins:
                    users.filter(
                        user => user.role === UserRole.ORG_ADMIN
                    ).length

            },

            departments:
                departments.length,

            activities: {

                total:
                    activities.length,

                published:
                    activities.filter(
                        activity => activity.status === ActivityStatus.PUBLISHED
                    ).length,

                pendingReviews:
                    submissions.filter(

                        submission =>
                            submission.status === SubmissionStatus.PENDING ||
                            submission.status === SubmissionStatus.UNDER_REVIEW ||
                            submission.status === SubmissionStatus.RESUBMITTED

                    ).length

            },

            clubs:
                clubs.length,

            events: {

                total:
                    events.length,

                published:
                    events.filter(
                        event => event.status === EventStatus.PUBLISHED
                    ).length

            },

            placements

        };

        await this.cacheService.set(

            cacheKey,

            dashboard,

            DASHBOARD_CACHE_TTL_SECONDS

        );

        return dashboard;

    }

}
