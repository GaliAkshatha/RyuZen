import { UserRole } from "../../domains/identity/domain/constants/UserRole.js";
import { Permission } from "../../domains/platform/permissions/domain/constants/Permission.js";
export interface AuthenticatedUser {
    userId: string;
    organizationId: string;
    role: UserRole;
    permissions: Permission[];
    /** Present on tokens issued after Session Management was added - lets an authenticated request identify "this device's session" for logout/session-listing without the client resubmitting its refresh token. */
    sessionId?: string;
}