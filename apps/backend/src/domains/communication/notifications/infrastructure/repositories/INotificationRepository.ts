import { Notification } from "../../domain/entities/Notification.js";

export interface INotificationRepository {

    create(
        notification: Notification
    ): Promise<Notification>;

    findById(
        id: string
    ): Promise<Notification | null>;

    findForAudience(
        organizationId: string,
        audience: string
    ): Promise<Notification[]>;

    save(
        notification: Notification
    ): Promise<Notification>;

}
