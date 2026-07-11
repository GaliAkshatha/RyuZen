import { IDepartment } from "../interfaces/IDepartment.js";

export class Department {

    constructor(
        private readonly props: IDepartment
    ) {}

    get id() {
        return this.props.id;
    }

    get organizationId() {
        return this.props.organizationId;
    }

    get name() {
        return this.props.name;
    }

    get code() {
        return this.props.code;
    }

    get description() {
        return this.props.description;
    }

    get headFacultyId() {
        return this.props.headFacultyId;
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

    toObject(): Readonly<IDepartment> {

        return Object.freeze({

            ...this.props

        });

    }

}