export interface CreateStudentDto {

    userId: string;

    departmentId?: string;

    usn: string;

    batch: string;

    semester?: number;

    cgpa?: number;

    section?: string;

    admissionYear?: number;

    graduationYear?: number;

    tenthPercentage?: number;

    twelfthPercentage?: number;

    entranceRank?: number;

}
