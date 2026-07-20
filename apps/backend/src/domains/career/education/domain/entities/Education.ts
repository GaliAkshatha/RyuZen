import { IEducation } from "../interfaces/IEducation.js";

export class Education {

    constructor(

        private readonly props: IEducation

    ) {}

    static create(

        props: IEducation

    ): Education {

        return new Education(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get institution(): string {
        return this.props.institution;
    }

    get degree(): string {
        return this.props.degree;
    }

    get branch(): string | undefined {
        return this.props.branch;
    }

    get cgpa(): number | undefined {
        return this.props.cgpa;
    }

    get startYear(): number {
        return this.props.startYear;
    }

    get endYear(): number | undefined {
        return this.props.endYear;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IEducation> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            institution?: string;

            degree?: string;

            branch?: string;

            cgpa?: number;

            startYear?: number;

            endYear?: number;

        }

    ): void {

        if (values.institution !== undefined) {

            this.props.institution =

                values.institution;

        }

        if (values.degree !== undefined) {

            this.props.degree =

                values.degree;

        }

        if (values.branch !== undefined) {

            this.props.branch =

                values.branch;

        }

        if (values.cgpa !== undefined) {

            this.props.cgpa =

                values.cgpa;

        }

        if (values.startYear !== undefined) {

            this.props.startYear =

                values.startYear;

        }

        if (values.endYear !== undefined) {

            this.props.endYear =

                values.endYear;

        }

    }

}
