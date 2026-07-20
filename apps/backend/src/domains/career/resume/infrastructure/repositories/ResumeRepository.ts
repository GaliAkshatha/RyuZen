import { Resume } from "../../domain/entities/Resume.js";

import { ResumeModel } from "../persistence/ResumeModel.js";

import { ResumeMapper } from "../mappers/ResumeMapper.js";

import { IResumeRepository } from "./IResumeRepository.js";

export class ResumeRepository
implements IResumeRepository {

    async findByUserId(

        userId: string

    ): Promise<Resume | null> {

        const document =

            await ResumeModel.findOne({

                userId

            });

        if (!document) {

            return null;

        }

        return ResumeMapper.toDomain(

            document

        );

    }

    async upsert(

        resume: Resume

    ): Promise<Resume> {

        const document =

            await ResumeModel.findOneAndUpdate(

                {

                    userId:
                        resume.userId

                },

                ResumeMapper.toPersistence(

                    resume

                ),

                {

                    new: true,

                    upsert: true,

                    setDefaultsOnInsert: true

                }

            );

        return ResumeMapper.toDomain(

            document

        );

    }

}
