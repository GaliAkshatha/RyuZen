import { ICertificate } from "../interfaces/ICertificate.js";

export class Certificate {

    constructor(

        private readonly props: ICertificate

    ) {}

    static create(

        props: ICertificate

    ): Certificate {

        return new Certificate(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get eventId(): string | undefined {
        return this.props.eventId;
    }

    get activityId(): string | undefined {
        return this.props.activityId;
    }

    get certificateUrl(): string {
        return this.props.certificateUrl;
    }

    get issuedAt(): Date {
        return this.props.issuedAt;
    }

    toObject(): Readonly<ICertificate> {
        return Object.freeze({ ...this.props });
    }

}
