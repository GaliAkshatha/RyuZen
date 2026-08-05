import { IStudent } from "../interfaces/IStudent.js";

import { StudentStatus } from "../constants/StudentStatus.js";

export class Student {

    constructor(

        private readonly props: IStudent

    ) {}

    static create(

        props: IStudent

    ): Student {

        return new Student(props);

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

    get mentorId(): string | undefined {
        return this.props.mentorId;
    }

    get usn(): string {
        return this.props.usn;
    }

    get batch(): string {
        return this.props.batch;
    }

    get semester(): number {
        return this.props.semester;
    }

    get cgpa(): number | undefined {
        return this.props.cgpa;
    }

    get section(): string | undefined {
        return this.props.section;
    }

    get admissionYear(): number | undefined {
        return this.props.admissionYear;
    }

    get graduationYear(): number | undefined {
        return this.props.graduationYear;
    }

    get tenthPercentage(): number | undefined {
        return this.props.tenthPercentage;
    }

    get twelfthPercentage(): number | undefined {
        return this.props.twelfthPercentage;
    }

    get entranceRank(): number | undefined {
        return this.props.entranceRank;
    }

    get status(): StudentStatus {
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

    toObject(): Readonly<IStudent> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            usn?: string;

            batch?: string;

            cgpa?: number;

        }

    ): void {

        if (values.usn !== undefined) {

            this.props.usn =

                values.usn;

        }

        if (values.batch !== undefined) {

            this.props.batch =

                values.batch;

        }

        if (values.cgpa !== undefined) {

            this.props.cgpa =

                values.cgpa;

        }

    }

    assignMentor(

        facultyId: string

    ): void {

        this.props.mentorId =

            facultyId;

    }

    promoteSemester(): void {

        this.props.semester =

            this.props.semester + 1;

    }

    archive(): void {

        this.props.status =

            StudentStatus.ARCHIVED;

    }

}
