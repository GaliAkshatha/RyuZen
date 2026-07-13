import { Alumni } from "../../domain/entities/Alumni.js";

import { AlumniModel } from "../persistence/AlumniModel.js";

import { AlumniMapper } from "../mappers/AlumniMapper.js";

import { IAlumniRepository, AlumniFilters } from "./IAlumniRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class AlumniRepository extends BaseRepository<Alumni>
implements IAlumniRepository {

    async create(

        alumni: Alumni

    ): Promise<Alumni> {

        const document =

            await AlumniModel.create(

                AlumniMapper.toPersistence(

                    alumni

                )

            );

        return AlumniMapper.toDomain(

            document

        );

    }

    async findById(

        id: string,

        options?: {
            includeInviteToken?: boolean;
        }

    ): Promise<Alumni | null> {

        const query =

            AlumniModel.findById(id);

        if (options?.includeInviteToken) {

            query.select("+inviteTokenHash");

        }

        const document =

            await query;

        if (!document) {

            return null;

        }

        return AlumniMapper.toDomain(

            document

        );

    }

    async findByEmail(

        organizationId: string,

        email: string,

        options?: {
            includeInviteToken?: boolean;
        }

    ): Promise<Alumni | null> {

        const query =

            AlumniModel.findOne({

                organizationId,

                email: email.toLowerCase()

            });

        if (options?.includeInviteToken) {

            query.select("+inviteTokenHash");

        }

        const document =

            await query;

        if (!document) {

            return null;

        }

        return AlumniMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Alumni | null> {

        const document =

            await AlumniModel.findOne({

                userId

            });

        if (!document) {

            return null;

        }

        return AlumniMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: AlumniFilters

    ): Promise<Alumni[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.status) {

            query.status =

                filters.status;

        }

        if (filters.isVerified !== undefined) {

            query.isVerified =

                filters.isVerified;

        }

        if (filters.graduationYear) {

            query.graduationYear =

                filters.graduationYear;

        }

        const documents =

            await AlumniModel.find(query)

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                AlumniMapper.toDomain(
                    document
                )

        );

    }

    async existsByUserId(

        userId: string

    ): Promise<boolean> {

        const document =

            await AlumniModel.findOne({

                userId

            });

        return !!document;

    }

    async existsByEmail(

        organizationId: string,

        email: string

    ): Promise<boolean> {

        const document =

            await AlumniModel.findOne({

                organizationId,

                email: email.toLowerCase()

            });

        return !!document;

    }

    async save(

        alumni: Alumni

    ): Promise<Alumni> {

        const document =

            await AlumniModel.findByIdAndUpdate(

                alumni.id,

                AlumniMapper.toPersistence(

                    alumni

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Alumni not found."

            );

        }

        return AlumniMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await AlumniModel.findByIdAndDelete(

            id

        );

    }

}
