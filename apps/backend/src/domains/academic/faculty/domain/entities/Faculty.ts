import { IFaculty } from "../interfaces/IFaculty.js";

import { FacultyStatus } from "../constants/FacultyStatus.js";

export class Faculty {

    constructor(

        private readonly props: IFaculty

    ) {}

    static create(

        props: IFaculty

    ): Faculty {

        return new Faculty(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get departmentId(): string | undefined {
        return this.props.departmentId;
    }

    get employeeId(): string {
        return this.props.employeeId;
    }

    get designation(): string {
        return this.props.designation;
    }

    get specialization(): string | undefined {
        return this.props.specialization;
    }

    get status(): FacultyStatus {
        return this.props.status;
    }

    get joinedAt() {
        return this.props.joinedAt;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IFaculty> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            employeeId?: string;

            designation?: string;

            specialization?: string;

        }

    ): void {

        if (values.employeeId !== undefined) {

            this.props.employeeId =

                values.employeeId;

        }

        if (values.designation !== undefined) {

            this.props.designation =

                values.designation;

        }

        if (values.specialization !== undefined) {

            this.props.specialization =

                values.specialization;

        }

    }

    assignDepartment(

        departmentId: string

    ): void {

        this.props.departmentId =

            departmentId;

    }

    deactivate(): void {

        this.props.status =

            FacultyStatus.INACTIVE;

    }

}