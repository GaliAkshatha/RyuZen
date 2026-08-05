import { UserRole } from "../../domain/constants/UserRole.js";
import { InvitationStatus } from "../../domain/constants/InvitationStatus.js";

export interface InvitationResponseDto {

    id: string;

    userId: string;

    email: string;

    role: UserRole;

    status: InvitationStatus;

    expiresAt: Date;

    createdAt?: Date;

    acceptedAt?: Date;

}
