import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { BadgeResponseMapper } from "../../infrastructure/mappers/BadgeResponseMapper.js";

import { BadgeResponseDto } from "../dto/BadgeResponseDto.js";

import { ICacheService } from "../../../../../shared/core/cache/ICacheService.js";

export const BADGES_CACHE_KEY = "badges:catalog";

const BADGES_CACHE_TTL_SECONDS = 300;

export class GetBadgesUseCase {

    constructor(

        private readonly repository: IBadgeRepository,

        private readonly cacheService: ICacheService

    ) {}

    async execute(): Promise<BadgeResponseDto[]> {

        const cached =

            await this.cacheService.get<BadgeResponseDto[]>(
                BADGES_CACHE_KEY
            );

        if (cached) {

            return cached;

        }

        const badges =

            await this.repository.findAll();

        const dtos =

            badges.map(

                badge =>

                    BadgeResponseMapper.toDto(
                        badge
                    )

            );

        await this.cacheService.set(

            BADGES_CACHE_KEY,

            dtos,

            BADGES_CACHE_TTL_SECONDS

        );

        return dtos;

    }

}
