import { JobApplication } from "../../domain/entities/JobApplication.js";

import { JobApplicationModel } from "../persistence/JobApplicationModel.js";

import { JobApplicationMapper } from "../mappers/JobApplicationMapper.js";

import { IJobApplicationRepository } from "./IJobApplicationRepository.js";

export class JobApplicationRepository
implements IJobApplicationRepository {

    async create(

        application: JobApplication

    ): Promise<JobApplication> {

        const document =

            await JobApplicationModel.create(

                JobApplicationMapper.toPersistence(

                    application

                )

            );

        return JobApplicationMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<JobApplication | null> {

        const document =

            await JobApplicationModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return JobApplicationMapper.toDomain(

            document

        );

    }

    async findByPlacement(

        placementId: string

    ): Promise<JobApplication[]> {

        const documents =

            await JobApplicationModel.find({

                placementId

            })

                .sort({

                    appliedAt: -1

                });

        return documents.map(

            document =>

                JobApplicationMapper.toDomain(
                    document
                )

        );

    }

    async findByStudent(

        studentId: string

    ): Promise<JobApplication[]> {

        const documents =

            await JobApplicationModel.find({

                studentId

            })

                .sort({

                    appliedAt: -1

                });

        return documents.map(

            document =>

                JobApplicationMapper.toDomain(
                    document
                )

        );

    }

    async existsByPlacementAndStudent(

        placementId: string,

        studentId: string

    ): Promise<boolean> {

        const document =

            await JobApplicationModel.findOne({

                placementId,

                studentId

            });

        return !!document;

    }

    async save(

        application: JobApplication

    ): Promise<JobApplication> {

        const document =

            await JobApplicationModel.findByIdAndUpdate(

                application.id,

                JobApplicationMapper.toPersistence(

                    application

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Job application not found."

            );

        }

        return JobApplicationMapper.toDomain(

            document

        );

    }

}
