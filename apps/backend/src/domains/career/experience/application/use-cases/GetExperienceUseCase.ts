import { IExperienceRepository } from "../../infrastructure/repositories/IExperienceRepository.js";

import { ExperienceResponseMapper } from "../../infrastructure/mappers/ExperienceResponseMapper.js";

import { ExperienceResponseDto } from "../dto/ExperienceResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetExperienceUseCase {

    constructor(

        private readonly repository: IExperienceRepository

    ) {}

    async execute(

        id: string

    ): Promise<ExperienceResponseDto> {

        const experience =

            await this.repository.findById(
                id
            );

        if (!experience) {

            throw new ApiError(

                "Experience not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return ExperienceResponseMapper.toDto(

            experience

        );

    }

}
