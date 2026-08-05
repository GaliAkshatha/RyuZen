import { Recruiter } from "../../domain/entities/Recruiter.js";
import { RecruiterStatus } from "../../domain/constants/RecruiterStatus.js";

import { IRecruiterRepository } from "../../infrastructure/repositories/IRecruiterRepository.js";

import { RecruiterResponseMapper } from "../../infrastructure/mappers/RecruiterResponseMapper.js";

import { CreateRecruiterDto } from "../dto/CreateRecruiterDto.js";
import { RecruiterResponseDto } from "../dto/RecruiterResponseDto.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    ICompanyRepository,
} from "../../../companies/infrastructure/repositories/ICompanyRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Links a real, already-invited User (role RECRUITER, created via
 * InviteUserUseCase) to a real Company - the second half of the same
 * two-step pattern already established for Student/Faculty/Alumni:
 * invite creates the base identity, this creates the domain-specific
 * profile. Mirrors CreateStudentUseCase's exact validation sequence.
 */
export class CreateRecruiterUseCase {

    constructor(

        private readonly repository: IRecruiterRepository,

        private readonly userRepository: IUserRepository,

        private readonly companyRepository: ICompanyRepository

    ) {}

    async execute(

        dto: CreateRecruiterDto,

        organizationId: string

    ): Promise<RecruiterResponseDto> {

        const user =

            await this.userRepository.findById(
                dto.userId
            );

        if (

            !user ||
            user.organizationId !== organizationId

        ) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.role !== UserRole.RECRUITER) {

            throw new ApiError(

                "User must have the RECRUITER role.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alreadyLinked =

            await this.repository.existsByUserId(
                dto.userId
            );

        if (alreadyLinked) {

            throw new ApiError(

                "A recruiter record already exists for this user.",

                HttpStatus.CONFLICT

            );

        }

        const company =

            await this.companyRepository.findById(
                dto.companyId
            );

        if (

            !company ||
            company.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Company not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const recruiter = Recruiter.create({

            organizationId,

            userId:
                dto.userId,

            companyId:
                dto.companyId,

            jobTitle:
                dto.jobTitle,

            status:
                RecruiterStatus.ACTIVE

        });

        const created =

            await this.repository.create(
                recruiter
            );

        return RecruiterResponseMapper.toDto(

            created

        );

    }

}
