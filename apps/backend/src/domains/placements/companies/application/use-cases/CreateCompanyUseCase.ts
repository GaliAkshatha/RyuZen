import { Company } from "../../domain/entities/Company.js";

import { CompanyStatus } from "../../domain/constants/CompanyStatus.js";

import { ICompanyRepository } from "../../infrastructure/repositories/ICompanyRepository.js";

import { CompanyResponseMapper } from "../../infrastructure/mappers/CompanyResponseMapper.js";

import { CreateCompanyDto } from "../dto/CreateCompanyDto.js";
import { CompanyResponseDto } from "../dto/CompanyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class CreateCompanyUseCase {

    constructor(

        private readonly repository: ICompanyRepository

    ) {}

    async execute(

        dto: CreateCompanyDto,

        organizationId: string

    ): Promise<CompanyResponseDto> {

        const exists =

            await this.repository.existsByName(

                organizationId,

                dto.name

            );

        if (exists) {

            throw new ApiError(

                "A company with this name already exists.",

                HttpStatus.CONFLICT

            );

        }

        const company = Company.create({

            organizationId,

            name:
                dto.name,

            logo:
                dto.logo,

            website:
                dto.website,

            description:
                dto.description,

            hrName:
                dto.hrName,

            hrEmail:
                dto.hrEmail,

            status:
                CompanyStatus.ACTIVE

        });

        const created =

            await this.repository.create(

                company

            );

        return CompanyResponseMapper.toDto(

            created

        );

    }

}
