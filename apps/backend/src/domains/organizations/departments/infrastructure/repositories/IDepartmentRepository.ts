import { Department } from "../../domain/entities/Department.js";
import { DepartmentStatus } from "../../domain/constants/DepartmentStatus.js";

export interface IDepartmentRepository {

    create(
        department: Department
    ): Promise<Department>;

    findById(
        id: string
    ): Promise<Department | null>;

    findByOrganization(
        organizationId: string
    ): Promise<Department[]>;

    findByCode(
        organizationId: string,
        code: string
    ): Promise<Department | null>;

    existsByCode(
        organizationId: string,
        code: string
    ): Promise<boolean>;

    updateHead(

        departmentId: string,

        headId: string

    ): Promise<void>;

    updateStatus(

        departmentId: string,

        status: DepartmentStatus

    ): Promise<void>;

}