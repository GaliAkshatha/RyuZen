import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { BadgeResponseMapper } from "../../infrastructure/mappers/BadgeResponseMapper.js";

import { BadgeResponseDto } from "../dto/BadgeResponseDto.js";

export class GetBadgesUseCase {

    constructor(

        private readonly repository: IBadgeRepository

    ) {}

    async execute(): Promise<BadgeResponseDto[]> {

        const badges =

            await this.repository.findAll();

        return badges.map(

            badge =>

                BadgeResponseMapper.toDto(
                    badge
                )

        );

    }

}
