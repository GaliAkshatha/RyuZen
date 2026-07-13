import { IDepartment } from "../interfaces/IDepartment.js";

export class Department {

    constructor(

        private readonly props: IDepartment

    ) {}

    static create(

        props: IDepartment

    ): Department {

        return new Department(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get name(): string {
        return this.props.name;
    }

    get code(): string {
        return this.props.code;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get headOfDepartmentId(): string | undefined {
        return this.props.headOfDepartmentId;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IDepartment> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            description?: string;

        }

    ): void {

        if (values.name !== undefined) {

            this.props.name =

                values.name;

        }

        if (values.description !== undefined) {

            this.props.description =

                values.description;

        }

    }

    assignHeadOfDepartment(

        userId: string

    ): void {

        this.props.headOfDepartmentId =

            userId;

    }

}