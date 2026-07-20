import { IPlacementDrive } from "../interfaces/IPlacementDrive.js";

import { PlacementDriveStatus } from "../constants/PlacementDriveStatus.js";

export class PlacementDrive {

    constructor(

        private readonly props: IPlacementDrive

    ) {}

    static create(

        props: IPlacementDrive

    ): PlacementDrive {

        return new PlacementDrive(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get companyId(): string {
        return this.props.companyId;
    }

    get title(): string {
        return this.props.title;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get package(): string | undefined {
        return this.props.package;
    }

    get location(): string | undefined {
        return this.props.location;
    }

    get eligibility(): string | undefined {
        return this.props.eligibility;
    }

    get deadline(): Date | undefined {
        return this.props.deadline;
    }

    get status(): PlacementDriveStatus {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IPlacementDrive> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            title?: string;

            description?: string;

            package?: string;

            location?: string;

            eligibility?: string;

            deadline?: Date;

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

        if (values.package !== undefined) {

            this.props.package =

                values.package;

        }

        if (values.location !== undefined) {

            this.props.location =

                values.location;

        }

        if (values.eligibility !== undefined) {

            this.props.eligibility =

                values.eligibility;

        }

        if (values.deadline !== undefined) {

            this.props.deadline =

                values.deadline;

        }

    }

    publish(): void {

        if (this.props.status !== PlacementDriveStatus.DRAFT) {

            throw new Error(

                "Only draft placement drives can be published."

            );

        }

        this.props.status =

            PlacementDriveStatus.PUBLISHED;

    }

    close(): void {

        this.props.status =

            PlacementDriveStatus.CLOSED;

    }

}
