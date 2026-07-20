import { Event } from "../../domain/entities/Event.js";

import { ClientSession } from "mongoose";

import { EventModel } from "../persistence/EventModel.js";

import { EventMapper } from "../mappers/EventMapper.js";

import { IEventRepository, EventFilters } from "./IEventRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class EventRepository extends BaseRepository<Event>
implements IEventRepository {

    async create(

        event: Event

    ): Promise<Event> {

        const document =

            await EventModel.create(

                EventMapper.toPersistence(

                    event

                )

            );

        return EventMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Event | null> {

        const document =

            await EventModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return EventMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: EventFilters

    ): Promise<Event[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.clubId) {

            query.clubId =

                filters.clubId;

        }

        if (filters.status) {

            query.status =

                filters.status;

        }

        const documents =

            await EventModel.find(query)

                .sort({

                    startDate: -1

                });

        return documents.map(

            document =>

                EventMapper.toDomain(
                    document
                )

        );

    }

    async save(

        event: Event

    ): Promise<Event> {

        const document =

            await EventModel.findByIdAndUpdate(

                event.id,

                EventMapper.toPersistence(

                    event

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Event not found."

            );

        }

        return EventMapper.toDomain(

            document

        );

    }

    async delete(

        id: string,

        session?: ClientSession

    ): Promise<void> {

        await EventModel.findByIdAndDelete(

            id

        ).session(

            session ?? null

        );

    }

}
