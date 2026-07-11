import { FacultyDesignation } from "../constants/FacultyDesignation.js";
import { FacultyStatus } from "../constants/FacultyStatus.js";

export interface IFaculty {

    id?: string;

    userId: string;

    organizationId: string;

    departmentId: string;

    employeeId: string;

    designation: FacultyDesignation;

    joiningDate: Date;

    status: FacultyStatus;

    createdAt?: Date;

    updatedAt?: Date;

}