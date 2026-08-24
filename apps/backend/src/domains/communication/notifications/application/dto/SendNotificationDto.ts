import { NotificationType } from "../../domain/constants/NotificationType.js";
import { NotificationAudience } from "../../domain/constants/NotificationAudience.js";

export interface SendNotificationDto {

    title: string;

    message: string;

    type?: NotificationType;

    targetAudience?: NotificationAudience;

    departmentIds?: string[];

}
