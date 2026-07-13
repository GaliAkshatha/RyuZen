import { ClubMember } from "../../domain/entities/ClubMember.js";

import { ClubMemberResponseDto } from "../../application/dto/ClubMemberResponseDto.js";

export class ClubMemberResponseMapper {

    static toDto(

        member: ClubMember

    ): ClubMemberResponseDto {

        return {

            id:
                member.id!,

            clubId:
                member.clubId,

            studentId:
                member.studentId,

            role:
                member.role,

            joinedAt:
                member.joinedAt,

            status:
                member.status

        };

    }

}
