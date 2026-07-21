import { IOrganizationSettingsRepository } from "./IOrganizationSettingsRepository.js";

import { OrganizationSettingsModel } from "../persistence/OrganizationSettingsModel.js";
import { OrganizationSettingsMapper } from "../mappers/OrganizationSettingsMapper.js";

import { OrganizationSettings } from "../../domain/entities/OrganizationSettings.js";

export class OrganizationSettingsRepository
    implements IOrganizationSettingsRepository {

    async findByOrganizationId(

        organizationId: string

    ): Promise<OrganizationSettings | null> {

        const document =

            await OrganizationSettingsModel.findOne({

                organizationId

            });

        if (!document) {

            return null;

        }

        return OrganizationSettingsMapper.toDomain(

            document

        );

    }

    async createDefault(

        organizationId: string

    ): Promise<OrganizationSettings> {

        const document =

            await OrganizationSettingsModel.create({

                organizationId

            });

        return OrganizationSettingsMapper.toDomain(

            document

        );

    }

    async save(

        settings: OrganizationSettings

    ): Promise<OrganizationSettings> {

        const document =

            await OrganizationSettingsModel.findByIdAndUpdate(

                settings.id,

                OrganizationSettingsMapper.toPersistence(

                    settings

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Organization settings not found."

            );

        }

        return OrganizationSettingsMapper.toDomain(

            document

        );

    }

}
