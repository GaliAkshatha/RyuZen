import { Achievement } from "../../domain/entities/Achievement.js";

import { AchievementResponseDto } from "../../application/dto/AchievementResponseDto.js";

export class AchievementResponseMapper {

    static toDto(

        achievement: Achievement

    ): AchievementResponseDto {

        return {

            id:
                achievement.id!,

            organizationId:
                achievement.organizationId,

            studentId:
                achievement.studentId,

            facultyId:
                achievement.facultyId,

            title:
                achievement.title,

            description:
                achievement.description,

            category:
                achievement.category,

            level:
                achievement.level,

            position:
                achievement.position,

            certificateUrl:
                achievement.certificateUrl,

            proofUrl:
                achievement.proofUrl,

            achievementDate:
                achievement.achievementDate,

            verifiedBy:
                achievement.verifiedBy,

            status:
                achievement.status,

            createdAt:
                achievement.createdAt,

            updatedAt:
                achievement.updatedAt

        };

    }

}
