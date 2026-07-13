import { Event } from "../../domain/entities/Event.js";

import { EventStatus } from "../../domain/constants/EventStatus.js";

import {
    EventDocument
} from "../persistence/EventModel.js";

export class EventMapper {

    static toDomain(

        document: EventDocument

    ): Event {

        return Event.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            clubId:
                document.clubId?.toString(),

            createdBy:
                document.createdBy.toString(),

            title:
                document.title,

            description:
                document.description,

            venue:
                document.venue,

            startDate:
                document.startDate,

            endDate:
                document.endDate,

            registrationDeadline:
                document.registrationDeadline,

            capacity:
                document.capacity,

            points:
                document.points,

            certificateEnabled:
                document.certificateEnabled,

            status:
                document.status as EventStatus,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        event: Event

    ) {

        const data =
            event.toObject();

        return {

            organizationId:
                data.organizationId,

            clubId:
                data.clubId,

            createdBy:
                data.createdBy,

            title:
                data.title,

            description:
                data.description,

            venue:
                data.venue,

            startDate:
                data.startDate,

            endDate:
                data.endDate,

            registrationDeadline:
                data.registrationDeadline,

            capacity:
                data.capacity,

            points:
                data.points,

            certificateEnabled:
                data.certificateEnabled,

            status:
                data.status

        };

    }

}
