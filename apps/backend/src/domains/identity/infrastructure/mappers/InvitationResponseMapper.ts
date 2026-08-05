import { Invitation } from "../../domain/entities/Invitation.js";

import { InvitationResponseDto } from "../../application/dto/InvitationResponseDto.js";

export class InvitationResponseMapper {

    static toDto(

        invitation: Invitation

    ): InvitationResponseDto {

        return {

            id:
                invitation.id!,

            userId:
                invitation.userId,

            email:
                invitation.email,

            role:
                invitation.role,

            status:
                invitation.status,

            expiresAt:
                invitation.expiresAt,

            createdAt:
                invitation.createdAt,

            acceptedAt:
                invitation.acceptedAt

        };

    }

}
