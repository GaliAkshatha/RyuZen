import { Certification } from "../../domain/entities/Certification.js";

import { ICertificationRepository } from "../../infrastructure/repositories/ICertificationRepository.js";

import { CertificationResponseMapper } from "../../infrastructure/mappers/CertificationResponseMapper.js";

import { CreateCertificationDto } from "../dto/CreateCertificationDto.js";
import { CertificationResponseDto } from "../dto/CertificationResponseDto.js";

export class CreateCertificationUseCase {

    constructor(

        private readonly repository: ICertificationRepository

    ) {}

    async execute(

        dto: CreateCertificationDto,

        userId: string

    ): Promise<CertificationResponseDto> {

        const certification = Certification.create({

            userId,

            title:
                dto.title,

            issuer:
                dto.issuer,

            credentialId:
                dto.credentialId,

            issueDate:
                dto.issueDate,

            expiryDate:
                dto.expiryDate,

            credentialUrl:
                dto.credentialUrl,

            skills:
                dto.skills ?? []

        });

        const created =

            await this.repository.create(

                certification

            );

        return CertificationResponseMapper.toDto(

            created

        );

    }

}
