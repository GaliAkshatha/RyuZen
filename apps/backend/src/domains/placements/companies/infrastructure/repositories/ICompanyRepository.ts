import { Company } from "../../domain/entities/Company.js";

export interface ICompanyRepository {

    create(
        company: Company
    ): Promise<Company>;

    findById(
        id: string
    ): Promise<Company | null>;

    findByOrganization(
        organizationId: string
    ): Promise<Company[]>;

    existsByName(
        organizationId: string,
        name: string
    ): Promise<boolean>;

    save(
        company: Company
    ): Promise<Company>;

    delete(
        id: string
    ): Promise<void>;

}
