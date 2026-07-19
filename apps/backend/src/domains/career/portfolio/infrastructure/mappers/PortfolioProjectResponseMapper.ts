import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

import { PortfolioProjectResponseDto } from "../../application/dto/PortfolioProjectResponseDto.js";

export class PortfolioProjectResponseMapper {

    static toDto(

        project: PortfolioProject

    ): PortfolioProjectResponseDto {

        return {

            id:
                project.id!,

            userId:
                project.userId,

            title:
                project.title,

            description:
                project.description,

            techStack:
                project.techStack,

            github:
                project.github,

            liveDemo:
                project.liveDemo,

            images:
                project.images,

            video:
                project.video,

            featured:
                project.featured,

            createdAt:
                project.createdAt,

            updatedAt:
                project.updatedAt

        };

    }

}
