import { ResumeTemplate } from "../../domain/entities/ResumeTemplate.js";

import { ResumeTemplateModel } from "../persistence/ResumeTemplateModel.js";

import { ResumeTemplateMapper } from "../mappers/ResumeTemplateMapper.js";

import { IResumeTemplateRepository } from "./IResumeTemplateRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class ResumeTemplateRepository extends BaseRepository<ResumeTemplate>
implements IResumeTemplateRepository {

    async create(

        template: ResumeTemplate

    ): Promise<ResumeTemplate> {

        const document =

            await ResumeTemplateModel.create(

                ResumeTemplateMapper.toPersistence(

                    template

                )

            );

        return ResumeTemplateMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<ResumeTemplate | null> {

        const document =

            await ResumeTemplateModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return ResumeTemplateMapper.toDomain(

            document

        );

    }

    async findAll(): Promise<ResumeTemplate[]> {

        const documents =

            await ResumeTemplateModel.find()

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                ResumeTemplateMapper.toDomain(
                    document
                )

        );

    }

    async existsByName(

        name: string

    ): Promise<boolean> {

        const document =

            await ResumeTemplateModel.findOne({

                name

            });

        return !!document;

    }

    async save(

        template: ResumeTemplate

    ): Promise<ResumeTemplate> {

        const document =

            await ResumeTemplateModel.findByIdAndUpdate(

                template.id,

                ResumeTemplateMapper.toPersistence(

                    template

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Resume template not found."

            );

        }

        return ResumeTemplateMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await ResumeTemplateModel.findByIdAndDelete(

            id

        );

    }

}
