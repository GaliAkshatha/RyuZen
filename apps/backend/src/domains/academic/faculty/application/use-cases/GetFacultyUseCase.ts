import { IFacultyRepository } from "../../infrastructure/repositories/IFacultyRepository.js";

import { FacultyResponseMapper } from "../../infrastructure/mappers/FacultyResponseMapper.js";

import { FacultyResponseDto } from "../dto/FacultyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetFacultyUseCase {

    constructor(

        private readonly repository: IFacultyRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

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

        return FacultyResponseMapper.toDto(

            faculty

        );

    }

}