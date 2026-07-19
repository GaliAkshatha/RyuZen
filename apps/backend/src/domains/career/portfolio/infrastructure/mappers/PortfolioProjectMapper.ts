import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

import {
    PortfolioProjectDocument
} from "../persistence/PortfolioProjectModel.js";

export class PortfolioProjectMapper {

    static toDomain(

        document: PortfolioProjectDocument

    ): PortfolioProject {

        return PortfolioProject.create({

            id:
                document.id,

            userId:
                document.userId.toString(),

            title:
                document.title,

            description:
                document.description,

            techStack:
                [...(document.techStack ?? [])],

            github:
                document.github,

            liveDemo:
                document.liveDemo,

            images:
                [...(document.images ?? [])],

            video:
                document.video,

            featured:
                document.featured,

            createdAt:
                document.createdAt,

            updatedAt:
                document.updatedAt

        });

    }

    static toPersistence(

        project: PortfolioProject

    ) {

        const data =
            project.toObject();

        return {

            userId:
                data.userId,

            title:
                data.title,

            description:
                data.description,

            techStack:
                data.techStack,

            github:
                data.github,

            liveDemo:
                data.liveDemo,

            images:
                data.images,

            video:
                data.video,

            featured:
                data.featured

        };

    }

}
