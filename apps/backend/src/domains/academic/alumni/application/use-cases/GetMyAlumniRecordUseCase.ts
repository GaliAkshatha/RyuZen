import { IAlumniRepository } from "../../infrastructure/repositories/IAlumniRepository.js";

import { AlumniResponseMapper } from "../../infrastructure/mappers/AlumniResponseMapper.js";

import { AlumniResponseDto } from "../dto/AlumniResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * A confirmed real gap this fills: every existing alumni endpoint
 * (GET /:id included) was SUPER_ADMIN/ORG_ADMIN only, so an alumnus
 * genuinely had no way to see their own record - not their own
 * company, designation, graduation year, or verification status.
 * This is the one ALUMNI-callable exception: looks up by the
 * caller's own real userId, never accepts an id parameter, so an
 * alumnus can only ever see their own record, never another's.
 */
export class GetMyAlumniRecordUseCase {

    constructor(

        private readonly repository: IAlumniRepository

    ) {}

    async execute(

        userId: string

    ): Promise<AlumniResponseDto> {

        const alumni =

            await this.repository.findByUserId(
                userId
            );

        if (!alumni) {

            throw new ApiError(

                "Alumni record not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return AlumniResponseMapper.toDto(

            alumni

        );

    }

}
