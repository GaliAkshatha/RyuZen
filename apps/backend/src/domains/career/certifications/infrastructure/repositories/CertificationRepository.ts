import { Certification } from "../../domain/entities/Certification.js";

import { CertificationModel } from "../persistence/CertificationModel.js";

import { CertificationMapper } from "../mappers/CertificationMapper.js";

import { ICertificationRepository } from "./ICertificationRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class CertificationRepository extends BaseRepository<Certification>
implements ICertificationRepository {

    async create(

        certification: Certification

    ): Promise<Certification> {

        const document =

            await CertificationModel.create(

                CertificationMapper.toPersistence(

                    certification

                )

            );

        return CertificationMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Certification | null> {

        const document =

            await CertificationModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return CertificationMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Certification[]> {

        const documents =

            await CertificationModel.find({

                userId

            })

                .sort({

                    issueDate: -1

                });

        return documents.map(

            document =>

                CertificationMapper.toDomain(
                    document
                )

        );

    }

    async save(

        certification: Certification

    ): Promise<Certification> {

        const document =

            await CertificationModel.findByIdAndUpdate(

                certification.id,

                CertificationMapper.toPersistence(

                    certification

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Certification not found."

            );

        }

        return CertificationMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await CertificationModel.findByIdAndDelete(

            id

        );

    }

}
