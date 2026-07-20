import { NotificationType } from "../constants/NotificationType.js";
import { NotificationAudience } from "../constants/NotificationAudience.js";

export interface INotification {

    id?: string;

    organizationId: string;

    senderId: string;

    title: string;

    message: string;

    type?: NotificationType;

    targetAudience: NotificationAudience;

    readBy: string[];

    createdAt?: Date;

}
