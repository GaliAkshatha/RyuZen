import { IOrganization } from "../../domain/interfaces/IOrganization.js";

export interface UpdateOrganizationDto {

    name?: string;

    logo?: string;

    website?: string;

    emailDomains?: string[];

    settings?: Partial<IOrganization["settings"]>;

}