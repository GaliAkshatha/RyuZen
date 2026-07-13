import { LeaderboardEntry } from "../../domain/entities/LeaderboardEntry.js";

import { ILeaderboardRepository } from "../../infrastructure/repositories/ILeaderboardRepository.js";

import { LeaderboardEntryResponseMapper } from "../../infrastructure/mappers/LeaderboardEntryResponseMapper.js";

import { LeaderboardEntryResponseDto } from "../dto/LeaderboardEntryResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import {
    ISubmissionRepository,
} from "../../../../academic/submissions/infrastructure/repositories/ISubmissionRepository.js";

import { SubmissionStatus } from "../../../../academic/submissions/domain/constants/SubmissionStatus.js";

import {
    IEventRepository,
} from "../../../events/infrastructure/repositories/IEventRepository.js";

import {
    IEventRegistrationRepository,
} from "../../../events/infrastructure/repositories/IEventRegistrationRepository.js";

export class RecalculateLeaderboardUseCase {

    constructor(

        private readonly repository: ILeaderboardRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly submissionRepository: ISubmissionRepository,

        private readonly eventRepository: IEventRepository,

        private readonly eventRegistrationRepository: IEventRegistrationRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<LeaderboardEntryResponseDto[]> {

        const students =

            await this.studentRepository.findByOrganization(

                organizationId,

                {}

            );

        for (const student of students) {

            const submissions =

                await this.submissionRepository.findAll({

                    organizationId,

                    submittedBy:
                        student.userId,

                    status:
                        SubmissionStatus.APPROVED

                });

            const activityPoints =

                submissions.reduce(

                    (sum, submission) =>

                        sum + submission.review.pointsAwarded,

                    0

                );

            const registrations =

                await this.eventRegistrationRepository.findByStudent(
                    student.id!
                );

            let eventPoints = 0;

            for (const registration of registrations) {

                if (registration.attendance) {

                    const event =

                        await this.eventRepository.findById(
                            registration.eventId
                        );

                    if (

                        event &&
                        event.organizationId === organizationId

                    ) {

                        eventPoints +=

                            event.points;

                    }

                }

            }

            const existing =

                await this.repository.findByStudentId(

                    organizationId,

                    student.id!

                );

            const clubPoints =

                existing?.clubPoints ?? 0;

            const placementPoints =

                existing?.placementPoints ?? 0;

            const entry = LeaderboardEntry.create({

                id:
                    existing?.id,

                organizationId,

                studentId:
                    student.id!,

                activityPoints,

                clubPoints,

                eventPoints,

                placementPoints,

                totalPoints:
                    activityPoints + clubPoints + eventPoints + placementPoints,

                rank:
                    existing?.rank ?? 0

            });

            await this.repository.upsert(

                entry

            );

        }

        const ranked =

            await this.repository.reRank(

                organizationId

            );

        return ranked.map(

            entry =>

                LeaderboardEntryResponseMapper.toDto(
                    entry
                )

        );

    }

}
