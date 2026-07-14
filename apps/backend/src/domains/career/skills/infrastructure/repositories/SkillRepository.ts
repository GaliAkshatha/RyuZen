import { Skill } from "../../domain/entities/Skill.js";

import { SkillModel } from "../persistence/SkillModel.js";

import { SkillMapper } from "../mappers/SkillMapper.js";

import { ISkillRepository } from "./ISkillRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class SkillRepository extends BaseRepository<Skill>
implements ISkillRepository {

    async create(

        skill: Skill

    ): Promise<Skill> {

        const document =

            await SkillModel.create(

                SkillMapper.toPersistence(

                    skill

                )

            );

        return SkillMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Skill | null> {

        const document =

            await SkillModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return SkillMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Skill[]> {

        const documents =

            await SkillModel.find({

                userId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                SkillMapper.toDomain(
                    document
                )

        );

    }

    async existsByUserIdAndName(

        userId: string,

        name: string

    ): Promise<boolean> {

        const document =

            await SkillModel.findOne({

                userId,

                name

            });

        return !!document;

    }

    async save(

        skill: Skill

    ): Promise<Skill> {

        const document =

            await SkillModel.findByIdAndUpdate(

                skill.id,

                SkillMapper.toPersistence(

                    skill

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Skill not found."

            );

        }

        return SkillMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await SkillModel.findByIdAndDelete(

            id

        );

    }

}
