import { Faculty } from "../../domain/entities/Faculty.js";

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

    findByDepartment(
        departmentId: string
    ): Promise<Faculty[]>;

    existsByEmployeeId(
        organizationId: string,
        employeeId: string
    ): Promise<boolean>;

}