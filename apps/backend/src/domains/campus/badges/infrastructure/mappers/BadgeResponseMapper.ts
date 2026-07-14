import { Badge } from "../../domain/entities/Badge.js";

import { BadgeResponseDto } from "../../application/dto/BadgeResponseDto.js";

export class BadgeResponseMapper {

    static toDto(

        badge: Badge

    ): BadgeResponseDto {

        return {

            id:
                badge.id!,

            name:
                badge.name,

            description:
                badge.description,

            icon:
                badge.icon,

            criteria:
                badge.criteria,

            points:
                badge.points,

            createdAt:
                badge.createdAt,

            updatedAt:
                badge.updatedAt

        };

    }

}
