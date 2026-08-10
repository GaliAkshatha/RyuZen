import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Closes a real, documented gap: a Faculty user had no way to
 * discover their own Faculty.id, which meant StudentProgressWidget
 * and MentorshipListPage's "my mentees" filtering couldn't be
 * genuinely scoped server-side (both were showing an honest
 * disclaimer instead of a real filter). GetFacultiesUseCase already
 * supports a real facultyId filter on GET /mentorships - this was the
 * one missing piece connecting a Faculty caller to their own id.
 */
export class GetMyFacultyProfileUseCase {

    constructor(

        private readonly repository: IFacultyRepository

    ) {}

    async execute(

        userId: string,

        organizationId: string

    ): Promise<FacultyResponseDto> {

        const faculty =

            await this.repository.findByUserId(
                userId
            );

        if (

            !faculty ||
            faculty.organizationId !== organizationId

        ) {

            throw new ApiError(

                "No faculty profile is linked to your account yet. Contact your administrator.",

                HttpStatus.NOT_FOUND

            );

        }

        return FacultyResponseMapper.toDto(

            faculty

        );

    }

}
