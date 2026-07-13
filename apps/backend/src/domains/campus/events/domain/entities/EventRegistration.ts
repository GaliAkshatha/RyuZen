import { IEventRegistration } from "../interfaces/IEventRegistration.js";

export class EventRegistration {

    constructor(

        private readonly props: IEventRegistration

    ) {}

    static create(

        props: IEventRegistration

    ): EventRegistration {

        return new EventRegistration(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get eventId(): string {
        return this.props.eventId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get attendance(): boolean {
        return this.props.attendance;
    }

    get feedback(): string | undefined {
        return this.props.feedback;
    }

    get certificateIssued(): boolean {
        return this.props.certificateIssued;
    }

    get registeredAt(): Date {
        return this.props.registeredAt;
    }

    toObject(): Readonly<IEventRegistration> {
        return Object.freeze({ ...this.props });
    }

    markAttendance(

        attended: boolean

    ): void {

        this.props.attendance =

            attended;

    }

    submitFeedback(

        feedback: string

    ): void {

        this.props.feedback =

            feedback;

    }

    issueCertificate(): void {

        this.props.certificateIssued =

            true;

    }

}
