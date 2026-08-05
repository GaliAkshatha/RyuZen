import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { UserStatus } from "../../domain/constants/UserStatus.js";
import { UserRole } from "../../domain/constants/UserRole.js";

import { UserSummaryResponseMapper } from "../../infrastructure/mappers/UserSummaryResponseMapper.js";
import { UserSummaryResponseDto } from "../dto/UserSummaryResponseDto.js";
import { UpdateUserStatusDto } from "../dto/UpdateUserStatusDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/**
 * The single admin-facing status transition ("ORG_ADMIN can suspend
 * users", and the corresponding reactivate/archive actions) rather
 * than three near-identical use cases - one real guard shared by all
 * three: only ACTIVE/SUSPENDED/ARCHIVED are valid targets here.
 * INVITED/EMAIL_VERIFIED are invitation-flow-only states an admin
 * cannot set directly (there's no real "un-invite them back to
 * pending" action), and they're not valid inputs to this use case at
 * all - trying to set either is rejected the same as any other
 * invalid value.
 */
export class UpdateUserStatusUseCase {

    constructor(

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        userId: string,

        organizationId: string,

        dto: UpdateUserStatusDto

    ): Promise<UserSummaryResponseDto> {

        if (

            dto.status !== UserStatus.ACTIVE &&
            dto.status !== UserStatus.SUSPENDED &&
            dto.status !== UserStatus.ARCHIVED

        ) {

            throw new ApiError(

                "Status must be one of ACTIVE, SUSPENDED, or ARCHIVED.",

                HttpStatus.BAD_REQUEST

            );

        }

        const user =

            await this.userRepository.findById(
                userId
            );

        if (!user) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.organizationId !== organizationId) {

            throw new ApiError(

                "User not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ORG_ADMIN) {

            throw new ApiError(

                "Cannot change the status of an admin account through this action.",

                HttpStatus.FORBIDDEN

            );

        }

        await this.userRepository.updateStatus(

            userId,

            dto.status

        );

        const updated =

            await this.userRepository.findById(
                userId
            );

        return UserSummaryResponseMapper.toDto(
            updated!
        );

    }

}
