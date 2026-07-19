import { IPortfolioProjectRepository } from "../../infrastructure/repositories/IPortfolioProjectRepository.js";

import { PortfolioProjectResponseMapper } from "../../infrastructure/mappers/PortfolioProjectResponseMapper.js";

import { UpdatePortfolioProjectDto } from "../dto/UpdatePortfolioProjectDto.js";
import { PortfolioProjectResponseDto } from "../dto/PortfolioProjectResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class UpdatePortfolioProjectUseCase {

    constructor(

        private readonly repository: IPortfolioProjectRepository

    ) {}

    async execute(

        id: string,

        userId: string,

        dto: UpdatePortfolioProjectDto

    ): Promise<PortfolioProjectResponseDto> {

        const project =

            await this.repository.findById(
                id
            );

        if (!project) {

            throw new ApiError(

                "Portfolio project not found.",

                HttpStatus.NOT_FOUND

            );

        }

        if (project.userId !== userId) {

            throw new ApiError(

                "You can only update your own portfolio projects.",

                HttpStatus.FORBIDDEN

            );

        }

        project.updateDetails(dto);

        const updated =

            await this.repository.save(
                project
            );

        return PortfolioProjectResponseMapper.toDto(

            updated

        );

    }

}
