import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { Organization } from "../../domain/entities/Organization.js";
import { IOrganization } from "../../domain/interfaces/IOrganization.js";

import { IOrganizationRepository } from "../../infrastructure/repositories/IOrganizationRepository.js";

export class CreateOrganizationUseCase {

    constructor(
        private readonly repository: IOrganizationRepository
    ) {}

    async execute(
        organization: IOrganization
    ): Promise<Organization> {

        const exists = await this.repository.existsByCode(
            organization.code
        );

        if (exists) {

            throw new ApiError(
                "Organization code already exists.",
                HttpStatus.CONFLICT
            );

        }

        return await this.repository.create(
            new Organization(organization)
        );

    }

}