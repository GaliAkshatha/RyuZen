import { IConnectionRequest } from "../interfaces/IConnectionRequest.js";
import { ConnectionRequestStatus } from "../constants/ConnectionRequestStatus.js";

export class ConnectionRequest {

    constructor(

        private readonly props: IConnectionRequest

    ) {}

    static create(props: IConnectionRequest): ConnectionRequest {

        return new ConnectionRequest(props);

    }

    accept(): void {

        if (this.props.status !== ConnectionRequestStatus.PENDING) {

            throw new Error(
                "This connection request has already been responded to."
            );

        }

        this.props.status = ConnectionRequestStatus.ACCEPTED;

        this.props.respondedAt = new Date();

    }

    reject(): void {

        if (this.props.status !== ConnectionRequestStatus.PENDING) {

            throw new Error(
                "This connection request has already been responded to."
            );

        }

        this.props.status = ConnectionRequestStatus.REJECTED;

        this.props.respondedAt = new Date();

    }

    /** Real, symmetric check - a connection is real regardless of who originally sent the request. */
    involves(userId: string): boolean {

        return this.props.fromUserId === userId || this.props.toUserId === userId;

    }

    /** The real "other side" of this connection, from the perspective of a given user. */
    otherUserId(userId: string): string {

        return this.props.fromUserId === userId ? this.props.toUserId : this.props.fromUserId;

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get fromUserId(): string {
        return this.props.fromUserId;
    }

    get toUserId(): string {
        return this.props.toUserId;
    }

    get status(): ConnectionRequestStatus {
        return this.props.status;
    }

    get respondedAt(): Date | undefined {
        return this.props.respondedAt;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    toObject(): Readonly<IConnectionRequest> {
        return Object.freeze({ ...this.props });
    }

}
