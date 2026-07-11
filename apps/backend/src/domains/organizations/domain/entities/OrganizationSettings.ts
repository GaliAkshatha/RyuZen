import { IOrganizationSettings } from "../interfaces/IOrganizationSettings.js";

export class OrganizationSettings {

    constructor(
        private readonly props: IOrganizationSettings
    ) {}

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get branding() {
        return { ...this.props.branding };
    }

    get registration() {
        return { ...this.props.registration };
    }

    get security() {
        return {
            ...this.props.security,
            ipWhitelist: [...this.props.security.ipWhitelist]
        };
    }

    get academic() {
        return { ...this.props.academic };
    }

    get activities() {
        return { ...this.props.activities };
    }

    get events() {
        return { ...this.props.events };
    }

    get clubs() {
        return { ...this.props.clubs };
    }

    get placements() {
        return { ...this.props.placements };
    }

    get careerSystem() {
        return { ...this.props.careerSystem };
    }

    get ai() {
        return { ...this.props.ai };
    }

    get notifications() {
        return { ...this.props.notifications };
    }

    get chat() {
        return { ...this.props.chat };
    }

    get analytics() {
        return { ...this.props.analytics };
    }

    get leaderboard() {
        return { ...this.props.leaderboard };
    }

    get certificates() {
        return { ...this.props.certificates };
    }

    get fileStorage() {
        return { ...this.props.fileStorage };
    }

    get integrations() {
        return { ...this.props.integrations };
    }

    get audit() {
        return { ...this.props.audit };
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    toObject(): Readonly<IOrganizationSettings> {
        return Object.freeze({
            ...this.props,
            security: {
                ...this.props.security,
                ipWhitelist: [...this.props.security.ipWhitelist]
            }
        });
    }

    updateSettings(

        values: {

            branding?: Partial<IOrganizationSettings["branding"]>;

            registration?: Partial<IOrganizationSettings["registration"]>;

            security?: Partial<IOrganizationSettings["security"]>;

            academic?: Partial<IOrganizationSettings["academic"]>;

            activities?: Partial<IOrganizationSettings["activities"]>;

            events?: Partial<IOrganizationSettings["events"]>;

            clubs?: Partial<IOrganizationSettings["clubs"]>;

            placements?: Partial<IOrganizationSettings["placements"]>;

            careerSystem?: Partial<IOrganizationSettings["careerSystem"]>;

            ai?: Partial<IOrganizationSettings["ai"]>;

            notifications?: Partial<IOrganizationSettings["notifications"]>;

            chat?: Partial<IOrganizationSettings["chat"]>;

            analytics?: Partial<IOrganizationSettings["analytics"]>;

            leaderboard?: Partial<IOrganizationSettings["leaderboard"]>;

            certificates?: Partial<IOrganizationSettings["certificates"]>;

            fileStorage?: Partial<IOrganizationSettings["fileStorage"]>;

            integrations?: Partial<IOrganizationSettings["integrations"]>;

            audit?: Partial<IOrganizationSettings["audit"]>;

        }

    ): void {

        if (values.branding !== undefined) {

            this.props.branding = {
                ...this.props.branding,
                ...values.branding
            };

        }

        if (values.registration !== undefined) {

            this.props.registration = {
                ...this.props.registration,
                ...values.registration
            };

        }

        if (values.security !== undefined) {

            this.props.security = {
                ...this.props.security,
                ...values.security,
                ipWhitelist:
                    values.security.ipWhitelist !== undefined
                        ? [...values.security.ipWhitelist]
                        : this.props.security.ipWhitelist
            };

        }

        if (values.academic !== undefined) {

            this.props.academic = {
                ...this.props.academic,
                ...values.academic
            };

        }

        if (values.activities !== undefined) {

            this.props.activities = {
                ...this.props.activities,
                ...values.activities
            };

        }

        if (values.events !== undefined) {

            this.props.events = {
                ...this.props.events,
                ...values.events
            };

        }

        if (values.clubs !== undefined) {

            this.props.clubs = {
                ...this.props.clubs,
                ...values.clubs
            };

        }

        if (values.placements !== undefined) {

            this.props.placements = {
                ...this.props.placements,
                ...values.placements
            };

        }

        if (values.careerSystem !== undefined) {

            this.props.careerSystem = {
                ...this.props.careerSystem,
                ...values.careerSystem
            };

        }

        if (values.ai !== undefined) {

            this.props.ai = {
                ...this.props.ai,
                ...values.ai
            };

        }

        if (values.notifications !== undefined) {

            this.props.notifications = {
                ...this.props.notifications,
                ...values.notifications
            };

        }

        if (values.chat !== undefined) {

            this.props.chat = {
                ...this.props.chat,
                ...values.chat
            };

        }

        if (values.analytics !== undefined) {

            this.props.analytics = {
                ...this.props.analytics,
                ...values.analytics
            };

        }

        if (values.leaderboard !== undefined) {

            this.props.leaderboard = {
                ...this.props.leaderboard,
                ...values.leaderboard
            };

        }

        if (values.certificates !== undefined) {

            this.props.certificates = {
                ...this.props.certificates,
                ...values.certificates
            };

        }

        if (values.fileStorage !== undefined) {

            this.props.fileStorage = {
                ...this.props.fileStorage,
                ...values.fileStorage
            };

        }

        if (values.integrations !== undefined) {

            this.props.integrations = {
                ...this.props.integrations,
                ...values.integrations
            };

        }

        if (values.audit !== undefined) {

            this.props.audit = {
                ...this.props.audit,
                ...values.audit
            };

        }

    }

}