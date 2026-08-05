export enum UserStatus {

    /** Created by an admin, invitation sent, has not yet clicked the link. Cannot login. */
    INVITED = "INVITED",

    /** Clicked the invitation link, email confirmed, hasn't set a password yet. Cannot login. */
    EMAIL_VERIFIED = "EMAIL_VERIFIED",

    /** Password set, full access. */
    ACTIVE = "ACTIVE",

    /** Login denied by an admin action. */
    SUSPENDED = "SUSPENDED",

    /** Soft-deleted — hidden from active user lists, cannot login. */
    ARCHIVED = "ARCHIVED"

}