import { DomainEvent } from "../../../../../shared/core/event/DomainEvent.js";

export class SubmissionReviewedEvent

implements DomainEvent {

    readonly eventName =

        "SubmissionReviewed";

    readonly occurredAt =

        new Date();

    constructor(

        public readonly submissionId: string,

        public readonly userId: string,

        public readonly points: number

    ) {}

}