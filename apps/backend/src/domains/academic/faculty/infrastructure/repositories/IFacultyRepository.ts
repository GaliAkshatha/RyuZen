import { Faculty } from "../../domain/entities/Faculty.js";

export interface FacultyFilters {

    departmentId?: string;

}

export interface IFacultyRepository {

    create(
        faculty: Faculty
    ): Promise<Faculty>;

    findById(
        id: string
    ): Promise<Faculty | null>;

    findByUserId(
        userId: string
    ): Promise<Faculty | null>;

    findByOrganization(
        organizationId: string,
        filters: FacultyFilters
    ): Promise<Faculty[]>;

    existsByUserId(
        userId: string
    ): Promise<boolean>;

    existsByEmployeeId(
        organizationId: string,
        employeeId: string
    ): Promise<boolean>;

    save(
        faculty: Faculty
    ): Promise<Faculty>;

}
