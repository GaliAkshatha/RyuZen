import { FacultyDesignation } from "../../domain/constants/FacultyDesignation.js";

export interface CreateFacultyDto {

    organizationId: string;

    departmentId: string;

    name: string;

    email: string;

    password: string;

    employeeId: string;

    designation: FacultyDesignation;

    joiningDate: Date;

}