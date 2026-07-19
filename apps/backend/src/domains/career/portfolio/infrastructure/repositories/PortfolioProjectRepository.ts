import { PortfolioProject } from "../../domain/entities/PortfolioProject.js";

import { PortfolioProjectModel } from "../persistence/PortfolioProjectModel.js";

import { PortfolioProjectMapper } from "../mappers/PortfolioProjectMapper.js";

import { IPortfolioProjectRepository } from "./IPortfolioProjectRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class PortfolioProjectRepository extends BaseRepository<PortfolioProject>
implements IPortfolioProjectRepository {

    async create(

        project: PortfolioProject

    ): Promise<PortfolioProject> {

        const document =

            await PortfolioProjectModel.create(

                PortfolioProjectMapper.toPersistence(

                    project

                )

            );

        return PortfolioProjectMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<PortfolioProject | null> {

        const document =

            await PortfolioProjectModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return PortfolioProjectMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<PortfolioProject[]> {

        const documents =

            await PortfolioProjectModel.find({

                userId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                PortfolioProjectMapper.toDomain(
                    document
                )

        );

    }

    async save(

        project: PortfolioProject

    ): Promise<PortfolioProject> {

        const document =

            await PortfolioProjectModel.findByIdAndUpdate(

                project.id,

                PortfolioProjectMapper.toPersistence(

                    project

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Portfolio project not found."

            );

        }

        return PortfolioProjectMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await PortfolioProjectModel.findByIdAndDelete(

            id

        );

    }

}
