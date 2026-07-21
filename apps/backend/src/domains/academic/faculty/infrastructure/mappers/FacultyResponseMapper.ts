import { Faculty } from "../../domain/entities/Faculty.js";

import { FacultyResponseDto } from "../../application/dto/FacultyResponseDto.js";

export class FacultyResponseMapper {

    static toDto(

        faculty: Faculty

    ): FacultyResponseDto {

        return {

            id:
                faculty.id!,

            organizationId:
                faculty.organizationId,

            userId:
                faculty.userId,

            departmentId:
                faculty.departmentId,

            employeeId:
                faculty.employeeId,

            designation:
                faculty.designation,

            specialization:
                faculty.specialization,

            status:
                faculty.status,

            joinedAt:
                faculty.joinedAt,

            createdAt:
                faculty.createdAt,

            updatedAt:
                faculty.updatedAt

        };

    }

}
