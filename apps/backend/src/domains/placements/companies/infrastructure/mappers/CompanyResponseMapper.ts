import { Company } from "../../domain/entities/Company.js";

import { CompanyResponseDto } from "../../application/dto/CompanyResponseDto.js";

export class CompanyResponseMapper {

    static toDto(

        company: Company

    ): CompanyResponseDto {

        return {

            id:
                company.id!,

            organizationId:
                company.organizationId,

            name:
                company.name,

            logo:
                company.logo,

            website:
                company.website,

            description:
                company.description,

            hrName:
                company.hrName,

            hrEmail:
                company.hrEmail,

            status:
                company.status,

            createdAt:
                company.createdAt,

            updatedAt:
                company.updatedAt

        };

    }

}
