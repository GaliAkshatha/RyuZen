import { StudentBadge } from "../../domain/entities/StudentBadge.js";

export interface IStudentBadgeRepository {

    create(
        studentBadge: StudentBadge
    ): Promise<StudentBadge>;

    findByStudent(
        studentId: string
    ): Promise<StudentBadge[]>;

    existsByStudentAndBadge(
        studentId: string,
        badgeId: string
    ): Promise<boolean>;

}
