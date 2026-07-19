import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

import { IPortfolioProjectRepository } from "../../infrastructure/repositories/IPortfolioProjectRepository.js";

import { PortfolioProjectResponseMapper } from "../../infrastructure/mappers/PortfolioProjectResponseMapper.js";

import { CreatePortfolioProjectDto } from "../dto/CreatePortfolioProjectDto.js";
import { PortfolioProjectResponseDto } from "../dto/PortfolioProjectResponseDto.js";

export class CreatePortfolioProjectUseCase {

    constructor(

        private readonly repository: IPortfolioProjectRepository

    ) {}

    async execute(

        dto: CreatePortfolioProjectDto,

        userId: string

    ): Promise<PortfolioProjectResponseDto> {

        const project = PortfolioProject.create({

            userId,

            title:
                dto.title,

            description:
                dto.description,

            techStack:
                dto.techStack ?? [],

            github:
                dto.github,

            liveDemo:
                dto.liveDemo,

            images:
                dto.images ?? [],

            video:
                dto.video,

            featured:
                dto.featured ?? false

        });

        const created =

            await this.repository.create(

                project

            );

        return PortfolioProjectResponseMapper.toDto(

            created

        );

    }

}
