import { LoginDto } from "../dto/LoginDto.js";
import { AuthResponseDto } from "../dto/AuthResponseDto.js";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";
import { ITokenProvider } from "../ports/ITokenProvider.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class LoginUserUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly tokenProvider: ITokenProvider

    ) {}

    async execute(

        dto: LoginDto

    ): Promise<AuthResponseDto> {

        const user =
            await this.userRepository.findByEmail(
                dto.email,
                {
                    includePassword: true
                }
            );

        if (!user) {

            throw new ApiError(

                "Invalid email or password.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const valid =
            await this.passwordHasher.compare(

                dto.password,

                user.auth.passwordHash

            );

        if (!valid) {

            await this.userRepository.incrementFailedAttempts(
                user.id!
            );

            throw new ApiError(

                "Invalid email or password.",

                HttpStatus.UNAUTHORIZED

            );

        }

        await this.userRepository.resetFailedAttempts(
            user.id!
        );

        await this.userRepository.updateLastLogin(
            user.id!
        );

        const accessToken =
            await this.tokenProvider.generateAccessToken(
                user
            );

        return {

            accessToken,

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