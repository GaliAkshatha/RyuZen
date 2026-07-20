import { Company } from "../../domain/entities/Company.js";

import { CompanyStatus } from "../../domain/constants/CompanyStatus.js";

import {
    CompanyDocument
} from "../persistence/CompanyModel.js";

export class CompanyMapper {

    static toDomain(

        document: CompanyDocument

    ): Company {

        return Company.create({

            id:
                document.id,

            organizationId:
                document.organizationId.toString(),

            name:
                document.name,

            logo:
                document.logo,

            website:
                document.website,

            description:
                document.description,

            hrName:
                document.hrName,

            hrEmail:
                document.hrEmail,

            status:
                document.status as CompanyStatus,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        company: Company

    ) {

        const data =
            company.toObject();

        return {

            organizationId:
                data.organizationId,

            name:
                data.name,

            logo:
                data.logo,

            website:
                data.website,

            description:
                data.description,

            hrName:
                data.hrName,

            hrEmail:
                data.hrEmail,

            status:
                data.status

        };

    }

}
