import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class RejectAchievementUseCase {

    constructor(

        private readonly repository: IAchievementRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        verifiedBy: string

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

        achievement.reject(

            verifiedBy

        );

        const updated =

            await this.repository.save(
                achievement
            );

        return AchievementResponseMapper.toDto(

            updated

        );

    }

}
