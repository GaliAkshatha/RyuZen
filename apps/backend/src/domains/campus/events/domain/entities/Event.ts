import { IEvent } from "../interfaces/IEvent.js";

import { EventStatus } from "../constants/EventStatus.js";

export class Event {

    constructor(

        private readonly props: IEvent

    ) {}

    static create(

        props: IEvent

    ): Event {

        return new Event(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get clubId(): string | undefined {
        return this.props.clubId;
    }

    get createdBy(): string {
        return this.props.createdBy;
    }

    get title(): string {
        return this.props.title;
    }

    get description(): string {
        return this.props.description;
    }

    get venue(): string | undefined {
        return this.props.venue;
    }

    get startDate(): Date {
        return this.props.startDate;
    }

    get endDate(): Date {
        return this.props.endDate;
    }

    get registrationDeadline(): Date | undefined {
        return this.props.registrationDeadline;
    }

    get capacity(): number | undefined {
        return this.props.capacity;
    }

    get points(): number {
        return this.props.points;
    }

    get certificateEnabled(): boolean {
        return this.props.certificateEnabled;
    }

    get status(): EventStatus {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IEvent> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            title?: string;

            description?: string;

            venue?: string;

            startDate?: Date;

            endDate?: Date;

            registrationDeadline?: Date;

            capacity?: number;

            points?: number;

            certificateEnabled?: boolean;

        }

    ): void {

        if (values.title !== undefined) {

            this.props.title =

                values.title;

        }

        if (values.description !== undefined) {

            this.props.description =

                values.description;

        }

        if (values.venue !== undefined) {

            this.props.venue =

                values.venue;

        }

        if (values.startDate !== undefined) {

            this.props.startDate =

                values.startDate;

        }

        if (values.endDate !== undefined) {

            this.props.endDate =

                values.endDate;

        }

        if (values.registrationDeadline !== undefined) {

            this.props.registrationDeadline =

                values.registrationDeadline;

        }

        if (values.capacity !== undefined) {

            this.props.capacity =

                values.capacity;

        }

        if (values.points !== undefined) {

            this.props.points =

                values.points;

        }

        if (values.certificateEnabled !== undefined) {

            this.props.certificateEnabled =

                values.certificateEnabled;

        }

    }

    publish(): void {

        if (this.props.status !== EventStatus.DRAFT) {

            throw new Error(

                "Only draft events can be published."

            );

        }

        this.props.status =

            EventStatus.PUBLISHED;

    }

}
