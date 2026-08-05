import { ConnectionRequestStatus } from "../constants/ConnectionRequestStatus.js";

/**
 * "See people and request to connect" - a real, direct LinkedIn-style
 * connection request, not a one-way follow. Once ACCEPTED, this same
 * record IS the connection - there is deliberately no separate
 * Connection entity duplicating the same fromUserId/toUserId pair,
 * avoiding two records that could drift out of sync with each other.
 */
export interface IConnectionRequest {

    id?: string;

    organizationId: string;

    fromUserId: string;

    toUserId: string;

    status: ConnectionRequestStatus;

    respondedAt?: Date;

    createdAt?: Date;

}
