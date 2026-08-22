import { IJobApplicationRepository } from "../../infrastructure/repositories/IJobApplicationRepository.js";

import { JobApplicationResponseMapper } from "../../infrastructure/mappers/JobApplicationResponseMapper.js";

import { UpdateJobApplicationStatusDto } from "../dto/UpdateJobApplicationStatusDto.js";
import { JobApplicationResponseDto } from "../dto/JobApplicationResponseDto.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";
import { JobApplicationStatus } from "../../domain/constants/JobApplicationStatus.js";

import { RecruiterCandidateAccessService } from "../../../../../shared/services/RecruiterCandidateAccessService.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const STATUS_MESSAGES: Record<string, string> = {

    SHORTLISTED: "You've been shortlisted",

    SELECTED: "Congratulations — you've been selected!",

    REJECTED: "Your application status has been updated"

};

export class UpdateJobApplicationStatusUseCase {

    constructor(

        private readonly repository: IJobApplicationRepository,

        private readonly placementDriveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase,

        private readonly recruiterCandidateAccessService: RecruiterCandidateAccessService

    ) {}

    /**
     * RECRUITER access is real, but genuinely scoped: a recruiter may
     * only update the status of an application to one of their own
     * company's real drives, checked here every call via
     * canRecruiterManageDrive - without this, opening the route to
     * RECRUITER at all would let any recruiter update any company's
     * applications in the organization.
     */
    async execute(

        id: string,

        organizationId: string,

        dto: UpdateJobApplicationStatusDto,

        updatedBy: string,

        updatedByRole: UserRole

    ): Promise<JobApplicationResponseDto> {

        const application =

            await this.repository.findById(
                id
            );

        if (!application) {

            throw new ApiError(

                "Job application not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const drive =

            await this.placementDriveRepository.findById(
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

        if (updatedByRole === UserRole.RECRUITER) {

            const canManage =

                await this.recruiterCandidateAccessService.canRecruiterManageDrive(
                    updatedBy,
                    organizationId,
                    drive.id!
                );

            if (!canManage) {

                throw new ApiError(

                    "This drive does not belong to your company.",

                    HttpStatus.FORBIDDEN

                );

            }

        }

        application.updateStatus(

            dto.status,

            dto.remarks

        );

        const updated =

            await this.repository.save(
                application
            );

        const student =

            await this.studentRepository.findById(
                updated.studentId
            );

        if (student) {

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId:
                    student.userId,

                senderId:
                    updatedBy,

                title:
                    `Application update: ${drive.title}`,

                message:

                    (STATUS_MESSAGES[dto.status] ?? "Your application status has been updated") +
                    (dto.remarks ? ` — ${dto.remarks}` : ".")

            });

        }

        if (

            dto.status === JobApplicationStatus.SHORTLISTED ||
            dto.status === JobApplicationStatus.SELECTED

        ) {

            await this.recordGrowthEvent.execute({

                organizationId,

                studentId: updated.studentId,

                domain: "placements",

                eventType:
                    dto.status === JobApplicationStatus.SELECTED
                        ? "PLACEMENT_OFFER_RECEIVED"
                        : "PLACEMENT_SHORTLISTED",

                evidence: { entityType: "JobApplication", entityId: updated.id! },

                verifiedBy: updatedBy

            }).catch(() => {
                // Growth Profile recording must never break a real, already-persisted status update.
            });

        }

        return JobApplicationResponseMapper.toDto(

            updated

        );

    }

}
