import { FacultyDesignation } from "../../domain/constants/FacultyDesignation.js";
import { FacultyStatus } from "../../domain/constants/FacultyStatus.js";

export interface FacultyResponseDto {

    id: string;

    userId: string;

    organizationId: string;

    departmentId: string;

    name: string;

    email: string;

    employeeId: string;

    designation: FacultyDesignation;

    joiningDate: Date;

    status: FacultyStatus;

}