import { IBadge } from "../interfaces/IBadge.js";

export class Badge {

    constructor(

        private readonly props: IBadge

    ) {}

    static create(

        props: IBadge

    ): Badge {

        return new Badge(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get icon(): string | undefined {
        return this.props.icon;
    }

    get criteria(): string | undefined {
        return this.props.criteria;
    }

    get points(): number {
        return this.props.points;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IBadge> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            description?: string;

            icon?: string;

            criteria?: string;

            points?: number;

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

        if (values.icon !== undefined) {

            this.props.icon =

                values.icon;

        }

        if (values.criteria !== undefined) {

            this.props.criteria =

                values.criteria;

        }

        if (values.points !== undefined) {

            this.props.points =

                values.points;

        }

    }

}
