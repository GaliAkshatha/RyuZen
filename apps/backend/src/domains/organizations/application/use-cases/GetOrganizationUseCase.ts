import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

import { IUserRepository } from "../../../identity/infrastructure/repositories/IUserRepository.js";
import { UserRole } from "../../../identity/domain/constants/UserRole.js";
import {
    IDepartmentRepository,
} from "../../../academic/departments/infrastructure/repositories/IDepartmentRepository.js";

import { OrganizationResponseMapper } from "../../infrastructure/mappers/OrganizationResponseMapper.js";
import { OrganizationResponseDto } from "../dto/OrganizationResponseDto.js";

/**
 * REAL BUG FIX: this detail endpoint was missing the same real
 * userCount/departmentCount enrichment GetOrganizationsUseCase (the
 * list endpoint) already has - confirmed directly from a real
 * screenshot showing blank stat cards on the Organization Detail
 * page. Both endpoints now compute this the same real way.
 */
export class GetOrganizationUseCase {

    constructor(
        private readonly repository: IOrganizationRepository,
        private readonly userRepository: IUserRepository,
        private readonly departmentRepository: IDepartmentRepository
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

        const [users, departments] = await Promise.all([
            this.userRepository.findByOrganization(organization.id!),
            this.departmentRepository.findByOrganization(organization.id!),
        ]);

        const orgAdmins = users
            .filter((u) => u.role === UserRole.ORG_ADMIN)
            .map((u) => ({ id: u.id!, name: u.name, email: u.email }));

        return {
            ...OrganizationResponseMapper.toDto(organization),
            userCount: users.length,
            departmentCount: departments.length,
            orgAdmins,
        };

    }

}
