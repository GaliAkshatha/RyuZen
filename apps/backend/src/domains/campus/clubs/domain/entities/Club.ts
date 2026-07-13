import { IClub } from "../interfaces/IClub.js";

export class Club {

    constructor(

        private readonly props: IClub

    ) {}

    static create(

        props: IClub

    ): Club {

        return new Club(props);

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

    get logo(): string | undefined {
        return this.props.logo;
    }

    get facultyAdvisorId(): string | undefined {
        return this.props.facultyAdvisorId;
    }

    get presidentStudentId(): string | undefined {
        return this.props.presidentStudentId;
    }

    get vicePresidentStudentId(): string | undefined {
        return this.props.vicePresidentStudentId;
    }

    get status(): IClub["status"] {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IClub> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            description?: string;

            logo?: string;

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

        if (values.logo !== undefined) {

            this.props.logo =

                values.logo;

        }

    }

    assignAdvisor(

        facultyId: string

    ): void {

        this.props.facultyAdvisorId =

            facultyId;

    }

    setPresident(

        studentId: string | undefined

    ): void {

        this.props.presidentStudentId =

            studentId;

    }

    setVicePresident(

        studentId: string | undefined

    ): void {

        this.props.vicePresidentStudentId =

            studentId;

    }

}
