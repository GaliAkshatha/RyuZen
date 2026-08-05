import { IRecruiterRepository } from "../../infrastructure/repositories/IRecruiterRepository.js";

import {
    IPlacementDriveRepository,
} from "../../../drives/infrastructure/repositories/IPlacementDriveRepository.js";

import {
    IJobApplicationRepository,
} from "../../../applications/infrastructure/repositories/IJobApplicationRepository.js";

import {
    JobApplicationResponseMapper,
} from "../../../applications/infrastructure/mappers/JobApplicationResponseMapper.js";

import {
    JobApplicationResponseDto,
} from "../../../applications/application/dto/JobApplicationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * "Recruiter reviews applicants" - the real end of Company -> Drive ->
 * Eligibility Criteria -> Eligible Students -> Student Applies. A
 * recruiter only ever sees real applications for their own real
 * company's real drives - resolved from their own Recruiter profile,
 * never taking a companyId as a caller-supplied parameter (which
 * would let a recruiter simply ask for another company's applicants).
 * There is no unrestricted student directory anywhere in this path.
 */
export class GetApplicantsForRecruiterUseCase {

    constructor(

        private readonly recruiterRepository: IRecruiterRepository,

        private readonly driveRepository: IPlacementDriveRepository,

        private readonly applicationRepository: IJobApplicationRepository

    ) {}

    async execute(

        recruiterUserId: string,

        organizationId: string

    ): Promise<JobApplicationResponseDto[]> {

        const recruiter =

            await this.recruiterRepository.findByUserId(
                recruiterUserId
            );

        if (

            !recruiter ||
            recruiter.organizationId !== organizationId

        ) {

            throw new ApiError(

                "No recruiter profile found for this account.",

                HttpStatus.FORBIDDEN

            );

        }

        const drives =

            await this.driveRepository.findByOrganization(
                organizationId,
                { companyId: recruiter.companyId }
            );

        if (drives.length === 0) {

            return [];

        }

        const driveIds =

            drives.map(drive => drive.id!);

        const applications =

            await this.applicationRepository.findByPlacementIds(
                driveIds
            );

        return applications.map(

            application => JobApplicationResponseMapper.toDto(application)

        );

    }

}
