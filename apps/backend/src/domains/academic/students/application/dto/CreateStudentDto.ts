export interface CreateStudentDto {

    userId: string;

    departmentId?: string;

    usn: string;

    batch: string;

    semester?: number;

    cgpa?: number;

}
