import { FacultyStatus } from "../constants/FacultyStatus.js";

export interface IFaculty {

    id?: string;

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