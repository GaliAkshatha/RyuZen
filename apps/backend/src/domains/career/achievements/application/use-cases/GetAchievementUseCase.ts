import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetAchievementUseCase {

    constructor(

        private readonly repository: IAchievementRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<AchievementResponseDto> {

        const achievement =

            await this.repository.findById(
                id
            );

        if (

            !achievement ||
            achievement.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Achievement not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return AchievementResponseMapper.toDto(

            achievement

        );

    }

}
