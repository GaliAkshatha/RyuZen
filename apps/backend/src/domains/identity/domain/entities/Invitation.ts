import { IInvitation } from "../interfaces/IInvitation.js";
import { InvitationStatus } from "../constants/InvitationStatus.js";

export class Invitation {

    constructor(

        private readonly props: IInvitation

    ) {}

    static create(

        props: IInvitation

    ): Invitation {

        return new Invitation(props);

    }

    accept(): void {

        this.props.status = InvitationStatus.ACCEPTED;

        this.props.acceptedAt = new Date();

    }

    revoke(): void {

        this.props.status = InvitationStatus.REVOKED;

    }

    /** A resend generates a brand new token/expiry on the SAME invitation record rather than creating a duplicate - see ResendInvitationUseCase. */
    reissue(tokenHash: string, expiresAt: Date): void {

        this.props.tokenHash = tokenHash;

        this.props.expiresAt = expiresAt;

        this.props.status = InvitationStatus.PENDING;

    }

    isExpired(): boolean {

        return this.props.expiresAt.getTime() < Date.now();

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get userId(): string {
        return this.props.userId;
    }

    get email(): string {
        return this.props.email;
    }

    get role() {
        return this.props.role;
    }

    get invitedBy(): string {
        return this.props.invitedBy;
    }

    get tokenHash(): string {
        return this.props.tokenHash;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get status(): InvitationStatus {
        return this.props.status;
    }

    get createdAt(): Date | undefined {
        return this.props.createdAt;
    }

    get acceptedAt(): Date | undefined {
        return this.props.acceptedAt;
    }

    toObject(): Readonly<IInvitation> {
        return Object.freeze({ ...this.props });
    }

}
