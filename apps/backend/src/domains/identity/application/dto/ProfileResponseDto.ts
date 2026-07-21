import { UserRole } from "../../domain/constants/UserRole.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";
import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

export interface ProfileResponseDto {

    id: string;

    organizationId: string;

    name: string;

    email: string;

    role: UserRole;

    status: UserStatus;

    permissions: Permission[];

    profile: {

        image: string;

        phone: string;

        bio: string;

    };

    createdAt?: Date;

    updatedAt?: Date;

}
