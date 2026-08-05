import { User } from "../../domain/entities/User.js";

import { UserSummaryResponseDto } from "../../application/dto/UserSummaryResponseDto.js";

export class UserSummaryResponseMapper {

    static toDto(

        user: User

    ): UserSummaryResponseDto {

        return {

            id:
                user.id!,

            name:
                user.name,

            email:
                user.email,

            role:
                user.role,

            status:
                user.status,

            isLocked:
                Boolean(user.auth.lockedUntil && user.auth.lockedUntil.getTime() > Date.now())

        };

    }

}
