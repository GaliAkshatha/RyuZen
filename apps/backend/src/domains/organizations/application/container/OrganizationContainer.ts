import { OrganizationRepository } from "../../infrastructure/repositories/OrganizationRepository.js";

import { UserRepository } from "../../../identity/infrastructure/repositories/UserRepository.js";

import { BCryptPasswordHasher } from "../../../identity/infrastructure/security/BCryptPasswordHasher.js";

import { CreateOrganizationUseCase } from "../use-cases/CreateOrganizationUseCase.js";
import { GetOrganizationUseCase } from "../use-cases/GetOrganizationUseCase.js";
import { GetOrganizationsUseCase } from "../use-cases/GetOrganizationsUseCase.js";
import { CreateOrgAdminUseCase } from "../use-cases/CreateOrgAdminUseCase.js";

const organizationRepository = new OrganizationRepository();

const userRepository = new UserRepository();

const passwordHasher = new BCryptPasswordHasher();

export const organizationContainer = {

    createOrganization:

        new CreateOrganizationUseCase(
            organizationRepository
        ),

    getOrganization:

        new GetOrganizationUseCase(
            organizationRepository
        ),

    getOrganizations:

        new GetOrganizationsUseCase(
            organizationRepository
        ),

    createOrgAdmin:

        new CreateOrgAdminUseCase(

            organizationRepository,

            userRepository,

            passwordHasher

        )

};