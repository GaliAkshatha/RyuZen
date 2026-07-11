import { UserRole } from "../../domains/identity/domain/constants/UserRole.js";
import { Permission } from "../../domains/platform/permissions/domain/constants/Permission.js";
export interface AuthenticatedUser {
    userId: string;
    organizationId: string;
    role: UserRole;
    permissions: Permission[];
}