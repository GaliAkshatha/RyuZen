import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { OrganizationSettings } from "../../domain/entities/OrganizationSettings.js";

import {
    IOrganizationSettingsRepository,
} from "../../infrastructure/repositories/IOrganizationSettingsRepository.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

import { UpdateOrganizationSettingsDto } from "../dto/UpdateOrganizationSettingsDto.js";

export class UpdateOrganizationSettingsUseCase {

    constructor(

        private readonly settingsRepository: IOrganizationSettingsRepository,

        private readonly organizationRepository: IOrganizationRepository

    ) {}

    async execute(

        organizationId: string,

        dto: UpdateOrganizationSettingsDto

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

        let settings =

            await this.settingsRepository.findByOrganizationId(
                organizationId
            );

        if (!settings) {

            settings =

                await this.settingsRepository.createDefault(
                    organizationId
                );

        }

        settings.updateSettings(dto);

        return await this.settingsRepository.save(

            settings

        );

    }

}
