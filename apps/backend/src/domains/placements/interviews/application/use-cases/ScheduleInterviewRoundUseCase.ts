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

import {
    IRecruiterRepository,
} from "../../../recruiters/infrastructure/repositories/IRecruiterRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

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
 * ORG_ADMIN/PLACEMENT_ADMIN can schedule for any real application in
 * their org. RECRUITER can only schedule for applications to drives
 * at their own real company - resolved the same way
 * GetApplicantsForRecruiterUseCase already proves out (recruiter
 * profile -> real companyId -> drive.companyId match), not just
 * trusted from the request. This was the real, deliberately-deferred
 * gap from the original build - now closed.
 */
export class ScheduleInterviewRoundUseCase {

    constructor(

        private readonly repository: IInterviewRoundRepository,

        private readonly applicationRepository: IJobApplicationRepository,

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recruiterRepository: IRecruiterRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase

    ) {}

    async execute(

        organizationId: string,

        dto: ScheduleInterviewRoundDto,

        scheduledBy: string,

        scheduledByRole: UserRole

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

        if (scheduledByRole === UserRole.RECRUITER) {

            const recruiter =

                await this.recruiterRepository.findByUserId(
                    scheduledBy
                );

            if (

                !recruiter ||
                recruiter.organizationId !== organizationId ||
                recruiter.companyId !== drive.companyId

            ) {

                throw new ApiError(

                    "Job application not found.",

                    HttpStatus.NOT_FOUND

                );

            }

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
