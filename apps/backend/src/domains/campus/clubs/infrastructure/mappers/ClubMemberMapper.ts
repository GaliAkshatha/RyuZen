import { ClubMember } from "../../domain/entities/ClubMember.js";

import { ClubMemberRole } from "../../domain/constants/ClubMemberRole.js";
import { ClubMemberStatus } from "../../domain/constants/ClubMemberStatus.js";

import {
    ClubMemberDocument
} from "../persistence/ClubMemberModel.js";

export class ClubMemberMapper {

    static toDomain(

        document: ClubMemberDocument

    ): ClubMember {

        return ClubMember.create({

            id:
                document.id,

            clubId:
                document.clubId.toString(),

            studentId:
                document.studentId.toString(),

            role:
                document.role as ClubMemberRole,

            joinedAt:
                document.joinedAt,

            status:
                document.status as ClubMemberStatus

        });

    }

    static toPersistence(

        member: ClubMember

    ) {

        const data =
            member.toObject();

        return {

            clubId:
                data.clubId,

            studentId:
                data.studentId,

            role:
                data.role,

            joinedAt:
                data.joinedAt,

            status:
                data.status

        };

    }

}
