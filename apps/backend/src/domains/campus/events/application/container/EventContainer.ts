import { EventRepository } from "../../infrastructure/repositories/EventRepository.js";

import { EventRegistrationRepository } from "../../infrastructure/repositories/EventRegistrationRepository.js";

import {
    ClubRepository,
} from "../../../clubs/infrastructure/repositories/ClubRepository.js";

import {
    StudentRepository,
} from "../../../../academic/students/infrastructure/repositories/StudentRepository.js";

import {
    notificationContainer,
} from "../../../../communication/notifications/application/container/NotificationContainer.js";

import { CreateEventUseCase } from "../use-cases/CreateEventUseCase.js";
import { GetEventUseCase } from "../use-cases/GetEventUseCase.js";
import { GetEventsUseCase } from "../use-cases/GetEventsUseCase.js";
import { UpdateEventUseCase } from "../use-cases/UpdateEventUseCase.js";
import { DeleteEventUseCase } from "../use-cases/DeleteEventUseCase.js";
import { PublishEventUseCase } from "../use-cases/PublishEventUseCase.js";
import { RegisterForEventUseCase } from "../use-cases/RegisterForEventUseCase.js";
import { MarkAttendanceUseCase } from "../use-cases/MarkAttendanceUseCase.js";
import {
    pointLedgerContainer,
} from "../../../point-ledger/application/container/PointLedgerContainer.js";
import { SubmitEventFeedbackUseCase } from "../use-cases/SubmitEventFeedbackUseCase.js";
import { IssueCertificatesUseCase } from "../use-cases/IssueCertificatesUseCase.js";
import { GetEventRegistrationsUseCase } from "../use-cases/GetEventRegistrationsUseCase.js";

const eventRepository = new EventRepository();

const eventRegistrationRepository = new EventRegistrationRepository();

const clubRepository = new ClubRepository();

const studentRepository = new StudentRepository();

export const eventContainer = {

    createEvent:

        new CreateEventUseCase(

            eventRepository,

            clubRepository

        ),

    getEvent:

        new GetEventUseCase(
            eventRepository
        ),

    getEvents:

        new GetEventsUseCase(
            eventRepository
        ),

    updateEvent:

        new UpdateEventUseCase(
            eventRepository
        ),

    deleteEvent:

        new DeleteEventUseCase(

            eventRepository,

            eventRegistrationRepository

        ),

    publishEvent:

        new PublishEventUseCase(
            eventRepository
        ),

    registerForEvent:

        new RegisterForEventUseCase(

            eventRepository,

            eventRegistrationRepository,

            studentRepository

        ),

    markAttendance:

        new MarkAttendanceUseCase(

            eventRepository,

            eventRegistrationRepository,

            pointLedgerContainer.recordPointTransaction

        ),

    submitEventFeedback:

        new SubmitEventFeedbackUseCase(

            eventRegistrationRepository,

            studentRepository

        ),

    issueCertificates:

        new IssueCertificatesUseCase(

            eventRepository,

            eventRegistrationRepository,

            studentRepository,

            notificationContainer.recordSystemNotification

        ),

    getEventRegistrations:

        new GetEventRegistrationsUseCase(

            eventRepository,

            eventRegistrationRepository

        )

};
