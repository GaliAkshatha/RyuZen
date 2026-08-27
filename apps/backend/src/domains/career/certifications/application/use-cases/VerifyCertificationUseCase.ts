import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../infrastructure/mappers/CertificationResponseMapper.js";

import { CertificationResponseDto } from "../dto/CertificationResponseDto.js";

import { IUserRepository } from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Mirrors VerifySkillUseCase's exact real pattern - a Faculty/Org
 * Admin/Super Admin confirming a student's certification is
 * legitimate. Same real cross-org protection: the certification
 * owner's own User record is looked up and their organizationId must
 * match the caller's - a Faculty member can only ever verify
 * certifications belonging to students in their own organization,
 * regardless of what id they guess.
 */
export class VerifyCertificationUseCase {

    constructor(

        private readonly repository: ICertificationRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        verifiedByUserId: string

    ): Promise<CertificationResponseDto> {

        const certification =

            await this.repository.findById(
                id
            );

        if (!certification) {

            throw new ApiError(

                "Certification not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const owner =

            await this.userRepository.findById(
                certification.userId
            );

        if (

            !owner ||
            owner.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Certification not found.",

                HttpStatus.NOT_FOUND

            );

        }

        certification.verify(

            verifiedByUserId

        );

        const updated =

            await this.repository.save(
                certification
            );

        return CertificationResponseMapper.toDto(

            updated

        );

    }

}
