import { Event } from "../../domain/entities/Event.js";

import { EventResponseDto } from "../../application/dto/EventResponseDto.js";

export class EventResponseMapper {

    static toDto(

        event: Event

    ): EventResponseDto {

        return {

            id:
                event.id!,

            organizationId:
                event.organizationId,

            clubId:
                event.clubId,

            createdBy:
                event.createdBy,

            title:
                event.title,

            description:
                event.description,

            venue:
                event.venue,

            startDate:
                event.startDate,

            endDate:
                event.endDate,

            registrationDeadline:
                event.registrationDeadline,

            capacity:
                event.capacity,

            points:
                event.points,

            certificateEnabled:
                event.certificateEnabled,

            status:
                event.status,

            createdAt:
                event.createdAt,

            updatedAt:
                event.updatedAt

        };

    }

}
