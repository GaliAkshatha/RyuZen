import { CompanyStatus } from "../constants/CompanyStatus.js";

export interface ICompany {

    id?: string;

    organizationId: string;

    name: string;

    logo?: string;

    website?: string;

    description?: string;

    hrName?: string;

    hrEmail?: string;

    status: CompanyStatus;

    createdAt?: Date;

    updatedAt?: Date;

}
