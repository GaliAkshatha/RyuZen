import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { BadgeResponseMapper } from "../../infrastructure/mappers/BadgeResponseMapper.js";

import { BadgeResponseDto } from "../dto/BadgeResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository

    ) {}

    async execute(

        id: string

    ): Promise<BadgeResponseDto> {

        const badge =

            await this.repository.findById(
                id
            );

        if (!badge) {

            throw new ApiError(

                "Badge not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return BadgeResponseMapper.toDto(

            badge

        );

    }

}
