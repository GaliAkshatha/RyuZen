import { IEducationRepository } from "../../infrastructure/repositories/IEducationRepository.js";

import { EducationResponseMapper } from "../../infrastructure/mappers/EducationResponseMapper.js";

import { EducationResponseDto } from "../dto/EducationResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetEducationUseCase {

    constructor(

        private readonly repository: IEducationRepository

    ) {}

    async execute(

        id: string

    ): Promise<EducationResponseDto> {

        const education =

            await this.repository.findById(
                id
            );

        if (!education) {

            throw new ApiError(

                "Education not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return EducationResponseMapper.toDto(

            education

        );

    }

}
