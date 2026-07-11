import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { ITokenProvider } from "../ports/ITokenProvider.js";

import { RefreshTokenDto } from "../dto/RefreshTokenDto.js";
import { AuthResponseDto } from "../dto/AuthResponseDto.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class RefreshTokenUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly tokenProvider: ITokenProvider

    ) {}

    async execute(

        dto: RefreshTokenDto

    ): Promise<AuthResponseDto> {

        const payload =

            await this.tokenProvider.verifyRefreshToken(
                dto.refreshToken
            );

        const user =

            await this.userRepository.findById(
                payload.userId
            );

        if (!user) {

            throw new ApiError(

                "Invalid refresh token.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const accessToken =

            await this.tokenProvider.generateAccessToken(
                user
            );

        const refreshToken =

            await this.tokenProvider.generateRefreshToken(
                user
            );

        return {

            accessToken,

            refreshToken,

            user: {

                id: user.id!,

                organizationId: user.organizationId,

                name: user.name,

                email: user.email,

                role: user.role

            }

        };

    }

}
