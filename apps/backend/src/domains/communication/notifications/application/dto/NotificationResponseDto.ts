import { NotificationType } from "../../domain/constants/NotificationType.js";
import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";

export interface NotificationResponseDto {

    id: string;

    organizationId: string;

    senderId: string;

    title: string;

    message: string;

    type?: NotificationType;

    targetAudience: NotificationAudience;

    isRead: boolean;

    createdAt?: Date;

}
