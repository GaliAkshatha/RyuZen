import { Alumni } from "../../domain/entities/Alumni.js";

export interface AlumniFilters {

    status?: string;

    isVerified?: boolean;

    graduationYear?: number;

}

export interface IAlumniRepository {

    create(
        alumni: Alumni
    ): Promise<Alumni>;

    findById(
        id: string,
        options?: {
            includeInviteToken?: boolean;
        }
    ): Promise<Alumni | null>;

    findByEmail(
        organizationId: string,
        email: string,
        options?: {
            includeInviteToken?: boolean;
        }
    ): Promise<Alumni | null>;

    findByUserId(
        userId: string
    ): Promise<Alumni | null>;

    findByOrganization(
        organizationId: string,
        filters: AlumniFilters
    ): Promise<Alumni[]>;

    existsByUserId(
        userId: string
    ): Promise<boolean>;

    existsByEmail(
        organizationId: string,
        email: string
    ): Promise<boolean>;

    save(
        alumni: Alumni
    ): Promise<Alumni>;

}
