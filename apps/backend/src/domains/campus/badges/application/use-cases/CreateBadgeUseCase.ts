import { Badge } from "../../domain/entities/Badge.js";

import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { BadgeResponseMapper } from "../../infrastructure/mappers/BadgeResponseMapper.js";

import { CreateBadgeDto } from "../dto/CreateBadgeDto.js";
import { BadgeResponseDto } from "../dto/BadgeResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository

    ) {}

    async execute(

        dto: CreateBadgeDto

    ): Promise<BadgeResponseDto> {

        const exists =

            await this.repository.existsByName(
                dto.name
            );

        if (exists) {

            throw new ApiError(

                "A badge with this name already exists.",

                HttpStatus.CONFLICT

            );

        }

        const badge = Badge.create({

            name:
                dto.name,

            description:
                dto.description,

            icon:
                dto.icon,

            criteria:
                dto.criteria,

            points:
                dto.points ?? 0

        });

        const created =

            await this.repository.create(

                badge

            );

        return BadgeResponseMapper.toDto(

            created

        );

    }

}
