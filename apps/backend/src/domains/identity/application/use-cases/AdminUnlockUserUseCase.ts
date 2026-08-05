import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { UserSummaryResponseMapper } from "../../infrastructure/mappers/UserSummaryResponseMapper.js";
import { UserSummaryResponseDto } from "../dto/UserSummaryResponseDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/**
 * The "Admin Unlock" business rule — clears both lockedUntil and
 * failedAttempts (reuses IUserRepository.resetFailedAttempts, which
 * already clears both, rather than a separate method that would
 * duplicate the same two-field reset).
 */
export class AdminUnlockUserUseCase {

    constructor(

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        userId: string,

        organizationId: string

    ): Promise<UserSummaryResponseDto> {

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

        await this.userRepository.resetFailedAttempts(
            userId
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
