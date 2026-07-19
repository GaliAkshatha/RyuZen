import { IExperience } from "../interfaces/IExperience.js";

import { EmploymentType } from "../constants/EmploymentType.js";

export class Experience {

    constructor(

        private readonly props: IExperience

    ) {}

    static create(

        props: IExperience

    ): Experience {

        return new Experience(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get company(): string {
        return this.props.company;
    }

    get role(): string {
        return this.props.role;
    }

    get employmentType(): EmploymentType | undefined {
        return this.props.employmentType;
    }

    get location(): string | undefined {
        return this.props.location;
    }

    get startDate(): Date {
        return this.props.startDate;
    }

    get endDate(): Date | undefined {
        return this.props.endDate;
    }

    get currentlyWorking(): boolean {
        return this.props.currentlyWorking;
    }

    get description(): string | undefined {
        return this.props.description;
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

    toObject(): Readonly<IExperience> {
        return Object.freeze({

            ...this.props,

            skills: [...this.props.skills]

        });
    }

    updateDetails(

        values: {

            company?: string;

            role?: string;

            employmentType?: EmploymentType;

            location?: string;

            startDate?: Date;

            endDate?: Date;

            currentlyWorking?: boolean;

            description?: string;

            skills?: string[];

        }

    ): void {

        if (values.company !== undefined) {

            this.props.company =

                values.company;

        }

        if (values.role !== undefined) {

            this.props.role =

                values.role;

        }

        if (values.employmentType !== undefined) {

            this.props.employmentType =

                values.employmentType;

        }

        if (values.location !== undefined) {

            this.props.location =

                values.location;

        }

        if (values.startDate !== undefined) {

            this.props.startDate =

                values.startDate;

        }

        if (values.endDate !== undefined) {

            this.props.endDate =

                values.endDate;

        }

        if (values.currentlyWorking !== undefined) {

            this.props.currentlyWorking =

                values.currentlyWorking;

        }

        if (values.description !== undefined) {

            this.props.description =

                values.description;

        }

        if (values.skills !== undefined) {

            this.props.skills =

                [...values.skills];

        }

    }

}
