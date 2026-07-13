import { Club } from "../../domain/entities/Club.js";

import { ClubStatus } from "../../domain/constants/ClubStatus.js";

import { IClubRepository } from "../../infrastructure/repositories/IClubRepository.js";

import { ClubResponseMapper } from "../../infrastructure/mappers/ClubResponseMapper.js";

import { CreateClubDto } from "../dto/CreateClubDto.js";
import { ClubResponseDto } from "../dto/ClubResponseDto.js";

import {
    IFacultyRepository,
} from "../../../../academic/faculty/infrastructure/repositories/IFacultyRepository.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateClubUseCase {

    constructor(

        private readonly repository: IClubRepository,

        private readonly facultyRepository: IFacultyRepository

    ) {}

    async execute(

        dto: CreateClubDto,

        organizationId: string

    ): Promise<ClubResponseDto> {

        const codeTaken =

            await this.repository.existsByCode(

                organizationId,

                dto.code

            );

        if (codeTaken) {

            throw new ApiError(

                "A club with this code already exists.",

                HttpStatus.CONFLICT

            );

        }

        if (dto.facultyAdvisorId) {

            const faculty =

                await this.facultyRepository.findById(
                    dto.facultyAdvisorId
                );

            if (

                !faculty ||
                faculty.organizationId !== organizationId

            ) {

                throw new ApiError(

                    "Faculty advisor not found.",

                    HttpStatus.NOT_FOUND

                );

            }

        }

        const club = Club.create({

            organizationId,

            name:
                dto.name,

            code:
                dto.code,

            description:
                dto.description,

            logo:
                dto.logo,

            facultyAdvisorId:
                dto.facultyAdvisorId,

            status:
                ClubStatus.ACTIVE

        });

        const created =

            await this.repository.create(

                club

            );

        return ClubResponseMapper.toDto(

            created

        );

    }

}
