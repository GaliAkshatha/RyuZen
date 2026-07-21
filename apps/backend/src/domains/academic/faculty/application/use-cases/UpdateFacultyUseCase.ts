import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { UpdateFacultyDto } from "../dto/UpdateFacultyDto.js";
import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateFacultyUseCase {

    constructor(

        private readonly repository: IFacultyRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateFacultyDto

    ): Promise<FacultyResponseDto> {

        const faculty =

            await this.repository.findById(
                id
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

        if (

            dto.employeeId !== undefined &&
            dto.employeeId !== faculty.employeeId

        ) {

            const employeeIdTaken =

                await this.repository.existsByEmployeeId(

                    organizationId,

                    dto.employeeId

                );

            if (employeeIdTaken) {

                throw new ApiError(

                    "A faculty member with this employee id already exists.",

                    HttpStatus.CONFLICT

                );

            }

        }

        faculty.updateDetails(dto);

        const updated =

            await this.repository.save(
                faculty
            );

        return FacultyResponseMapper.toDto(

            updated

        );

    }

}
