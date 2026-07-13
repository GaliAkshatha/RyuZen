import { Student } from "../../domain/entities/Student.js";

import { StudentResponseDto } from "../../application/dto/StudentResponseDto.js";

export class StudentResponseMapper {

    static toDto(

        student: Student

    ): StudentResponseDto {

        return {

            id:
                student.id!,

            organizationId:
                student.organizationId,

            userId:
                student.userId,

            departmentId:
                student.departmentId,

            mentorId:
                student.mentorId,

            usn:
                student.usn,

            batch:
                student.batch,

            semester:
                student.semester,

            cgpa:
                student.cgpa,

            status:
                student.status,

            joinedAt:
                student.joinedAt,

            createdAt:
                student.createdAt,

            updatedAt:
                student.updatedAt

        };

    }

}
