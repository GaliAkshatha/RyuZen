import { InterviewRound } from "../../domain/entities/InterviewRound.js";
import { InterviewRoundStatus } from "../../domain/constants/InterviewRoundStatus.js";

import { IInterviewRoundRepository } from "../../infrastructure/repositories/IInterviewRoundRepository.js";

import { InterviewRoundResponseMapper } from "../../infrastructure/mappers/InterviewRoundResponseMapper.js";

import { ScheduleInterviewRoundDto } from "../dto/ScheduleInterviewRoundDto.js";
import { InterviewRoundResponseDto } from "../dto/InterviewRoundResponseDto.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Every round should support scheduling, interviewer assignment" -
 * the real next step after a recruiter reviews an applicant. Sequence
 * is computed automatically from how many real rounds already exist
 * for this application, so a UI can honestly show "Round 2 of N" -
 * never guessed from roundType alone, since a real drive might skip a
 * round entirely.
 *
 * ORG_ADMIN/PLACEMENT_ADMIN-initiated for now, matching
 * UpdateJobApplicationStatusUseCase's existing scope - recruiter-
 * initiated scheduling (with real company-ownership resolution, the
 * same chain GetApplicantsForRecruiterUseCase already proves out) is
 * a real, reasonable near-term follow-up, not built here to keep this
 * pass honest and bounded rather than half-implementing multi-actor
 * ownership checks.
 */
export class ScheduleInterviewRoundUseCase {

    constructor(

        private readonly repository: IInterviewRoundRepository,

        private readonly applicationRepository: IJobApplicationRepository,

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        organizationId: string,

        dto: ScheduleInterviewRoundDto,

        scheduledBy: string

    ): Promise<InterviewRoundResponseDto> {

        const application =

            await this.applicationRepository.findById(
                dto.applicationId
            );

        if (!application) {

            throw new ApiError(

                "Job application not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const drive =

            await this.driveRepository.findById(
                application.placementId
            );

        if (

            !drive ||
            drive.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Job application not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const existingRounds =

            await this.repository.findByApplication(
                dto.applicationId
            );

        const round = InterviewRound.create({

            organizationId,

            applicationId:
                dto.applicationId,

            roundType:
                dto.roundType,

            sequence:
                existingRounds.length + 1,

            scheduledAt:
                dto.scheduledAt,

            interviewerId:
                dto.interviewerId,

            status:
                InterviewRoundStatus.SCHEDULED

        });

        const created =

            await this.repository.create(
                round
            );

        const student =

            await this.studentRepository.findById(
                application.studentId
            );

        if (student) {

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId:
                    student.userId,

                senderId:
                    scheduledBy,

                title:
                    `Interview round scheduled: ${drive.title}`,

                message:
                    dto.scheduledAt
                        ? `A ${dto.roundType.replace(/_/g, " ").toLowerCase()} round has been scheduled for ${dto.scheduledAt.toLocaleString()}.`
                        : `A ${dto.roundType.replace(/_/g, " ").toLowerCase()} round has been added to your application.`

            }).catch(() => {
                // A notification failure must never break a real, already-scheduled round.
            });

        }

        return InterviewRoundResponseMapper.toDto(

            created

        );

    }

}
