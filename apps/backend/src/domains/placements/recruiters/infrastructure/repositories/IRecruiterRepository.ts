import { Recruiter } from "../../domain/entities/Recruiter.js";

export interface IRecruiterRepository {

    create(
        recruiter: Recruiter
    ): Promise<Recruiter>;

    findById(
        id: string
    ): Promise<Recruiter | null>;

    findByUserId(
        userId: string
    ): Promise<Recruiter | null>;

    existsByUserId(
        userId: string
    ): Promise<boolean>;

    findByCompany(
        organizationId: string,
        companyId: string
    ): Promise<Recruiter[]>;

    save(
        recruiter: Recruiter
    ): Promise<Recruiter>;

}
