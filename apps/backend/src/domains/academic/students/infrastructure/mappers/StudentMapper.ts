import { Student } from "../../domain/entities/Student.js";

import { StudentStatus } from "../../domain/constants/StudentStatus.js";

import {
    StudentDocument
} from "../persistence/StudentModel.js";

export class StudentMapper {

    static toDomain(

        document: StudentDocument

    ): Student {

        return Student.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            userId:
                document.userId.toString(),

            departmentId:
                document.departmentId?.toString(),

            mentorId:
                document.mentorId?.toString(),

            usn:
                document.usn,

            batch:
                document.batch,

            semester:
                document.semester,

            cgpa:
                document.cgpa,

            status:
                document.status as StudentStatus,

            joinedAt:
                document.joinedAt,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        student: Student

    ) {

        const data =
            student.toObject();

        return {

            organizationId:
                data.organizationId,

            userId:
                data.userId,

            departmentId:
                data.departmentId,

            mentorId:
                data.mentorId,

            usn:
                data.usn,

            batch:
                data.batch,

            semester:
                data.semester,

            cgpa:
                data.cgpa,

            status:
                data.status,

            joinedAt:
                data.joinedAt

        };

    }

}
