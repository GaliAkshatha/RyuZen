import { IUserPortfolio } from "../interfaces/IUserPortfolio.js";

import { PortfolioVisibility } from "../constants/PortfolioVisibility.js";

export class UserPortfolio {

    constructor(

        private readonly props: IUserPortfolio

    ) {}

    static create(

        props: IUserPortfolio

    ): UserPortfolio {

        return new UserPortfolio(props);

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get headline(): string | undefined {
        return this.props.headline;
    }

    get summary(): string | undefined {
        return this.props.summary;
    }

    get github(): string | undefined {
        return this.props.github;
    }

    get linkedin(): string | undefined {
        return this.props.linkedin;
    }

    get leetcode(): string | undefined {
        return this.props.leetcode;
    }

    get codeforces(): string | undefined {
        return this.props.codeforces;
    }

    get portfolio(): string | undefined {
        return this.props.portfolio;
    }

    get behance(): string | undefined {
        return this.props.behance;
    }

    get dribbble(): string | undefined {
        return this.props.dribbble;
    }

    get website(): string | undefined {
        return this.props.website;
    }

    get visibility(): PortfolioVisibility {
        return this.props.visibility;
    }

    get theme(): string | undefined {
        return this.props.theme;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IUserPortfolio> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            headline?: string;

            summary?: string;

            github?: string;

            linkedin?: string;

            leetcode?: string;

            codeforces?: string;

            portfolio?: string;

            behance?: string;

            dribbble?: string;

            website?: string;

            visibility?: PortfolioVisibility;

            theme?: string;

        }

    ): void {

        if (values.headline !== undefined) {

            this.props.headline =

                values.headline;

        }

        if (values.summary !== undefined) {

            this.props.summary =

                values.summary;

        }

        if (values.github !== undefined) {

            this.props.github =

                values.github;

        }

        if (values.linkedin !== undefined) {

            this.props.linkedin =

                values.linkedin;

        }

        if (values.leetcode !== undefined) {

            this.props.leetcode =

                values.leetcode;

        }

        if (values.codeforces !== undefined) {

            this.props.codeforces =

                values.codeforces;

        }

        if (values.portfolio !== undefined) {

            this.props.portfolio =

                values.portfolio;

        }

        if (values.behance !== undefined) {

            this.props.behance =

                values.behance;

        }

        if (values.dribbble !== undefined) {

            this.props.dribbble =

                values.dribbble;

        }

        if (values.website !== undefined) {

            this.props.website =

                values.website;

        }

        if (values.visibility !== undefined) {

            this.props.visibility =

                values.visibility;

        }

        if (values.theme !== undefined) {

            this.props.theme =

                values.theme;

        }

    }

}
