import { IMentorship } from "../interfaces/IMentorship.js";

import { MentorshipStatus } from "../constants/MentorshipStatus.js";

export class Mentorship {

    constructor(

        private readonly props: IMentorship

    ) {}

    static create(

        props: IMentorship

    ): Mentorship {

        return new Mentorship(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get facultyId(): string {
        return this.props.facultyId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get assignedBy(): string {
        return this.props.assignedBy;
    }

    get assignedDate(): Date {
        return this.props.assignedDate;
    }

    get status(): MentorshipStatus {
        return this.props.status;
    }

    get remarks(): string | undefined {
        return this.props.remarks;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IMentorship> {
        return Object.freeze({ ...this.props });
    }

    updateRemarks(

        remarks: string

    ): void {

        this.props.remarks =

            remarks;

    }

    complete(): void {

        this.props.status =

            MentorshipStatus.COMPLETED;

    }

    cancel(): void {

        this.props.status =

            MentorshipStatus.CANCELLED;

    }

}
