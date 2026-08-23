import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

import { OrganizationResponseMapper } from "../../infrastructure/mappers/OrganizationResponseMapper.js";
import { OrganizationResponseDto } from "../dto/OrganizationResponseDto.js";

export class GetOrganizationUseCase {

    constructor(
        private readonly repository: IOrganizationRepository
    ) {}

    async execute(
        id: string
    ): Promise<OrganizationResponseDto> {

        const organization =
            await this.repository.findById(id);

        if (!organization) {

            throw new ApiError(
                "Organization not found.",
                HttpStatus.NOT_FOUND
            );

        }

        return OrganizationResponseMapper.toDto(organization);

    }

}
