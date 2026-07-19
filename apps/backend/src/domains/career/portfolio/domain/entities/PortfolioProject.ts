import { IPortfolioProject } from "../interfaces/IPortfolioProject.js";

export class PortfolioProject {

    constructor(

        private readonly props: IPortfolioProject

    ) {}

    static create(

        props: IPortfolioProject

    ): PortfolioProject {

        return new PortfolioProject(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get title(): string {
        return this.props.title;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get techStack(): string[] {
        return [...this.props.techStack];
    }

    get github(): string | undefined {
        return this.props.github;
    }

    get liveDemo(): string | undefined {
        return this.props.liveDemo;
    }

    get images(): string[] {
        return [...this.props.images];
    }

    get video(): string | undefined {
        return this.props.video;
    }

    get featured(): boolean {
        return this.props.featured;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IPortfolioProject> {
        return Object.freeze({

            ...this.props,

            techStack: [...this.props.techStack],

            images: [...this.props.images]

        });
    }

    updateDetails(

        values: {

            title?: string;

            description?: string;

            techStack?: string[];

            github?: string;

            liveDemo?: string;

            images?: string[];

            video?: string;

            featured?: boolean;

        }

    ): void {

        if (values.title !== undefined) {

            this.props.title =

                values.title;

        }

        if (values.description !== undefined) {

            this.props.description =

                values.description;

        }

        if (values.techStack !== undefined) {

            this.props.techStack =

                [...values.techStack];

        }

        if (values.github !== undefined) {

            this.props.github =

                values.github;

        }

        if (values.liveDemo !== undefined) {

            this.props.liveDemo =

                values.liveDemo;

        }

        if (values.images !== undefined) {

            this.props.images =

                [...values.images];

        }

        if (values.video !== undefined) {

            this.props.video =

                values.video;

        }

        if (values.featured !== undefined) {

            this.props.featured =

                values.featured;

        }

    }

}
