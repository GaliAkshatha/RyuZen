import { ConnectionRequest } from "../../domain/entities/ConnectionRequest.js";
import { ConnectionRequestStatus } from "../../domain/constants/ConnectionRequestStatus.js";

import { ConnectionRequestDocument } from "../persistence/ConnectionRequestModel.js";

export class ConnectionRequestMapper {

    static toDomain(document: ConnectionRequestDocument): ConnectionRequest {

        return ConnectionRequest.create({

            id: document.id,
            organizationId: document.organizationId.toString(),
            fromUserId: document.fromUserId.toString(),
            toUserId: document.toUserId.toString(),
            status: document.status as ConnectionRequestStatus,
            respondedAt: document.respondedAt,
            createdAt: document.createdAt

        });

    }

    static toPersistence(request: ConnectionRequest) {

        const data = request.toObject();

        return {
            organizationId: data.organizationId,
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            status: data.status,
            respondedAt: data.respondedAt
        };

    }

}
