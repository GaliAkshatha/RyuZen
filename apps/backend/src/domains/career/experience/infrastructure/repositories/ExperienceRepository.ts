import { Experience } from "../../domain/entities/Experience.js";

import { ExperienceModel } from "../persistence/ExperienceModel.js";

import { ExperienceMapper } from "../mappers/ExperienceMapper.js";

import { IExperienceRepository } from "./IExperienceRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class ExperienceRepository extends BaseRepository<Experience>
implements IExperienceRepository {

    async create(

        experience: Experience

    ): Promise<Experience> {

        const document =

            await ExperienceModel.create(

                ExperienceMapper.toPersistence(

                    experience

                )

            );

        return ExperienceMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Experience | null> {

        const document =

            await ExperienceModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return ExperienceMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Experience[]> {

        const documents =

            await ExperienceModel.find({

                userId

            })

                .sort({

                    startDate: -1

                });

        return documents.map(

            document =>

                ExperienceMapper.toDomain(
                    document
                )

        );

    }

    async save(

        experience: Experience

    ): Promise<Experience> {

        const document =

            await ExperienceModel.findByIdAndUpdate(

                experience.id,

                ExperienceMapper.toPersistence(

                    experience

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Experience not found."

            );

        }

        return ExperienceMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await ExperienceModel.findByIdAndDelete(

            id

        );

    }

}
