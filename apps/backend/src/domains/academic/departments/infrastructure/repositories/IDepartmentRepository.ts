import { Department } from "../../domain/entities/Department.js";

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

    existsByCode(
        organizationId: string,
        code: string
    ): Promise<boolean>;

    save(
        department: Department
    ): Promise<Department>;

    delete(
        id: string
    ): Promise<void>;

}