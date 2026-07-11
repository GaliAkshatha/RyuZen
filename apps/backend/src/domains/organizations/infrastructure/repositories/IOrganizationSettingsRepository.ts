import { OrganizationSettings } from "../../domain/entities/OrganizationSettings.js";

export interface IOrganizationSettingsRepository {

    findByOrganizationId(
        organizationId: string
    ): Promise<OrganizationSettings | null>;

    createDefault(
        organizationId: string
    ): Promise<OrganizationSettings>;

    save(
        settings: OrganizationSettings
    ): Promise<OrganizationSettings>;

}
