import { StudentBadge } from "../../domain/entities/StudentBadge.js";

import { IBadgeRepository } from "../../infrastructure/repositories/IBadgeRepository.js";

import { IStudentBadgeRepository } from "../../infrastructure/repositories/IStudentBadgeRepository.js";

import { StudentBadgeResponseMapper } from "../../infrastructure/mappers/StudentBadgeResponseMapper.js";

import { AwardBadgeDto } from "../dto/AwardBadgeDto.js";
import { StudentBadgeResponseDto } from "../dto/StudentBadgeResponseDto.js";

import {
    IStudentRepository,
} from "../../../../academic/students/infrastructure/repositories/IStudentRepository.js";

import { RecordSystemNotificationUseCase } from "../../../../communication/notifications/application/use-cases/RecordSystemNotificationUseCase.js";
import { RecordGrowthEventUseCase } from "../../../../../shared/infrastructure/growth/RecordGrowthEventUseCase.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Awarding a badge is a genuinely celebratory, recognition-worthy
 * moment - the same class of event as VerifyAchievementUseCase and
 * IssueCertificateUseCase, both of which already notify the student
 * and record a real growth event. This use case previously did
 * neither; a badge could be awarded and the student would have no way
 * to know unless they happened to check their profile.
 */
export class AwardBadgeUseCase {

    constructor(

        private readonly repository: IBadgeRepository,

        private readonly studentBadgeRepository: IStudentBadgeRepository,

        private readonly studentRepository: IStudentRepository,

        private readonly recordSystemNotification: RecordSystemNotificationUseCase,

        private readonly recordGrowthEvent: RecordGrowthEventUseCase

    ) {}

    async execute(

        badgeId: string,

        organizationId: string,

        awardedBy: string,

        dto: AwardBadgeDto

    ): Promise<StudentBadgeResponseDto> {

        const badge =

            await this.repository.findById(
                badgeId
            );

        if (!badge) {

            throw new ApiError(

                "Badge not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const student =

            await this.studentRepository.findById(
                dto.studentId
            );

        if (

            !student ||
            student.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Student not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const alreadyAwarded =

            await this.studentBadgeRepository.existsByStudentAndBadge(

                dto.studentId,

                badgeId

            );

        if (alreadyAwarded) {

            throw new ApiError(

                "This badge has already been awarded to this student.",

                HttpStatus.CONFLICT

            );

        }

        const studentBadge = StudentBadge.create({

            studentId:
                dto.studentId,

            badgeId,

            awardedBy,

            awardedAt:
                new Date()

        });

        const created =

            await this.studentBadgeRepository.create(

                studentBadge

            );

        await this.recordGrowthEvent.execute({

            organizationId,

            studentId: dto.studentId,

            domain: "campus",

            eventType: "BADGE_AWARDED",

            evidence: { entityType: "Badge", entityId: badgeId },

            verifiedBy: awardedBy

        });

        await this.recordSystemNotification.execute({

            organizationId,

            recipientUserId: student.userId,

            senderId: awardedBy,

            title: "New badge earned",

            message: `You've been awarded the "${badge.name}" badge.`

        }).catch(() => {
            // A notification failure must never undo an already-recorded award.
        });

        return StudentBadgeResponseMapper.toDto(

            created,

            badge

        );

    }

}
