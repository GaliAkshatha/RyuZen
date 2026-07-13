import { FacultyStatus } from "../../domain/constants/FacultyStatus.js";

export interface FacultyResponseDto {

    id: string;

    organizationId: string;

    userId: string;

    departmentId?: string;

    employeeId: string;

    designation: string;

    specialization?: string;

    status: FacultyStatus;

    joinedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
