import { ConnectionRequestStatus } from "../../domain/constants/ConnectionRequestStatus.js";

export interface ConnectionRequestResponseDto {

    id: string;

    fromUserId: string;

    fromUserName: string;

    toUserId: string;

    status: ConnectionRequestStatus;

    createdAt?: Date;

}
