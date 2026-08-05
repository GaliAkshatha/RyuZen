import { Session } from "../../domain/entities/Session.js";

import { SessionDocument } from "../persistence/SessionModel.js";

export class SessionMapper {

    static toDomain(

        document: SessionDocument

    ): Session {

        return Session.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            organizationId:
                document.organizationId.toString(),

            device:
                document.device,

            browser:
                document.browser,

            ipAddress:
                document.ipAddress,

            userAgent:
                document.userAgent,

            refreshTokenHash:
                document.refreshTokenHash,

            createdAt:
                document.createdAt,

            lastActiveAt:
                document.lastActiveAt,

            expiresAt:
                document.expiresAt,

            revoked:
                document.revoked

        });

    }

    static toPersistence(

        session: Session

    ) {

        const data =
            session.toObject();

        return {

            userId:
                data.userId,

            organizationId:
                data.organizationId,

            device:
                data.device,

            browser:
                data.browser,

            ipAddress:
                data.ipAddress,

            userAgent:
                data.userAgent,

            refreshTokenHash:
                data.refreshTokenHash,

            lastActiveAt:
                data.lastActiveAt,

            expiresAt:
                data.expiresAt,

            revoked:
                data.revoked

        };

    }

}
