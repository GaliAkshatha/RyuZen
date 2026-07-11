import { DomainEvent } from "./DomainEvent.js";

export interface IEventHandler<T extends DomainEvent> {

    handle(

        event: T

    ): Promise<void>;

}