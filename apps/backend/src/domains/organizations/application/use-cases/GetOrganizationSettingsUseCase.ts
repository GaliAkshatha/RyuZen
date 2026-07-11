import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { OrganizationSettings } from "../../domain/entities/OrganizationSettings.js";

import {
    IOrganizationSettingsRepository,
} from "../../infrastructure/repositories/IOrganizationSettingsRepository.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

export class GetOrganizationSettingsUseCase {

    constructor(

        private readonly settingsRepository: IOrganizationSettingsRepository,

        private readonly organizationRepository: IOrganizationRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<OrganizationSettings> {

        const organization =

            await this.organizationRepository.findById(
                organizationId
            );

        if (!organization) {

            throw new ApiError(

                "Organization not found.",

                HttpStatus.NOT_FOUND

            );

        }

        const settings =

            await this.settingsRepository.findByOrganizationId(
                organizationId
            );

        if (settings) {

            return settings;

        }

        return await this.settingsRepository.createDefault(

            organizationId

        );

    }

}