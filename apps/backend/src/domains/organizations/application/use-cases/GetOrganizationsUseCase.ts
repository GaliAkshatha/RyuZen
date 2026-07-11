import { Organization } from "../../domain/entities/Organization.js";

import {
    IOrganizationRepository,
} from "../../infrastructure/repositories/IOrganizationRepository.js";

export class GetOrganizationsUseCase {

    constructor(
        private readonly repository: IOrganizationRepository
    ) {}

    async execute(): Promise<Organization[]> {

        return await this.repository.findAll();

    }

}
