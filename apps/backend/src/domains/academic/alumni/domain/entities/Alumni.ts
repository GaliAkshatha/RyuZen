import { IAlumni } from "../interfaces/IAlumni.js";

import { AlumniStatus } from "../constants/AlumniStatus.js";

export class Alumni {

    constructor(

        private readonly props: IAlumni

    ) {}

    static create(

        props: IAlumni

    ): Alumni {

        return new Alumni(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get userId(): string | undefined {
        return this.props.userId;
    }

    get email(): string {
        return this.props.email;
    }

    get name(): string | undefined {
        return this.props.name;
    }

    get graduationYear(): number | undefined {
        return this.props.graduationYear;
    }

    get company(): string | undefined {
        return this.props.company;
    }

    get designation(): string | undefined {
        return this.props.designation;
    }

    get isVerified(): boolean {
        return this.props.isVerified;
    }

    get status(): AlumniStatus {
        return this.props.status;
    }

    get inviteTokenHash(): string | undefined {
        return this.props.inviteTokenHash;
    }

    get inviteExpiresAt(): Date | undefined {
        return this.props.inviteExpiresAt;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IAlumni> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            graduationYear?: number;

            company?: string;

            designation?: string;

        }

    ): void {

        if (values.name !== undefined) {

            this.props.name =

                values.name;

        }

        if (values.graduationYear !== undefined) {

            this.props.graduationYear =

                values.graduationYear;

        }

        if (values.company !== undefined) {

            this.props.company =

                values.company;

        }

        if (values.designation !== undefined) {

            this.props.designation =

                values.designation;

        }

    }

    verify(): void {

        this.props.isVerified =

            true;

    }

}
