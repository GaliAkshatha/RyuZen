import { IOrganization } from "../interfaces/IOrganization.js";

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

}