import { EventRegistration } from "../../domain/entities/EventRegistration.js";

import { ClientSession } from "mongoose";

import { EventRegistrationModel } from "../persistence/EventRegistrationModel.js";

import { EventRegistrationMapper } from "../mappers/EventRegistrationMapper.js";

import { IEventRegistrationRepository } from "./IEventRegistrationRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class EventRegistrationRepository extends BaseRepository<EventRegistration>
implements IEventRegistrationRepository {

    async create(

        registration: EventRegistration

    ): Promise<EventRegistration> {

        const document =

            await EventRegistrationModel.create(

                EventRegistrationMapper.toPersistence(

                    registration

                )

            );

        return EventRegistrationMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<EventRegistration | null> {

        const document =

            await EventRegistrationModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return EventRegistrationMapper.toDomain(

            document

        );

    }

    async findByEventAndStudent(

        eventId: string,

        studentId: string

    ): Promise<EventRegistration | null> {

        const document =

            await EventRegistrationModel.findOne({

                eventId,

                studentId

            });

        if (!document) {

            return null;

        }

        return EventRegistrationMapper.toDomain(

            document

        );

    }

    async findByEvent(

        eventId: string

    ): Promise<EventRegistration[]> {

        const documents =

            await EventRegistrationModel.find({

                eventId

            })

                .sort({

                    registeredAt: -1

                });

        return documents.map(

            document =>

                EventRegistrationMapper.toDomain(
                    document
                )

        );

    }

    async findByStudent(

        studentId: string

    ): Promise<EventRegistration[]> {

        const documents =

            await EventRegistrationModel.find({

                studentId

            })

                .sort({

                    registeredAt: -1

                });

        return documents.map(

            document =>

                EventRegistrationMapper.toDomain(
                    document
                )

        );

    }

    async countByEvent(

        eventId: string

    ): Promise<number> {

        return EventRegistrationModel.countDocuments({

            eventId

        });

    }

    async save(

        registration: EventRegistration

    ): Promise<EventRegistration> {

        const document =

            await EventRegistrationModel.findByIdAndUpdate(

                registration.id,

                EventRegistrationMapper.toPersistence(

                    registration

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Event registration not found."

            );

        }

        return EventRegistrationMapper.toDomain(

            document

        );

    }

    async deleteByEvent(

        eventId: string,

        session?: ClientSession

    ): Promise<void> {

        await EventRegistrationModel.deleteMany({

            eventId

        }).session(

            session ?? null

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await EventRegistrationModel.findByIdAndDelete(

            id

        );

    }

}
