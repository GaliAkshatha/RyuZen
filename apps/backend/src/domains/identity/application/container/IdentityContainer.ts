import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

import { OrganizationRepository } from "../../../organizations/infrastructure/repositories/OrganizationRepository.js";

import { BCryptPasswordHasher } from "../../infrastructure/security/BCryptPasswordHasher.js";

import { JwtTokenProvider } from "../../infrastructure/security/JwtTokenProvider.js";

import { RegisterUserUseCase } from "../use-cases/RegisterUserUseCase.js";

import { LoginUserUseCase } from "../use-cases/LoginUserUseCase.js";

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

        )

};