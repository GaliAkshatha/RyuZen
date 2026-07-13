import { Event } from "../../domain/entities/Event.js";

export interface EventFilters {

    clubId?: string;

    status?: string;

}

export interface IEventRepository {

    create(
        event: Event
    ): Promise<Event>;

    findById(
        id: string
    ): Promise<Event | null>;

    findByOrganization(
        organizationId: string,
        filters: EventFilters
    ): Promise<Event[]>;

    save(
        event: Event
    ): Promise<Event>;

    delete(
        id: string
    ): Promise<void>;

}
