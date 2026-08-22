import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { IRecruiterRepository } from "../../infrastructure/repositories/IRecruiterRepository.js";

import { RecruiterResponseMapper } from "../../infrastructure/mappers/RecruiterResponseMapper.js";
import { RecruiterResponseDto } from "../dto/RecruiterResponseDto.js";

/**
 * BACKEND GAP FIX: closes the "no GET /recruiters/me self-lookup"
 * gap flagged repeatedly through this engagement - this was blocking
 * a real "My Drives" and "My Company" frontend experience, since
 * there was previously no safe way to derive a recruiter's own real
 * companyId without approximating it from their applicant data.
 * Mirrors the exact same self-lookup pattern already proven correct
 * for GetMyFacultyProfileUseCase.
 */
export class GetMyRecruiterProfileUseCase {

    constructor(

        private readonly repository: IRecruiterRepository

    ) {}

    async execute(

        requesterId: string,

        organizationId: string

    ): Promise<RecruiterResponseDto> {

        const recruiter =

            await this.repository.findByUserId(requesterId);

        if (

            !recruiter ||
            recruiter.organizationId !== organizationId

        ) {

            throw new ApiError(

                "No recruiter profile found for this account.",

                HttpStatus.NOT_FOUND

            );

        }

        return RecruiterResponseMapper.toDto(recruiter);

    }

}
