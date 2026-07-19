import { IPortfolioProjectRepository } from "../../infrastructure/repositories/IPortfolioProjectRepository.js";

import { PortfolioProjectResponseMapper } from "../../infrastructure/mappers/PortfolioProjectResponseMapper.js";

import { PortfolioProjectResponseDto } from "../dto/PortfolioProjectResponseDto.js";

import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

export class GetPortfolioProjectUseCase {

    constructor(

        private readonly repository: IPortfolioProjectRepository

    ) {}

    async execute(

        id: string

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

        return PortfolioProjectResponseMapper.toDto(

            project

        );

    }

}
