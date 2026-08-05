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

    /** Only set for system-generated, single-recipient notifications (targetAudience: TARGETED). */
    recipientUserId?: string;

    readBy: string[];

    createdAt?: Date;

}
