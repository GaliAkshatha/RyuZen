import { Faculty } from "../../domain/entities/Faculty.js";

import { FacultyModel } from "../persistence/FacultyModel.js";

import { FacultyMapper } from "../mappers/FacultyMapper.js";

import { IFacultyRepository, FacultyFilters } from "./IFacultyRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class FacultyRepository extends BaseRepository<Faculty>
implements IFacultyRepository {

    async create(

        faculty: Faculty

    ): Promise<Faculty> {

        const document =

            await FacultyModel.create(

                FacultyMapper.toPersistence(

                    faculty

                )

            );

        return FacultyMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Faculty | null> {

        const document =

            await FacultyModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return FacultyMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Faculty | null> {

        const document =

            await FacultyModel.findOne({

                userId

            });

        if (!document) {

            return null;

        }

        return FacultyMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: FacultyFilters

    ): Promise<Faculty[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.departmentId) {

            query.departmentId =

                filters.departmentId;

        }

        const documents =

            await FacultyModel.find(query)

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                FacultyMapper.toDomain(
                    document
                )

        );

    }

    async existsByUserId(

        userId: string

    ): Promise<boolean> {

        const document =

            await FacultyModel.findOne({

                userId

            });

        return !!document;

    }

    async existsByEmployeeId(

        organizationId: string,

        employeeId: string

    ): Promise<boolean> {

        const document =

            await FacultyModel.findOne({

                organizationId,

                employeeId

            });

        return !!document;

    }

    async save(

        faculty: Faculty

    ): Promise<Faculty> {

        const document =

            await FacultyModel.findByIdAndUpdate(

                faculty.id,

                FacultyMapper.toPersistence(

                    faculty

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Faculty not found."

            );

        }

        return FacultyMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await FacultyModel.findByIdAndDelete(

            id

        );

    }

}
