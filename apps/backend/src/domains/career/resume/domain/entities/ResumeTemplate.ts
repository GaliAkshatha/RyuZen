import { IResumeTemplate } from "../interfaces/IResumeTemplate.js";

export class ResumeTemplate {

    constructor(

        private readonly props: IResumeTemplate

    ) {}

    static create(

        props: IResumeTemplate

    ): ResumeTemplate {

        return new ResumeTemplate(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get thumbnail(): string | undefined {
        return this.props.thumbnail;
    }

    get templateFile(): string | undefined {
        return this.props.templateFile;
    }

    get premium(): boolean {
        return this.props.premium;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    toObject(): Readonly<IResumeTemplate> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            thumbnail?: string;

            templateFile?: string;

            premium?: boolean;

        }

    ): void {

        if (values.name !== undefined) {

            this.props.name =

                values.name;

        }

        if (values.thumbnail !== undefined) {

            this.props.thumbnail =

                values.thumbnail;

        }

        if (values.templateFile !== undefined) {

            this.props.templateFile =

                values.templateFile;

        }

        if (values.premium !== undefined) {

            this.props.premium =

                values.premium;

        }

    }

}
