import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository.js";

import { SendNotificationUseCase } from "../use-cases/SendNotificationUseCase.js";
import { GetMyNotificationsUseCase } from "../use-cases/GetMyNotificationsUseCase.js";
import { MarkNotificationReadUseCase } from "../use-cases/MarkNotificationReadUseCase.js";
import { RecordSystemNotificationUseCase } from "../use-cases/RecordSystemNotificationUseCase.js";

const notificationRepository = new NotificationRepository();

export const notificationContainer = {

    sendNotification:

        new SendNotificationUseCase(
            notificationRepository
        ),

    getMyNotifications:

        new GetMyNotificationsUseCase(
            notificationRepository
        ),

    markNotificationRead:

        new MarkNotificationReadUseCase(
            notificationRepository
        ),

    recordSystemNotification:

        new RecordSystemNotificationUseCase(
            notificationRepository
        )

};
