import { CompanyStatus } from "../../domain/constants/CompanyStatus.js";

export interface CompanyResponseDto {

    id: string;

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
