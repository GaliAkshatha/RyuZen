import { IGrowthEvent } from "./IGrowthEvent.js";

/**
 * Infrastructure, not a domain - this class carries no business rules
 * of its own (no "should this count", no scoring policy). It only
 * ever records what a real domain's own use case already decided
 * happened. That decision-making stays entirely in the emitting
 * domain (ReviewSubmissionUseCase decides whether an approval is
 * genuine; this just records that it was).
 *
 * Deliberately has no update/delete anywhere in its repository
 * interface (see IGrowthEventRepository.ts) - an append-only timeline,
 * same immutability discipline as PointLedgerEntry and AuditLog.
 */
export class GrowthEvent {

    constructor(

        private readonly props: IGrowthEvent

    ) {}

    static record(

        props: Omit<IGrowthEvent, "occurredAt">

    ): GrowthEvent {

        return new GrowthEvent({

            ...props,

            occurredAt: new Date()

        });

    }

    static fromPersisted(

        props: IGrowthEvent

    ): GrowthEvent {

        return new GrowthEvent(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get domain(): string {
        return this.props.domain;
    }

    get eventType(): string {
        return this.props.eventType;
    }

    get evidence() {
        return this.props.evidence;
    }

    get verifiedBy(): string {
        return this.props.verifiedBy;
    }

    get contributionWeight(): number {
        return this.props.contributionWeight;
    }

    get occurredAt(): Date {
        return this.props.occurredAt;
    }

    toObject(): Readonly<IGrowthEvent> {
        return Object.freeze({ ...this.props });
    }

}
