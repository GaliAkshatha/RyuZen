import { Certification } from "../../domain/entities/Certification.js";

import { CertificationResponseDto } from "../../application/dto/CertificationResponseDto.js";

export class CertificationResponseMapper {

    static toDto(

        certification: Certification

    ): CertificationResponseDto {

        return {

            id:
                certification.id!,

            userId:
                certification.userId,

            title:
                certification.title,

            issuer:
                certification.issuer,

            credentialId:
                certification.credentialId,

            issueDate:
                certification.issueDate,

            expiryDate:
                certification.expiryDate,

            credentialUrl:
                certification.credentialUrl,

            skills:
                certification.skills,

            createdAt:
                certification.createdAt,

            updatedAt:
                certification.updatedAt

        };

    }

}
