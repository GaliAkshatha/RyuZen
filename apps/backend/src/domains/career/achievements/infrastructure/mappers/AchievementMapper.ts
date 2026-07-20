import { Achievement } from "../../domain/entities/Achievement.js";

import { AchievementLevel } from "../../domain/constants/AchievementLevel.js";
import { AchievementStatus } from "../../domain/constants/AchievementStatus.js";

import {
    AchievementDocument
} from "../persistence/AchievementModel.js";

export class AchievementMapper {

    static toDomain(

        document: AchievementDocument

    ): Achievement {

        return Achievement.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            studentId:
                document.studentId.toString(),

            facultyId:
                document.facultyId?.toString(),

            title:
                document.title,

            description:
                document.description,

            category:
                document.category,

            level:
                document.level as AchievementLevel | undefined,

            position:
                document.position,

            certificateUrl:
                document.certificateUrl,

            proofUrl:
                document.proofUrl,

            achievementDate:
                document.achievementDate,

            verifiedBy:
                document.verifiedBy?.toString(),

            status:
                document.status as AchievementStatus,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        achievement: Achievement

    ) {

        const data =
            achievement.toObject();

        return {

            organizationId:
                data.organizationId,

            studentId:
                data.studentId,

            facultyId:
                data.facultyId,

            title:
                data.title,

            description:
                data.description,

            category:
                data.category,

            level:
                data.level,

            position:
                data.position,

            certificateUrl:
                data.certificateUrl,

            proofUrl:
                data.proofUrl,

            achievementDate:
                data.achievementDate,

            verifiedBy:
                data.verifiedBy,

            status:
                data.status

        };

    }

}
