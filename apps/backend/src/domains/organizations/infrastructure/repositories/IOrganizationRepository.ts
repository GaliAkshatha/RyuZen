import { Organization } from "../../domain/entities/Organization.js";

export interface IOrganizationRepository {

    create(
        organization: Partial<Organization>
    ): Promise<Organization>;

    findById(
        id: string
    ): Promise<Organization | null>;

    findByCode(
        code: string
    ): Promise<Organization | null>;

    findAll(): Promise<Organization[]>;

    save(
        organization: Organization
    ): Promise<Organization>;

    existsByCode(
        code: string
    ): Promise<boolean>;

}