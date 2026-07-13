import { Mentorship } from "../../domain/entities/Mentorship.js";

import { MentorshipModel } from "../persistence/MentorshipModel.js";

import { MentorshipMapper } from "../mappers/MentorshipMapper.js";

import { IMentorshipRepository, MentorshipFilters } from "./IMentorshipRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class MentorshipRepository extends BaseRepository<Mentorship>
implements IMentorshipRepository {

    async create(

        mentorship: Mentorship

    ): Promise<Mentorship> {

        const document =

            await MentorshipModel.create(

                MentorshipMapper.toPersistence(

                    mentorship

                )

            );

        return MentorshipMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Mentorship | null> {

        const document =

            await MentorshipModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return MentorshipMapper.toDomain(

            document

        );

    }

    async findActiveByStudentId(

        studentId: string

    ): Promise<Mentorship | null> {

        const document =

            await MentorshipModel.findOne({

                studentId,

                status: "ACTIVE"

            });

        if (!document) {

            return null;

        }

        return MentorshipMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: MentorshipFilters

    ): Promise<Mentorship[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.studentId) {

            query.studentId =

                filters.studentId;

        }

        if (filters.facultyId) {

            query.facultyId =

                filters.facultyId;

        }

        if (filters.status) {

            query.status =

                filters.status;

        }

        const documents =

            await MentorshipModel.find(query)

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                MentorshipMapper.toDomain(
                    document
                )

        );

    }

    async save(

        mentorship: Mentorship

    ): Promise<Mentorship> {

        const document =

            await MentorshipModel.findByIdAndUpdate(

                mentorship.id,

                MentorshipMapper.toPersistence(

                    mentorship

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Mentorship not found."

            );

        }

        return MentorshipMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await MentorshipModel.findByIdAndDelete(

            id

        );

    }

}
