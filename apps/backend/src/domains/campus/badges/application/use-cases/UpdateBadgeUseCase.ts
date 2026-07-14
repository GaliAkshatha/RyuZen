import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { BadgeResponseMapper } from "../../infrastructure/mappers/BadgeResponseMapper.js";

import { UpdateBadgeDto } from "../dto/UpdateBadgeDto.js";
import { BadgeResponseDto } from "../dto/BadgeResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository

    ) {}

    async execute(

        id: string,

        dto: UpdateBadgeDto

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

        if (

            dto.name !== undefined &&
            dto.name !== badge.name

        ) {

            const nameTaken =

                await this.repository.existsByName(
                    dto.name
                );

            if (nameTaken) {

                throw new ApiError(

                    "A badge with this name already exists.",

                    HttpStatus.CONFLICT

                );

            }

        }

        badge.updateDetails(dto);

        const updated =

            await this.repository.save(
                badge
            );

        return BadgeResponseMapper.toDto(

            updated

        );

    }

}
