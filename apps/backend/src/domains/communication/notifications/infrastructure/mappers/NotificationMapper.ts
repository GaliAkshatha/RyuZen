import { Notification } from "../../domain/entities/Notification.js";

import { NotificationType } from "../../domain/constants/NotificationType.js";
import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";

import {
    NotificationDocument
} from "../persistence/NotificationModel.js";

export class NotificationMapper {

    static toDomain(

        document: NotificationDocument

    ): Notification {

        return Notification.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            senderId:
                document.senderId.toString(),

            title:
                document.title,

            message:
                document.message,

            type:
                document.type as NotificationType | undefined,

            targetAudience:
                document.targetAudience as NotificationAudience,

            recipientUserId:
                document.recipientUserId?.toString(),

            departmentIds:
                document.departmentIds?.map(id => id.toString()),

            readBy:
                document.readBy.map(

                    id => id.toString()

                ),

            createdAt:
                document.createdAt

        });

    }

    static toPersistence(

        notification: Notification

    ) {

        const data =
            notification.toObject();

        return {

            organizationId:
                data.organizationId,

            senderId:
                data.senderId,

            title:
                data.title,

            message:
                data.message,

            type:
                data.type,

            targetAudience:
                data.targetAudience,

            recipientUserId:
                data.recipientUserId,

            departmentIds:
                data.departmentIds,

            readBy:
                data.readBy

        };

    }

}
