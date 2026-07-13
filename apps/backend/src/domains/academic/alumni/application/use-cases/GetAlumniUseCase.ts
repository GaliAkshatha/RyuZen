import { IAlumniRepository } from "../../infrastructure/repositories/IAlumniRepository.js";

import { AlumniResponseMapper } from "../../infrastructure/mappers/AlumniResponseMapper.js";

import { AlumniResponseDto } from "../dto/AlumniResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetAlumniUseCase {

    constructor(

        private readonly repository: IAlumniRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<AlumniResponseDto> {

        const alumni =

            await this.repository.findById(
                id
            );

        if (

            !alumni ||
            alumni.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Alumni not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return AlumniResponseMapper.toDto(

            alumni

        );

    }

}
