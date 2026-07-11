import { DepartmentStatus } from "../../domain/constants/DepartmentStatus.js";

export interface DepartmentResponseDto {

    id: string;

    organizationId: string;

    name: string;

    code: string;

    description?: string;

    headId?: string;

    status: DepartmentStatus;

}