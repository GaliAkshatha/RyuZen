import { UserRole } from "../../domain/constants/UserRole.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";

export interface RegisterUserResponseDto {

    id: string;

    organizationId: string;

    name: string;

    email: string;

    role: UserRole;

    status: UserStatus;

}