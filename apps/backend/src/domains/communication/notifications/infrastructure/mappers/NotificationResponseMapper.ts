import { Notification } from "../../domain/entities/Notification.js";

import { NotificationResponseDto } from "../../application/dto/NotificationResponseDto.js";

export class NotificationResponseMapper {

    static toDto(

        notification: Notification,

        viewerUserId: string

    ): NotificationResponseDto {

        return {

            id:
                notification.id!,

            organizationId:
                notification.organizationId,

            senderId:
                notification.senderId,

            title:
                notification.title,

            message:
                notification.message,

            type:
                notification.type,

            targetAudience:
                notification.targetAudience,

            isRead:
                notification.isReadBy(
                    viewerUserId
                ),

            createdAt:
                notification.createdAt

        };

    }

}
