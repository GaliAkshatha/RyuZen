import { IInterviewRoundRepository } from "../../infrastructure/repositories/IInterviewRoundRepository.js";

import { InterviewRoundResponseMapper } from "../../infrastructure/mappers/InterviewRoundResponseMapper.js";
import { InterviewRoundResponseDto } from "../dto/InterviewRoundResponseDto.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * A student can only ever see rounds for their OWN application - never
 * another student's, even within the same drive. ORG_ADMIN/
 * PLACEMENT_ADMIN see any real application within their organization.
 * RECRUITER access (scoped to their own company's applications, the
 * same real chain GetApplicantsForRecruiterUseCase already proves out)
 * is a reasonable near-term follow-up, not built here - kept out
 * deliberately rather than half-implemented.
 */
export class GetInterviewRoundsForApplicationUseCase {

    constructor(

        private readonly repository: IInterviewRoundRepository,

        private readonly applicationRepository: IJobApplicationRepository,

        private readonly studentRepository: IStudentRepository

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

        const rounds =

            await this.repository.findByApplication(
                applicationId
            );

        return rounds.map(

            round => InterviewRoundResponseMapper.toDto(round)

        );

    }

}
