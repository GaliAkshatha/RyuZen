import { Organization } from "../../domain/entities/Organization.js";
import { IOrganization } from "../../domain/interfaces/IOrganization.js";

import { OrganizationDocument } from "../persistence/OrganizationModel.js";

export class OrganizationMapper {

    static toDomain(
        document: OrganizationDocument
    ): Organization {

        return new Organization({

            id: document.id,

            name: document.name,

            code: document.code,

            logo: document.logo,

            website: document.website,

            emailDomains: [...document.emailDomains],

            registrationMethod: document.registrationMethod,

            organizationType: document.organizationType,

            subscriptionPlan: document.subscriptionPlan,

            status: document.status,

            settings: {

                ...document.settings

            }

        });

    }

    static toPersistence(
        organization: Organization
    ): IOrganization {

        return {

            ...organization.toObject(),

            emailDomains: [
                ...organization.emailDomains
            ],

            settings: {
                ...organization.settings
            }

        };

    }

}