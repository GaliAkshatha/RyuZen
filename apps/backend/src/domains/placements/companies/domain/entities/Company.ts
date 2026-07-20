import { ICompany } from "../interfaces/ICompany.js";

import { CompanyStatus } from "../constants/CompanyStatus.js";

export class Company {

    constructor(

        private readonly props: ICompany

    ) {}

    static create(

        props: ICompany

    ): Company {

        return new Company(props);

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

    get logo(): string | undefined {
        return this.props.logo;
    }

    get website(): string | undefined {
        return this.props.website;
    }

    get description(): string | undefined {
        return this.props.description;
    }

    get hrName(): string | undefined {
        return this.props.hrName;
    }

    get hrEmail(): string | undefined {
        return this.props.hrEmail;
    }

    get status(): CompanyStatus {
        return this.props.status;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<ICompany> {
        return Object.freeze({ ...this.props });
    }

    updateDetails(

        values: {

            name?: string;

            logo?: string;

            website?: string;

            description?: string;

            hrName?: string;

            hrEmail?: string;

        }

    ): void {

        if (values.name !== undefined) {

            this.props.name =

                values.name;

        }

        if (values.logo !== undefined) {

            this.props.logo =

                values.logo;

        }

        if (values.website !== undefined) {

            this.props.website =

                values.website;

        }

        if (values.description !== undefined) {

            this.props.description =

                values.description;

        }

        if (values.hrName !== undefined) {

            this.props.hrName =

                values.hrName;

        }

        if (values.hrEmail !== undefined) {

            this.props.hrEmail =

                values.hrEmail;

        }

    }

    updateStatus(

        status: CompanyStatus

    ): void {

        this.props.status =

            status;

    }

}
