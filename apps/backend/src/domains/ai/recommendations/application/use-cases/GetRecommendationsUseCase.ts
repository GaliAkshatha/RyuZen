import { RecommendationType } from "../../domain/constants/RecommendationType.js";

import { IRecommendationProvider } from "../ports/IRecommendationProvider.js";

import { RecommendationCandidate } from "../ports/RecommendationCandidate.js";

import { RecommendationsResponseDto } from "../dto/RecommendationsResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    IActivityRepository,
} from "../../../../academic/activities/infrastructure/repositories/IActivityRepository.js";

import { ActivityStatus } from "../../../../academic/activities/domain/constants/ActivityStatus.js";

import {
    ISubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/ISubmissionRepository.js";

import {
    IEventRepository,
} from "../../../../campus/events/infrastructure/repositories/IEventRepository.js";

import { EventStatus } from "../../../../campus/events/domain/constants/EventStatus.js";

import {
    IEventRegistrationRepository,
} from "../../../../campus/events/infrastructure/repositories/IEventRegistrationRepository.js";

import {
    IClubRepository,
} from "../../../../campus/clubs/infrastructure/repositories/IClubRepository.js";

import { ClubStatus } from "../../../../campus/clubs/domain/constants/ClubStatus.js";

import {
    IClubMemberRepository,
} from "../../../../campus/clubs/infrastructure/repositories/IClubMemberRepository.js";

const MAX_PER_CATEGORY = 5;

export class GetRecommendationsUseCase {

    constructor(

        private readonly provider: IRecommendationProvider,

        private readonly studentRepository: IStudentRepository,

        private readonly activityRepository: IActivityRepository,

        private readonly submissionRepository: ISubmissionRepository,

        private readonly eventRepository: IEventRepository,

        private readonly eventRegistrationRepository: IEventRegistrationRepository,

        private readonly clubRepository: IClubRepository,

        private readonly clubMemberRepository: IClubMemberRepository

    ) {}

    async execute(

        organizationId: string,

        userId: string

    ): Promise<RecommendationsResponseDto> {

        const candidates: RecommendationCandidate[] = [];

        const [

            publishedActivities,

            submittedByUser

        ] = await Promise.all([

            this.activityRepository.findAll({

                organizationId,

                status: ActivityStatus.PUBLISHED

            }),

            this.submissionRepository.findAll({

                organizationId,

                submittedBy: userId

            })

        ]);

        const submittedActivityIds =

            new Set(

                submittedByUser.map(

                    submission => submission.activityId

                )

            );

        publishedActivities

            .filter(

                activity =>
                    !submittedActivityIds.has(activity.id!)

            )

            .slice(0, MAX_PER_CATEGORY)

            .forEach(

                activity => {

                    candidates.push({

                        type:
                            RecommendationType.ACTIVITY,

                        id:
                            activity.id!,

                        title:
                            activity.title

                    });

                }

            );

        const student =

            await this.studentRepository.findByUserId(
                userId
            );

        if (student) {

            const [

                publishedEvents,

                registeredByStudent,

                activeClubs,

                joinedByStudent

            ] = await Promise.all([

                this.eventRepository.findByOrganization(

                    organizationId,

                    {

                        status: EventStatus.PUBLISHED

                    }

                ),

                this.eventRegistrationRepository.findByStudent(
                    student.id!
                ),

                this.clubRepository.findByOrganization(
                    organizationId
                ),

                this.clubMemberRepository.findByStudent(
                    student.id!
                )

            ]);

            const registeredEventIds =

                new Set(

                    registeredByStudent.map(

                        registration => registration.eventId

                    )

                );

            publishedEvents

                .filter(

                    event =>
                        !registeredEventIds.has(event.id!)

                )

                .slice(0, MAX_PER_CATEGORY)

                .forEach(

                    event => {

                        candidates.push({

                            type:
                                RecommendationType.EVENT,

                            id:
                                event.id!,

                            title:
                                event.title

                        });

                    }

                );

            const joinedClubIds =

                new Set(

                    joinedByStudent.map(

                        member => member.clubId

                    )

                );

            activeClubs

                .filter(

                    club =>
                        club.status === ClubStatus.ACTIVE &&
                        !joinedClubIds.has(club.id!)

                )

                .slice(0, MAX_PER_CATEGORY)

                .forEach(

                    club => {

                        candidates.push({

                            type:
                                RecommendationType.CLUB,

                            id:
                                club.id!,

                            title:
                                club.name

                        });

                    }

                );

        }

        const recommendations =

            await this.provider.annotate(

                candidates

            );

        return {

            recommendations

        };

    }

}
