import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

export interface GetAchievementsFilterDto {

    status?: string;

}

export class GetAchievementsUseCase {

    constructor(

        private readonly repository: IAchievementRepository

    ) {}

    async execute(

        organizationId: string,

        filters: GetAchievementsFilterDto

    ): Promise<AchievementResponseDto[]> {

        const achievements =

            await this.repository.findByOrganization(

                organizationId,

                {

                    status: filters.status

                }

            );

        return achievements.map(

            achievement =>

                AchievementResponseMapper.toDto(
                    achievement
                )

        );

    }

}
