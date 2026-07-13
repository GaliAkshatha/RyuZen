import { EventRegistration } from "../../domain/entities/EventRegistration.js";

import { EventRegistrationResponseDto } from "../../application/dto/EventRegistrationResponseDto.js";

export class EventRegistrationResponseMapper {

    static toDto(

        registration: EventRegistration

    ): EventRegistrationResponseDto {

        return {

            id:
                registration.id!,

            eventId:
                registration.eventId,

            studentId:
                registration.studentId,

            attendance:
                registration.attendance,

            feedback:
                registration.feedback,

            certificateIssued:
                registration.certificateIssued,

            registeredAt:
                registration.registeredAt

        };

    }

}
