import { Notification } from "../../domain/entities/Notification.js";

import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";

import { INotificationRepository } from "../../infrastructure/repositories/INotificationRepository.js";

import { NotificationResponseMapper } from "../../infrastructure/mappers/NotificationResponseMapper.js";

import { SendNotificationDto } from "../dto/SendNotificationDto.js";
import { NotificationResponseDto } from "../dto/NotificationResponseDto.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

/**
 * Real sender-role enforcement, per explicit product direction - a
 * confirmed gap fixed this pass: previously ANY caller who reached
 * this endpoint (ORG_ADMIN or FACULTY, per the route gate) could pick
 * ANY targetAudience at all, including ALL or ORG_ADMIN - a Faculty
 * member could have broadcast to the entire organization. Now the
 * caller's real role determines which audiences they're genuinely
 * allowed to pick:
 *
 * - SUPER_ADMIN: any real audience (their own organization only -
 *   see the class-level note on why this isn't a true cross-org
 *   broadcast).
 * - ORG_ADMIN: FACULTY, STUDENT, ALUMNI, or ALL - never ORG_ADMIN
 *   (no real reason to let an org admin message other org admins in
 *   their own org through this broadcast mechanism).
 * - FACULTY: STUDENT only.
 *
 * departmentIds is a real, optional narrowing available to ORG_ADMIN
 * and FACULTY when targeting STUDENT or FACULTY - unset means no
 * department restriction (every real member of that audience sees
 * it), matching the same real "unset means unrestricted" pattern
 * already established for Activities and Placement Drives.
 */
const ALLOWED_AUDIENCES_BY_ROLE: Partial<Record<UserRole, NotificationAudience[]>> = {
    [UserRole.SUPER_ADMIN]: [
        NotificationAudience.ALL,
        NotificationAudience.ORG_ADMIN,
        NotificationAudience.FACULTY,
        NotificationAudience.STUDENT,
        NotificationAudience.ALUMNI
    ],
    [UserRole.ORG_ADMIN]: [
        NotificationAudience.ALL,
        NotificationAudience.FACULTY,
        NotificationAudience.STUDENT,
        NotificationAudience.ALUMNI
    ],
    [UserRole.FACULTY]: [
        NotificationAudience.STUDENT
    ]
};

export class SendNotificationUseCase {

    constructor(

        private readonly repository: INotificationRepository

    ) {}

    async execute(

        dto: SendNotificationDto,

        organizationId: string,

        senderId: string,

        senderRole: UserRole

    ): Promise<NotificationResponseDto> {

        const requestedAudience = dto.targetAudience ?? NotificationAudience.ALL;

        const allowedAudiences = ALLOWED_AUDIENCES_BY_ROLE[senderRole] ?? [];

        if (!allowedAudiences.includes(requestedAudience)) {

            throw new ApiError(

                `Your role cannot send notifications to ${requestedAudience}.`,

                HttpStatus.FORBIDDEN

            );

        }

        if (

            dto.departmentIds &&
            dto.departmentIds.length > 0 &&
            requestedAudience !== NotificationAudience.STUDENT &&
            requestedAudience !== NotificationAudience.FACULTY

        ) {

            throw new ApiError(

                "Department targeting only applies to Student or Faculty audiences.",

                HttpStatus.BAD_REQUEST

            );

        }

        const notification = Notification.create({

            organizationId,

            senderId,

            title:
                dto.title,

            message:
                dto.message,

            type:
                dto.type,

            targetAudience:
                requestedAudience,

            departmentIds:
                dto.departmentIds,

            readBy:
                []

        });

        const created =

            await this.repository.create(

                notification

            );

        return NotificationResponseMapper.toDto(

            created,

            senderId

        );

    }

}
