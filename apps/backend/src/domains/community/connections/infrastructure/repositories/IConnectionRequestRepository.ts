import { ConnectionRequest } from "../../domain/entities/ConnectionRequest.js";

export interface IConnectionRequestRepository {

    create(request: ConnectionRequest): Promise<ConnectionRequest>;

    findById(id: string): Promise<ConnectionRequest | null>;

    /** Real, direction-agnostic lookup - checks both (a,b) and (b,a) for any existing real request between two people. */
    findBetween(userIdA: string, userIdB: string): Promise<ConnectionRequest | null>;

    findPendingForUser(userId: string): Promise<ConnectionRequest[]>;

    findAcceptedForUser(userId: string): Promise<ConnectionRequest[]>;

    save(request: ConnectionRequest): Promise<ConnectionRequest>;

}
