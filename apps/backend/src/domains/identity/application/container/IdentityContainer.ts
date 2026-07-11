import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

import { OrganizationRepository } from "../../../organizations/infrastructure/repositories/OrganizationRepository.js";

import { BCryptPasswordHasher } from "../../infrastructure/security/BCryptPasswordHasher.js";

import { JwtTokenProvider } from "../../infrastructure/security/JwtTokenProvider.js";

import { RegisterUserUseCase } from "../use-cases/RegisterUserUseCase.js";

import { LoginUserUseCase } from "../use-cases/LoginUserUseCase.js";

import { GetProfileUseCase } from "../use-cases/GetProfileUseCase.js";

import { UpdateProfileUseCase } from "../use-cases/UpdateProfileUseCase.js";

import { ChangePasswordUseCase } from "../use-cases/ChangePasswordUseCase.js";

import { ForgotPasswordUseCase } from "../use-cases/ForgotPasswordUseCase.js";

import { ResetPasswordUseCase } from "../use-cases/ResetPasswordUseCase.js";

import { RefreshTokenUseCase } from "../use-cases/RefreshTokenUseCase.js";

import { GrantPermissionUseCase } from "../use-cases/GrantPermissionUseCase.js";

import { RevokePermissionUseCase } from "../use-cases/RevokePermissionUseCase.js";

const userRepository =

    new UserRepository();

const organizationRepository =

    new OrganizationRepository();

const passwordHasher =

    new BCryptPasswordHasher();

const tokenProvider =

    new JwtTokenProvider();

export const identityContainer = {

    registerUser:

        new RegisterUserUseCase(

            userRepository,

            organizationRepository,

            passwordHasher

        ),

    loginUser:

        new LoginUserUseCase(

            userRepository,

            passwordHasher,

            tokenProvider

        ),

    getProfile:

        new GetProfileUseCase(

            userRepository

        ),

    updateProfile:

        new UpdateProfileUseCase(

            userRepository

        ),

    changePassword:

        new ChangePasswordUseCase(

            userRepository,

            passwordHasher

        ),

    forgotPassword:

        new ForgotPasswordUseCase(

            userRepository,

            passwordHasher

        ),

    resetPassword:

        new ResetPasswordUseCase(

            userRepository,

            passwordHasher

        ),

    refreshToken:

        new RefreshTokenUseCase(

            userRepository,

            tokenProvider

        ),

    grantPermission:

        new GrantPermissionUseCase(

            userRepository

        ),

    revokePermission:

        new RevokePermissionUseCase(

            userRepository

        )

};