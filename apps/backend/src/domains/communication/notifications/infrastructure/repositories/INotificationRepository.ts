import { Notification } from "../../domain/entities/Notification.js";

export interface INotificationRepository {

    create(
        notification: Notification
    ): Promise<Notification>;

    findById(
        id: string
    ): Promise<Notification | null>;

    /**
     * Returns every notification the given viewer should see: role/ALL
     * broadcasts matching their audience, PLUS any TARGETED
     * notification addressed specifically to their own userId.
     */
    findForAudience(
        organizationId: string,
        audience: string,
        userId: string
    ): Promise<Notification[]>;

    save(
        notification: Notification
    ): Promise<Notification>;

}
