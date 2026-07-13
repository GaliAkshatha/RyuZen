import { Club } from "../../domain/entities/Club.js";

import { ClubResponseDto } from "../../application/dto/ClubResponseDto.js";

export class ClubResponseMapper {

    static toDto(

        club: Club

    ): ClubResponseDto {

        return {

            id:
                club.id!,

            organizationId:
                club.organizationId,

            name:
                club.name,

            code:
                club.code,

            description:
                club.description,

            logo:
                club.logo,

            facultyAdvisorId:
                club.facultyAdvisorId,

            presidentStudentId:
                club.presidentStudentId,

            vicePresidentStudentId:
                club.vicePresidentStudentId,

            status:
                club.status,

            createdAt:
                club.createdAt,

            updatedAt:
                club.updatedAt

        };

    }

}
