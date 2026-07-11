import { IOrganization } from "../interfaces/IOrganization.js";

import { OrganizationStatus } from "../constants/OrganizationStatus.js";

export class Organization {

    constructor(
        private readonly props: IOrganization
    ) {}

    get id(): string | undefined {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get code(): string {
        return this.props.code;
    }

    get logo(): string | undefined {
        return this.props.logo;
    }

    get website(): string | undefined {
        return this.props.website;
    }

    get emailDomains(): string[] {
        return [...this.props.emailDomains];
    }

    get registrationMethod() {
        return this.props.registrationMethod;
    }

    get organizationType() {
        return this.props.organizationType;
    }

    get subscriptionPlan() {
        return this.props.subscriptionPlan;
    }

    get status() {
        return this.props.status;
    }

    get settings() {
        return { ...this.props.settings };
    }

    toObject(): Readonly<IOrganization> {
        return Object.freeze({
            ...this.props,
            emailDomains: [...this.props.emailDomains],
            settings: { ...this.props.settings }
        });
    }

    updateDetails(

        values: {

            name?: string;

            logo?: string;

            website?: string;

            emailDomains?: string[];

            settings?: Partial<IOrganization["settings"]>;

        }

    ): void {

        if (values.name !== undefined) {

            this.props.name = values.name;

        }

        if (values.logo !== undefined) {

            this.props.logo = values.logo;

        }

        if (values.website !== undefined) {

            this.props.website = values.website;

        }

        if (values.emailDomains !== undefined) {

            this.props.emailDomains = [...values.emailDomains];

        }

        if (values.settings !== undefined) {

            this.props.settings = {

                ...this.props.settings,

                ...values.settings

            };

        }

    }

    updateStatus(

        status: OrganizationStatus

    ): void {

        this.props.status = status;

    }

}