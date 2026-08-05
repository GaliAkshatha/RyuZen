import { UserRole } from "../../domain/constants/UserRole.js";

export interface InviteUserDto {

    name: string;

    email: string;

    /** ORG_ADMIN can invite any role except SUPER_ADMIN/ORG_ADMIN itself - enforced in InviteUserUseCase, not just the route gate. */
    role: UserRole;

}
