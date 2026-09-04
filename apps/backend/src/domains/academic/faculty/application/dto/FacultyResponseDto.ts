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

    /** The real User account's login-access status (ACTIVE/SUSPENDED/ARCHIVED) - a genuinely different concern from `status` above (employment record status). Populated by GetFacultyUseCase. */
    userStatus?: string;

    permissions?: string[];

    joinedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
