import { Mentorship } from "../../domain/entities/Mentorship.js";

import { MentorshipResponseDto } from "../../application/dto/MentorshipResponseDto.js";

export class MentorshipResponseMapper {

    static toDto(

        mentorship: Mentorship

    ): MentorshipResponseDto {

        return {

            id:
                mentorship.id!,

            organizationId:
                mentorship.organizationId,

            facultyId:
                mentorship.facultyId,

            studentId:
                mentorship.studentId,

            assignedBy:
                mentorship.assignedBy,

            assignedDate:
                mentorship.assignedDate,

            status:
                mentorship.status,

            remarks:
                mentorship.remarks,

            createdAt:
                mentorship.createdAt,

            updatedAt:
                mentorship.updatedAt

        };

    }

}
