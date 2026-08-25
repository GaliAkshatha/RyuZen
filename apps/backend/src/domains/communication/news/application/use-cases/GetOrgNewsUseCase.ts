import { INewsRepository } from "../../infrastructure/repositories/INewsRepository.js";

import { NewsResponseMapper } from "../../infrastructure/mappers/NewsResponseMapper.js";

import { NewsResponseDto } from "../dto/NewsResponseDto.js";

/**
 * Real org isolation: every caller only ever receives news scoped to
 * their own organizationId - the repository's own query enforces
 * this (no cross-org data can leak through this use case regardless
 * of what a caller might try to pass). Which roles are even allowed
 * to reach this endpoint at all (the org's own internal community,
 * not external Recruiters) is enforced at the route level.
 */
export class GetOrgNewsUseCase {

    constructor(

        private readonly repository: INewsRepository

    ) {}

    async execute(

        organizationId: string

    ): Promise<NewsResponseDto[]> {

        const news =

            await this.repository.findByOrganization(

                organizationId

            );

        return news.map(

            item =>

                NewsResponseMapper.toDto(
                    item
                )

        );

    }

}
