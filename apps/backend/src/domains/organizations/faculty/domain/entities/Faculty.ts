import { IFaculty } from "../interfaces/IFaculty.js";

export class Faculty {

    constructor(
        private readonly props: IFaculty
    ) {}

    get id() {
        return this.props.id;
    }

    get userId() {
        return this.props.userId;
    }

    get organizationId() {
        return this.props.organizationId;
    }

    get departmentId() {
        return this.props.departmentId;
    }

    get employeeId() {
        return this.props.employeeId;
    }

    get designation() {
        return this.props.designation;
    }

    get joiningDate() {
        return this.props.joiningDate;
    }

    get status() {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IFaculty> {

        return Object.freeze({

            ...this.props

        });

    }

}