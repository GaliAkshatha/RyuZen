import { EventRegistration } from "../../domain/entities/EventRegistration.js";

import { ClientSession } from "mongoose";

export interface IEventRegistrationRepository {

    create(
        registration: EventRegistration
    ): Promise<EventRegistration>;

    findById(
        id: string
    ): Promise<EventRegistration | null>;

    findByEventAndStudent(
        eventId: string,
        studentId: string
    ): Promise<EventRegistration | null>;

    findByEvent(
        eventId: string
    ): Promise<EventRegistration[]>;

    findByStudent(
        studentId: string
    ): Promise<EventRegistration[]>;

    countByEvent(
        eventId: string
    ): Promise<number>;

    save(
        registration: EventRegistration
    ): Promise<EventRegistration>;

    deleteByEvent(
        eventId: string,
        session?: ClientSession
    ): Promise<void>;

}
