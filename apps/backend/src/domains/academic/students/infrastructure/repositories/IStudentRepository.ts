import { Student } from "../../domain/entities/Student.js";

export interface StudentFilters {

    departmentId?: string;

    batch?: string;

    semester?: number;

}

export interface IStudentRepository {

    create(
        student: Student
    ): Promise<Student>;

    findById(
        id: string
    ): Promise<Student | null>;

    findByUserId(
        userId: string
    ): Promise<Student | null>;

    findByOrganization(
        organizationId: string,
        filters: StudentFilters
    ): Promise<Student[]>;

    existsByUserId(
        userId: string
    ): Promise<boolean>;

    existsByUsn(
        organizationId: string,
        usn: string
    ): Promise<boolean>;

    save(
        student: Student
    ): Promise<Student>;

}
