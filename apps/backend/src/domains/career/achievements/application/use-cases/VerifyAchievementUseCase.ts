import { IAchievementRepository } from "../../infrastructure/repositories/IAchievementRepository.js";

import { AchievementResponseMapper } from "../../infrastructure/mappers/AchievementResponseMapper.js";

import { AchievementResponseDto } from "../dto/AchievementResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";

import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";

export class VerifyAchievementUseCase {

    constructor(

        private readonly repository: IAchievementRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase

    ) {}

    async execute(

        id: string,

        organizationId: string,

        verifiedBy: string

    ): Promise<AchievementResponseDto> {

        const achievement =

            await this.repository.findById(
                id
            );

        if (

            !achievement ||
            achievement.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Achievement not found.",

                HttpStatus.NOT_FOUND

            );

        }

        achievement.verify(

            verifiedBy

        );

        const updated =

            await this.repository.save(
                achievement
            );

        const student =

            await this.studentRepository.findById(
                updated.studentId
            );

        if (student) {

            await this.recordSystemNotification.execute({

                organizationId,

                recipientUserId:
                    student.userId,

                senderId:
                    verifiedBy,

                title:
                    "Achievement verified",

                message:
                    `Your achievement "${updated.title}" has been verified and now counts toward your Career Score.`

            });

        }

        await this.recordGrowthEvent.execute({

            organizationId,

            studentId: updated.studentId,

            domain: "career",

            eventType: "ACHIEVEMENT_VERIFIED",

            evidence: { entityType: "Achievement", entityId: updated.id! },

            verifiedBy

        }).catch(() => {
            // Growth Profile recording must never break a real, already-persisted verification.
        });

        return AchievementResponseMapper.toDto(

            updated

        );

    }

}
