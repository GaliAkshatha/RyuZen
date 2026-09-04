import { StudentStatus } from "../../domain/constants/StudentStatus.js";

export interface StudentResponseDto {

    id: string;

    organizationId: string;

    userId: string;

    departmentId?: string;

    mentorId?: string;

    usn: string;

    batch: string;

    section?: string;

    semester: number;

    cgpa?: number;

    status: StudentStatus;

    /** The real User account's login-access status (ACTIVE/SUSPENDED/ARCHIVED) - a genuinely different concern from `status` above (enrollment record status). Populated by GetStudentUseCase. */
    userStatus?: string;

    permissions?: string[];

    joinedAt?: Date;

    createdAt?: Date;

    updatedAt?: Date;

}
