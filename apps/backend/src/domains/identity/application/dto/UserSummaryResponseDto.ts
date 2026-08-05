import { UserRole } from "../../domain/constants/UserRole.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";

/** A minimal, admin-facing view of a User - deliberately never includes passwordHash or any auth internals. */
export interface UserSummaryResponseDto {

    id: string;

    name: string;

    email: string;

    role: UserRole;

    status: UserStatus;

    isLocked: boolean;

}
