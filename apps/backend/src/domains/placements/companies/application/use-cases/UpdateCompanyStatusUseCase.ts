import { ICompanyRepository } from "../../infrastructure/repositories/ICompanyRepository.js";

import { CompanyResponseMapper } from "../../infrastructure/mappers/CompanyResponseMapper.js";

import { UpdateCompanyStatusDto } from "../dto/UpdateCompanyStatusDto.js";
import { CompanyResponseDto } from "../dto/CompanyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdateCompanyStatusUseCase {

    constructor(

        private readonly repository: ICompanyRepository

    ) {}

    async execute(

        id: string,

        organizationId: string,

        dto: UpdateCompanyStatusDto

    ): Promise<CompanyResponseDto> {

        const company =

            await this.repository.findById(
                id
            );

        if (

            !company ||
            company.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Company not found.",

                HttpStatus.NOT_FOUND

            );

        }

        company.updateStatus(

            dto.status

        );

        const updated =

            await this.repository.save(
                company
            );

        return CompanyResponseMapper.toDto(

            updated

        );

    }

}
