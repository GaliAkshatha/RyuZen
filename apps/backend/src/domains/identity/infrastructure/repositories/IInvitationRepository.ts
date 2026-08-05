import { Invitation } from "../../domain/entities/Invitation.js";

export interface IInvitationRepository {

    create(
        invitation: Invitation
    ): Promise<Invitation>;

    findById(
        id: string
    ): Promise<Invitation | null>;

    /** The lookup used by verify/accept - mirrors the password-reset pattern of finding by email first, then verifying the token hash, rather than needing a "find by raw token" mechanism. Email is globally unique (matching IUserRepository.existsByEmail's global scope), so no organizationId is needed here - the public verify/accept endpoints don't have one to pass anyway. Returns the most recent PENDING invitation for this email, if any. */
    findPendingByEmail(
        email: string
    ): Promise<Invitation | null>;

    findByOrganization(
        organizationId: string
    ): Promise<Invitation[]>;

    findByUserId(
        userId: string
    ): Promise<Invitation | null>;

    save(
        invitation: Invitation
    ): Promise<Invitation>;

}
