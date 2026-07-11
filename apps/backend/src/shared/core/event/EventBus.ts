import { DomainEvent } from "./DomainEvent.js";

import { IEventHandler } from "./IEventHandler.js";

export class EventBus {

    private readonly handlers =

        new Map<

            string,

            IEventHandler<DomainEvent>[]

        >();

    subscribe<T extends DomainEvent>(

        eventName: string,

        handler: IEventHandler<T>

    ): void {

        const handlers =

            (this.handlers.get(eventName) ??

                []) as IEventHandler<T>[];

        handlers.push(handler);

        this.handlers.set(

            eventName,

            handlers as IEventHandler<DomainEvent>[]

        );

    }

    async publish(

        event: DomainEvent

    ): Promise<void> {

        const handlers =

            this.handlers.get(

                event.eventName

            ) ?? [];

        for (

            const handler of handlers

        ) {

            await handler.handle(event);

        }

    }

}