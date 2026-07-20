import { IResume } from "../interfaces/IResume.js";

import { ResumeVisibility } from "../constants/ResumeVisibility.js";

export class Resume {

    constructor(

        private readonly props: IResume

    ) {}

    static create(

        props: IResume

    ): Resume {

        return new Resume(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get selectedTemplate(): string | undefined {
        return this.props.selectedTemplate;
    }

    get resumeUrl(): string | undefined {
        return this.props.resumeUrl;
    }

    get lastGeneratedAt(): Date | undefined {
        return this.props.lastGeneratedAt;
    }

    get atsScore(): number | undefined {
        return this.props.atsScore;
    }

    get visibility(): ResumeVisibility {
        return this.props.visibility;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IResume> {
        return Object.freeze({ ...this.props });
    }

    generate(

        values: {

            selectedTemplate: string;

            resumeUrl: string;

            atsScore: number;

        }

    ): void {

        this.props.selectedTemplate =

            values.selectedTemplate;

        this.props.resumeUrl =

            values.resumeUrl;

        this.props.atsScore =

            values.atsScore;

        this.props.lastGeneratedAt =

            new Date();

    }

    updateVisibility(

        visibility: ResumeVisibility

    ): void {

        this.props.visibility =

            visibility;

    }

}
