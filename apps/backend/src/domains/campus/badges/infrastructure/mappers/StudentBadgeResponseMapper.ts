import { StudentBadge } from "../../domain/entities/StudentBadge.js";
import { Badge } from "../../domain/entities/Badge.js";

import { StudentBadgeResponseDto } from "../../application/dto/StudentBadgeResponseDto.js";

export class StudentBadgeResponseMapper {

    static toDto(

        studentBadge: StudentBadge,

        badge?: Badge

    ): StudentBadgeResponseDto {

        return {

            id:
                studentBadge.id!,

            studentId:
                studentBadge.studentId,

            badgeId:
                studentBadge.badgeId,

            awardedBy:
                studentBadge.awardedBy,

            awardedAt:
                studentBadge.awardedAt,

            badge:
                badge

                    ? {

                        name:
                            badge.name,

                        description:
                            badge.description,

                        icon:
                            badge.icon,

                        points:
                            badge.points

                    }

                    : undefined

        };

    }

}
