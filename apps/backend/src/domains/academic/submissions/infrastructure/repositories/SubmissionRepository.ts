import { Submission } from "../../domain/entities/Submission.js";

import { SubmissionMapper } from "../mappers/SubmissionMapper.js";
import { SubmissionModel } from "../persistence/SubmissionModel.js";

import { SubmissionFilter } from "../../application/dto/SubmissionFilter.js";

import { ISubmissionRepository } from "./ISubmissionRepository.js";

export class SubmissionRepository

implements ISubmissionRepository {

    async create(

        submission: Submission

    ): Promise<Submission> {

        const document =

            await SubmissionModel.create(

                SubmissionMapper.toPersistence(

                    submission

                )

            );

        return SubmissionMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Submission | null> {

        const document =

            await SubmissionModel.findById(

                id

            );

        return document

            ? SubmissionMapper.toDomain(

                document

            )

            : null;

    }

    async findAll(

        filter: SubmissionFilter

    ): Promise<Submission[]> {

        const query: Record<string, unknown> = {};

        if (

            filter.organizationId

        ) {

            query.organizationId =

                filter.organizationId;

        }

        if (

            filter.activityId

        ) {

            query.activityId =

                filter.activityId;

        }

        if (

            filter.submittedBy

        ) {

            query.submittedBy =

                filter.submittedBy;

        }

        if (

            filter.status

        ) {

            query.status =

                filter.status;

        }

        const documents =

            await SubmissionModel.find(

                query

            ).sort({

                createdAt: -1

            });

        return documents.map(

            SubmissionMapper.toDomain

        );

    }

    async save(

        submission: Submission

    ): Promise<Submission> {

        const document =

            await SubmissionModel.findByIdAndUpdate(

                submission.id,

                SubmissionMapper.toPersistence(

                    submission

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Submission not found."

            );

        }

        return SubmissionMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await SubmissionModel.findByIdAndDelete(

            id

        );

    }

}