import { IOrganizationSettings } from "../../domain/interfaces/IOrganizationSettings.js";

export interface UpdateOrganizationSettingsDto {

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
