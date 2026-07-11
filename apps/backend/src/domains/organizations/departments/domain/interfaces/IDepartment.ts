import { DepartmentStatus } from "../constants/DepartmentStatus.js";

export interface IDepartment {

    id?: string;

    organizationId: string;

    name: string;

    code: string;

    description?: string;

    headFacultyId?: string;

    status: DepartmentStatus;

    createdAt?: Date;

    updatedAt?: Date;

}