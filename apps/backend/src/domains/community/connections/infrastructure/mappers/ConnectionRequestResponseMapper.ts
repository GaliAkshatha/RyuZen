import { ConnectionRequest } from "../../domain/entities/ConnectionRequest.js";

import { ConnectionRequestResponseDto } from "../../application/dto/ConnectionRequestResponseDto.js";

export class ConnectionRequestResponseMapper {

    static toDto(request: ConnectionRequest, fromUserName: string): ConnectionRequestResponseDto {

        return {
            id: request.id!,
            fromUserId: request.fromUserId,
            fromUserName,
            toUserId: request.toUserId,
            status: request.status,
            createdAt: request.createdAt
        };

    }

}
