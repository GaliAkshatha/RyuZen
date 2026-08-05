import { UserRole } from "../constants/UserRole.js";
import { InvitationStatus } from "../constants/InvitationStatus.js";

export interface IInvitation {

    id?: string;

    organizationId: string;

    /** The User this invitation is for - created immediately with status=INVITED, before the invitation is even accepted (see InviteUserUseCase). */
    userId: string;

    email: string;

    role: UserRole;

    invitedBy: string;

    /** Hashed, same pattern as User.passwordReset.tokenHash - never store the raw token. */
    tokenHash: string;

    expiresAt: Date;

    status: InvitationStatus;

    createdAt?: Date;

    acceptedAt?: Date;

}
