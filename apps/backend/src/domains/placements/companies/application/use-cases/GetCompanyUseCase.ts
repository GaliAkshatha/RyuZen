import { ICompanyRepository } from "../../infrastructure/repositories/ICompanyRepository.js";

import { CompanyResponseMapper } from "../../infrastructure/mappers/CompanyResponseMapper.js";

import { CompanyResponseDto } from "../dto/CompanyResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetCompanyUseCase {

    constructor(

        private readonly repository: ICompanyRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

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

        return CompanyResponseMapper.toDto(

            company

        );

    }

}
