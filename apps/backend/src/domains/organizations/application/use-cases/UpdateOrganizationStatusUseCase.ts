import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { Organization } from "../../domain/entities/Organization.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

import { UpdateOrganizationStatusDto } from "../dto/UpdateOrganizationStatusDto.js";

export class UpdateOrganizationStatusUseCase {

    constructor(
        private readonly repository: IOrganizationRepository
    ) {}

    async execute(

        id: string,

        dto: UpdateOrganizationStatusDto

    ): Promise<Organization> {

        const organization =

            await this.repository.findById(id);

        if (!organization) {

            throw new ApiError(
                "Organization not found.",
                HttpStatus.NOT_FOUND
            );

        }

        organization.updateStatus(dto.status);

        return await this.repository.save(

            organization

        );

    }

}
