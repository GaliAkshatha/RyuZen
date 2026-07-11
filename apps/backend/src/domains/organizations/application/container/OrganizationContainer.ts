import { OrganizationRepository } from "../../infrastructure/repositories/OrganizationRepository.js";

import { OrganizationSettingsRepository } from "../../infrastructure/repositories/OrganizationSettingsRepository.js";

import { UserRepository } from "../../../identity/infrastructure/repositories/UserRepository.js";

import { BCryptPasswordHasher } from "../../../identity/infrastructure/security/BCryptPasswordHasher.js";

import { CreateOrganizationUseCase } from "../use-cases/CreateOrganizationUseCase.js";
import { GetOrganizationUseCase } from "../use-cases/GetOrganizationUseCase.js";
import { GetOrganizationsUseCase } from "../use-cases/GetOrganizationsUseCase.js";
import { UpdateOrganizationUseCase } from "../use-cases/UpdateOrganizationUseCase.js";
import { UpdateOrganizationStatusUseCase } from "../use-cases/UpdateOrganizationStatusUseCase.js";
import { GetOrganizationSettingsUseCase } from "../use-cases/GetOrganizationSettingsUseCase.js";
import { UpdateOrganizationSettingsUseCase } from "../use-cases/UpdateOrganizationSettingsUseCase.js";
import { CreateOrgAdminUseCase } from "../use-cases/CreateOrgAdminUseCase.js";

const organizationRepository = new OrganizationRepository();

const organizationSettingsRepository = new OrganizationSettingsRepository();

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

    updateOrganization:

        new UpdateOrganizationUseCase(
            organizationRepository
        ),

    updateOrganizationStatus:

        new UpdateOrganizationStatusUseCase(
            organizationRepository
        ),

    getOrganizationSettings:

        new GetOrganizationSettingsUseCase(

            organizationSettingsRepository,

            organizationRepository

        ),

    updateOrganizationSettings:

        new UpdateOrganizationSettingsUseCase(

            organizationSettingsRepository,

            organizationRepository

        ),

    createOrgAdmin:

        new CreateOrgAdminUseCase(

            organizationRepository,

            userRepository,

            passwordHasher

        )

};