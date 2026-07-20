import { ICertification } from "../interfaces/ICertification.js";

export class Certification {

    constructor(

        private readonly props: ICertification

    ) {}

    static create(

        props: ICertification

    ): Certification {

        return new Certification(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get title(): string {
        return this.props.title;
    }

    get issuer(): string {
        return this.props.issuer;
    }

    get credentialId(): string | undefined {
        return this.props.credentialId;
    }

    get issueDate(): Date {
        return this.props.issueDate;
    }

    get expiryDate(): Date | undefined {
        return this.props.expiryDate;
    }

    get credentialUrl(): string | undefined {
        return this.props.credentialUrl;
    }

    get skills(): string[] {
        return [...this.props.skills];
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<ICertification> {
        return Object.freeze({

            ...this.props,

            skills: [...this.props.skills]

        });
    }

    updateDetails(

        values: {

            title?: string;

            issuer?: string;

            credentialId?: string;

            issueDate?: Date;

            expiryDate?: Date;

            credentialUrl?: string;

            skills?: string[];

        }

    ): void {

        if (values.title !== undefined) {

            this.props.title =

                values.title;

        }

        if (values.issuer !== undefined) {

            this.props.issuer =

                values.issuer;

        }

        if (values.credentialId !== undefined) {

            this.props.credentialId =

                values.credentialId;

        }

        if (values.issueDate !== undefined) {

            this.props.issueDate =

                values.issueDate;

        }

        if (values.expiryDate !== undefined) {

            this.props.expiryDate =

                values.expiryDate;

        }

        if (values.credentialUrl !== undefined) {

            this.props.credentialUrl =

                values.credentialUrl;

        }

        if (values.skills !== undefined) {

            this.props.skills =

                [...values.skills];

        }

    }

}
