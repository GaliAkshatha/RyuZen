import { IInterviewRoundRepository } from "../../infrastructure/repositories/IInterviewRoundRepository.js";

import { InterviewRoundResponseMapper } from "../../infrastructure/mappers/InterviewRoundResponseMapper.js";
import { InterviewRoundResponseDto } from "../dto/InterviewRoundResponseDto.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

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
 * SECURITY FIX: previously only checked ownership when
 * requesterRole === STUDENT, leaving every other authenticated role -
 * RECRUITER in particular - able to read interview round data for any
 * application in any organization, inconsistent with
 * ScheduleInterviewRoundUseCase/RecordInterviewEvaluationUseCase on
 * the same resource, which already enforce real scope. This reuses
 * their exact pattern rather than inventing a new one:
 *
 * - A student can only ever see rounds for their OWN application -
 *   never another student's, even within the same drive.
 * - The drive must genuinely belong to the caller's own organization
 *   (closes a second gap: the old code never checked this at all).
 * - RECRUITER can only see rounds for applications to drives at their
 *   own real company - resolved the same way
 *   GetApplicantsForRecruiterUseCase and ScheduleInterviewRoundUseCase
 *   already prove out (recruiter profile -> real companyId ->
 *   drive.companyId match), never trusted from the request.
 * - ORG_ADMIN/PLACEMENT_ADMIN see any real application within their
 *   own organization (the drive org-scope check above already covers
 *   this - no further restriction needed for them).
 *
 * Route-level authorizePermission restricts callers to STUDENT,
 * ORG_ADMIN, PLACEMENT_ADMIN, RECRUITER - any other authenticated
 * role is rejected before reaching this use case at all.
 */
export class GetInterviewRoundsForApplicationUseCase {

    constructor(

        private readonly repository: IInterviewRoundRepository,

        private readonly applicationRepository: IJobApplicationRepository,

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recruiterRepository: IRecruiterRepository

    ) {}

    async execute(

        applicationId: string,

        organizationId: string,

        requesterId: string,

        requesterRole: UserRole

    ): Promise<InterviewRoundResponseDto[]> {

        const application =

            await this.applicationRepository.findById(
                applicationId
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

        if (requesterRole === UserRole.STUDENT) {

            const student =

                await this.studentRepository.findByUserId(
                    requesterId
                );

            if (

                !student ||
                student.id !== application.studentId

            ) {

                throw new ApiError(

                    "Job application not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        if (requesterRole === UserRole.RECRUITER) {

            const recruiter =

                await this.recruiterRepository.findByUserId(
                    requesterId
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

        const rounds =

            await this.repository.findByApplication(
                applicationId
            );

        return rounds.map(

            round => InterviewRoundResponseMapper.toDto(round)

        );

    }

}
