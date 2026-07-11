import { UserRole } from "../../../identity/domain/constants/UserRole.js";
import { UserStatus } from "../../../identity/domain/constants/UserStatus.js";

export interface CreateOrgAdminResponseDto {

    id: string;

    organizationId: string;

    name: string;

    email: string;

    role: UserRole;

    status: UserStatus;

}