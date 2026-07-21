import { OrganizationSettings } from "../../domain/entities/OrganizationSettings.js";
import { IOrganizationSettings } from "../../domain/interfaces/IOrganizationSettings.js";

import { OrganizationSettingsDocument } from "../persistence/OrganizationSettingsModel.js";

export class OrganizationSettingsMapper {

    static toDomain(
        document: OrganizationSettingsDocument
    ): OrganizationSettings {

        return new OrganizationSettings({

            id: document.id,

            organizationId: document.organizationId.toString(),

            branding: {
                ...document.branding
            } as IOrganizationSettings["branding"],

            registration: {
                ...document.registration
            },

            security: {
                ...document.security,
                ipWhitelist: [...document.security.ipWhitelist]
            },

            academic: {
                ...document.academic
            },

            activities: {
                ...document.activities
            },

            events: {
                ...document.events
            },

            clubs: {
                ...document.clubs
            },

            placements: {
                ...document.placements
            } as IOrganizationSettings["placements"],

            careerSystem: {
                ...document.careerSystem
            },

            ai: {
                ...document.ai
            },

            notifications: {
                ...document.notifications
            },

            chat: {
                ...document.chat
            },

            analytics: {
                ...document.analytics
            },

            leaderboard: {
                ...document.leaderboard
            },

            certificates: {
                ...document.certificates
            },

            fileStorage: {
                ...document.fileStorage
            },

            integrations: {
                ...document.integrations
            },

            audit: {
                ...document.audit
            },

            createdAt: document.createdAt,

            updatedAt: document.updatedAt

        });

    }

    static toPersistence(
        settings: OrganizationSettings
    ): Partial<IOrganizationSettings> {

        return {

            ...settings.toObject()

        };

    }

}
