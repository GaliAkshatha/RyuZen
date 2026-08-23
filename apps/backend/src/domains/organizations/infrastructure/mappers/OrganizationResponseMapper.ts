import { Organization } from "../../domain/entities/Organization.js";

import { OrganizationResponseDto } from "../../application/dto/OrganizationResponseDto.js";

export class OrganizationResponseMapper {

    static toDto(

        organization: Organization

    ): OrganizationResponseDto {

        return {

            id:
                organization.id!,

            name:
                organization.name,

            code:
                organization.code,

            logo:
                organization.logo,

            website:
                organization.website,

            emailDomains:
                organization.emailDomains,

            registrationMethod:
                organization.registrationMethod,

            organizationType:
                organization.organizationType,

            subscriptionPlan:
                organization.subscriptionPlan,

            status:
                organization.status,

            settings:
                organization.settings

        };

    }

}
