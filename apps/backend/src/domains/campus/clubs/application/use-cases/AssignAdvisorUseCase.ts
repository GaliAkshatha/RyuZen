import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";

import { ClubResponseMapper } from "../../infrastructure/mappers/ClubResponseMapper.js";

import { AssignAdvisorDto } from "../dto/AssignAdvisorDto.js";
import { ClubResponseDto } from "../dto/ClubResponseDto.js";

import {
    IFacultyRepository,
} from "../../../../academic/faculty/infrastructure/repositories/IFacultyRepository.js";

import { FacultyStatus } from "../../../../academic/faculty/domain/constants/FacultyStatus.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class AssignAdvisorUseCase {

    constructor(

        private readonly repository: IClubRepository,

        private readonly facultyRepository: IFacultyRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: AssignAdvisorDto

    ): Promise<ClubResponseDto> {

        const club =

            await this.repository.findById(
                id
            );

        if (

            !club ||
            club.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Club not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const faculty =

            await this.facultyRepository.findById(
                dto.facultyId
            );

        if (

            !faculty ||
            faculty.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Faculty not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (faculty.status !== FacultyStatus.ACTIVE) {

            throw new ApiError(

                "Advisor must be an active faculty member.",

                HttpStatus.BAD_REQUEST

            );

        }

        club.assignAdvisor(

            dto.facultyId

        );

        const updated =

            await this.repository.save(
                club
            );

        return ClubResponseMapper.toDto(

            updated

        );

    }

}
