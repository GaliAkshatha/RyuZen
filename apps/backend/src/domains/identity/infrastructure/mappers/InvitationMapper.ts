import { Invitation } from "../../domain/entities/Invitation.js";
import { UserRole } from "../../domain/constants/UserRole.js";
import { InvitationStatus } from "../../domain/constants/InvitationStatus.js";

import { InvitationDocument } from "../persistence/InvitationModel.js";

export class InvitationMapper {

    static toDomain(

        document: InvitationDocument

    ): Invitation {

        return Invitation.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            userId:
                document.userId.toString(),

            email:
                document.email,

            role:
                document.role as UserRole,

            invitedBy:
                document.invitedBy.toString(),

            tokenHash:
                document.tokenHash,

            expiresAt:
                document.expiresAt,

            status:
                document.status as InvitationStatus,

            createdAt:
                document.createdAt,

            acceptedAt:
                document.acceptedAt

        });

    }

    static toPersistence(

        invitation: Invitation

    ) {

        const data =
            invitation.toObject();

        return {

            organizationId:
                data.organizationId,

            userId:
                data.userId,

            email:
                data.email,

            role:
                data.role,

            invitedBy:
                data.invitedBy,

            tokenHash:
                data.tokenHash,

            expiresAt:
                data.expiresAt,

            status:
                data.status,

            acceptedAt:
                data.acceptedAt

        };

    }

}
