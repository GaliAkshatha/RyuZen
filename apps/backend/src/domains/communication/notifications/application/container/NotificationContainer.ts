import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";
import {
    FacultyRepository,
} from "../../../../academic/faculty/infrastructure/repositories/FacultyRepository.js";

import { SendNotificationUseCase } from "../use-cases/SendNotificationUseCase.js";
import { GetMyNotificationsUseCase } from "../use-cases/GetMyNotificationsUseCase.js";
import { MarkNotificationReadUseCase } from "../use-cases/MarkNotificationReadUseCase.js";
import { RecordSystemNotificationUseCase } from "../use-cases/RecordSystemNotificationUseCase.js";

const notificationRepository = new NotificationRepository();

const studentRepository = new StudentRepository();

const facultyRepository = new FacultyRepository();

export const notificationContainer = {

    sendNotification:

        new SendNotificationUseCase(
            notificationRepository
        ),

    getMyNotifications:

        new GetMyNotificationsUseCase(
            notificationRepository,
            studentRepository,
            facultyRepository
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
