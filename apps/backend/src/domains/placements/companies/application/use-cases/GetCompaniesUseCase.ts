import { ICompanyRepository } from "../../infrastructure/repositories/ICompanyRepository.js";

import { CompanyResponseMapper } from "../../infrastructure/mappers/CompanyResponseMapper.js";

import { CompanyResponseDto } from "../dto/CompanyResponseDto.js";

export class GetCompaniesUseCase {

    constructor(

        private readonly repository: ICompanyRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<CompanyResponseDto[]> {

        const companies =

            await this.repository.findByOrganization(
                organizationId
            );

        return companies.map(

            company =>

                CompanyResponseMapper.toDto(
                    company
                )

        );

    }

}
