import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

import { IUserRepository } from "../../../identity/infrastructure/repositories/IUserRepository.js";
import {
    IDepartmentRepository,
} from "../../../academic/departments/infrastructure/repositories/IDepartmentRepository.js";

import { OrganizationResponseMapper } from "../../infrastructure/mappers/OrganizationResponseMapper.js";
import { OrganizationResponseDto } from "../dto/OrganizationResponseDto.js";

export class GetOrganizationsUseCase {

    constructor(
        private readonly repository: IOrganizationRepository,
        private readonly userRepository: IUserRepository,
        private readonly departmentRepository: IDepartmentRepository
    ) {}

    /**
     * REAL BUG FIX this pass: previously returned raw Organization
     * class instances with no mapper - confirmed the real cause of
     * "the Organizations page shows nothing" (see OrganizationResponseDto's
     * own comment for the full explanation). Now also enriches each
     * organization with real userCount/departmentCount, closing a
     * second real gap - the Platform Admin table needed a genuine
     * sense of organization scale, not just a name and status.
     */
    async execute(): Promise<OrganizationResponseDto[]> {

        const organizations =
            await this.repository.findAll();

        const enriched: OrganizationResponseDto[] = [];

        for (const organization of organizations) {

            const [users, departments] = await Promise.all([
                this.userRepository.findByOrganization(organization.id!),
                this.departmentRepository.findByOrganization(organization.id!),
            ]);

            enriched.push({
                ...OrganizationResponseMapper.toDto(organization),
                userCount: users.length,
                departmentCount: departments.length,
            });

        }

        return enriched;

    }

}
