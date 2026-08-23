import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { Organization } from "../../domain/entities/Organization.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

import { UpdateOrganizationDto } from "../dto/UpdateOrganizationDto.js";
import { OrganizationResponseMapper } from "../../infrastructure/mappers/OrganizationResponseMapper.js";
import { OrganizationResponseDto } from "../dto/OrganizationResponseDto.js";

export class UpdateOrganizationUseCase {

    constructor(
        private readonly repository: IOrganizationRepository
    ) {}

    async execute(

        id: string,

        dto: UpdateOrganizationDto

    ): Promise<OrganizationResponseDto> {

        const organization =

            await this.repository.findById(id);

        if (!organization) {

            throw new ApiError(
                "Organization not found.",
                HttpStatus.NOT_FOUND
            );

        }

        organization.updateDetails(dto);

        const saved = await this.repository.save(

            organization

        );

        return OrganizationResponseMapper.toDto(saved);

    }

}
