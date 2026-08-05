import { Recruiter } from "../../domain/entities/Recruiter.js";

import { RecruiterModel } from "../persistence/RecruiterModel.js";
import { RecruiterMapper } from "../mappers/RecruiterMapper.js";

import { IRecruiterRepository } from "./IRecruiterRepository.js";

export class RecruiterRepository
implements IRecruiterRepository {

    async create(

        recruiter: Recruiter

    ): Promise<Recruiter> {

        const document =
            await RecruiterModel.create(

                RecruiterMapper.toPersistence(
                    recruiter
                )

            );

        return RecruiterMapper.toDomain(
            document
        );

    }

    async findById(

        id: string

    ): Promise<Recruiter | null> {

        const document =
            await RecruiterModel.findById(id);

        return document
            ? RecruiterMapper.toDomain(document)
            : null;

    }

    async findByUserId(

        userId: string

    ): Promise<Recruiter | null> {

        const document =
            await RecruiterModel.findOne({ userId });

        return document
            ? RecruiterMapper.toDomain(document)
            : null;

    }

    async existsByUserId(

        userId: string

    ): Promise<boolean> {

        const count =
            await RecruiterModel.countDocuments({ userId });

        return count > 0;

    }

    async findByCompany(

        organizationId: string,

        companyId: string

    ): Promise<Recruiter[]> {

        const documents =
            await RecruiterModel.find({ organizationId, companyId });

        return documents.map(
            document => RecruiterMapper.toDomain(document)
        );

    }

    async save(

        recruiter: Recruiter

    ): Promise<Recruiter> {

        const document =
            await RecruiterModel.findByIdAndUpdate(

                recruiter.id,

                RecruiterMapper.toPersistence(
                    recruiter
                ),

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!document) {

            throw new Error(
                "Recruiter not found."
            );

        }

        return RecruiterMapper.toDomain(
            document
        );

    }

}
