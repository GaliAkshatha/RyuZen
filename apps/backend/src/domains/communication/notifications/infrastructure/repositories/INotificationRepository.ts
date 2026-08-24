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
     * viewerDepartmentId is real, optional department-scoping - a
     * notification with departmentIds set is only visible if the
     * viewer's own department is in that list; a notification with no
     * departmentIds at all is visible to the whole matching audience,
     * unaffected by this param.
     */
    findForAudience(
        organizationId: string,
        audience: string,
        userId: string,
        viewerDepartmentId?: string
    ): Promise<Notification[]>;

    save(
        notification: Notification
    ): Promise<Notification>;

}
