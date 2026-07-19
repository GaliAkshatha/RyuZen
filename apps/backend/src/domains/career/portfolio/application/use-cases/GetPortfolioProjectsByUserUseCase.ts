import { IPortfolioProjectRepository } from "../../infrastructure/repositories/IPortfolioProjectRepository.js";

import { PortfolioProjectResponseMapper } from "../../infrastructure/mappers/PortfolioProjectResponseMapper.js";

import { PortfolioProjectResponseDto } from "../dto/PortfolioProjectResponseDto.js";

export class GetPortfolioProjectsByUserUseCase {

    constructor(

        private readonly repository: IPortfolioProjectRepository

    ) {}

    async execute(

        userId: string

    ): Promise<PortfolioProjectResponseDto[]> {

        const projects =

            await this.repository.findByUserId(
                userId
            );

        return projects.map(

            project =>

                PortfolioProjectResponseMapper.toDto(
                    project
                )

        );

    }

}
