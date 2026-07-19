import { IExperienceRepository } from "../../infrastructure/repositories/IExperienceRepository.js";

import { ExperienceResponseMapper } from "../../infrastructure/mappers/ExperienceResponseMapper.js";

import { UpdateExperienceDto } from "../dto/UpdateExperienceDto.js";
import { ExperienceResponseDto } from "../dto/ExperienceResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateExperienceUseCase {

    constructor(

        private readonly repository: IExperienceRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: UpdateExperienceDto

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

        if (experience.userId !== userId) {

            throw new ApiError(

                "You can only update your own experience entries.",

                HttpStatus.FORBIDDEN

            );

        }

        experience.updateDetails(dto);

        const updated =

            await this.repository.save(
                experience
            );

        return ExperienceResponseMapper.toDto(

            updated

        );

    }

}
