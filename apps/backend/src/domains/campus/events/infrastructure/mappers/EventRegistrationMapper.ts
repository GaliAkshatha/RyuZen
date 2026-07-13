import { EventRegistration } from "../../domain/entities/EventRegistration.js";

import {
    EventRegistrationDocument
} from "../persistence/EventRegistrationModel.js";

export class EventRegistrationMapper {

    static toDomain(

        document: EventRegistrationDocument

    ): EventRegistration {

        return EventRegistration.create({

            id:
                document.id,

            eventId:
                document.eventId.toString(),

            studentId:
                document.studentId.toString(),

            attendance:
                document.attendance,

            feedback:
                document.feedback,

            certificateIssued:
                document.certificateIssued,

            registeredAt:
                document.registeredAt

        });

    }

    static toPersistence(

        registration: EventRegistration

    ) {

        const data =
            registration.toObject();

        return {

            eventId:
                data.eventId,

            studentId:
                data.studentId,

            attendance:
                data.attendance,

            feedback:
                data.feedback,

            certificateIssued:
                data.certificateIssued,

            registeredAt:
                data.registeredAt

        };

    }

}
