import { Education } from "../../domain/entities/Education.js";

import { EducationModel } from "../persistence/EducationModel.js";

import { EducationMapper } from "../mappers/EducationMapper.js";

import { IEducationRepository } from "./IEducationRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class EducationRepository extends BaseRepository<Education>
implements IEducationRepository {

    async create(

        education: Education

    ): Promise<Education> {

        const document =

            await EducationModel.create(

                EducationMapper.toPersistence(

                    education

                )

            );

        return EducationMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Education | null> {

        const document =

            await EducationModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return EducationMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Education[]> {

        const documents =

            await EducationModel.find({

                userId

            })

                .sort({

                    startYear: -1

                });

        return documents.map(

            document =>

                EducationMapper.toDomain(
                    document
                )

        );

    }

    async save(

        education: Education

    ): Promise<Education> {

        const document =

            await EducationModel.findByIdAndUpdate(

                education.id,

                EducationMapper.toPersistence(

                    education

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Education not found."

            );

        }

        return EducationMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await EducationModel.findByIdAndDelete(

            id

        );

    }

}
