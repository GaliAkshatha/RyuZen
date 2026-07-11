import { Department } from "../../domain/entities/Department.js";

import {
    IDepartmentRepository
} from "../../infrastructure/repositories/IDepartmentRepository.js";

export class GetDepartmentsUseCase {

    constructor(
        private readonly repository: IDepartmentRepository
    ) {}

    async execute(
        organizationId: string
    ): Promise<Department[]> {

        return await this.repository.findByOrganization(
            organizationId
        );

    }

}