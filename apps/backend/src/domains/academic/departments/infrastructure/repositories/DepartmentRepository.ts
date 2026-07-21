import { Department } from "../../domain/entities/Department.js";

import { DepartmentModel } from "../persistence/DepartmentModel.js";

import { DepartmentMapper } from "../mappers/DepartmentMapper.js";

import { IDepartmentRepository } from "./IDepartmentRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class DepartmentRepository extends BaseRepository<Department>
implements IDepartmentRepository {

    async create(

        department: Department

    ): Promise<Department> {

        const document =

            await DepartmentModel.create(

                DepartmentMapper.toPersistence(

                    department

                )

            );

        return DepartmentMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Department | null> {

        const document =

            await DepartmentModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return DepartmentMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string

    ): Promise<Department[]> {

        const documents =

            await DepartmentModel.find({

                organizationId

            })

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                DepartmentMapper.toDomain(
                    document
                )

        );

    }

    async existsByCode(

        organizationId: string,

        code: string

    ): Promise<boolean> {

        const document =

            await DepartmentModel.findOne({

                organizationId,

                code: code.toUpperCase()

            });

        return !!document;

    }

    async save(

        department: Department

    ): Promise<Department> {

        const document =

            await DepartmentModel.findByIdAndUpdate(

                department.id,

                DepartmentMapper.toPersistence(

                    department

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Department not found."

            );

        }

        return DepartmentMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await DepartmentModel.findByIdAndDelete(

            id

        );

    }

}
