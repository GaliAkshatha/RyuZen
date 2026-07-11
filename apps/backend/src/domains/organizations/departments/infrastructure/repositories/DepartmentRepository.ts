import { IDepartmentRepository } from "./IDepartmentRepository.js";

import { Department } from "../../domain/entities/Department.js";

import { DepartmentModel } from "../persistence/DepartmentModel.js";
import { DepartmentMapper } from "../mappers/DepartmentMapper.js";

import { DepartmentStatus } from "../../domain/constants/DepartmentStatus.js";

export class DepartmentRepository
implements IDepartmentRepository {

    async create(
        department: Department
    ): Promise<Department> {

        const document =
            await DepartmentModel.create(
                department.toObject()
            );

        return DepartmentMapper.toDomain(
            document
        );

    }

    async findById(
        id: string
    ): Promise<Department | null> {

        const document =
            await DepartmentModel.findById(id);

        return document
            ? DepartmentMapper.toDomain(document)
            : null;

    }

    async findByOrganization(
        organizationId: string
    ): Promise<Department[]> {

        const documents =
            await DepartmentModel.find({
                organizationId
            }).sort({
                name: 1
            });

        return documents.map(
            DepartmentMapper.toDomain
        );

    }

    async findByCode(
        organizationId: string,
        code: string
    ): Promise<Department | null> {

        const document =
            await DepartmentModel.findOne({
                organizationId,
                code
            });

        return document
            ? DepartmentMapper.toDomain(document)
            : null;

    }

    async existsByCode(
        organizationId: string,
        code: string
    ): Promise<boolean> {

        return await DepartmentModel.exists({
            organizationId,
            code
        }) !== null;

    }

    async updateHead(

        departmentId: string,

        headId: string

    ): Promise<void> {

        await DepartmentModel.updateOne(

            {

                _id: departmentId

            },

            {

                $set: {

                    headId

                }

            }

        );

    }

    async updateStatus(

        departmentId: string,

        status: DepartmentStatus

    ): Promise<void> {

        await DepartmentModel.updateOne(

            {

                _id: departmentId

            },

            {

                $set: {

                    status

                }

            }

        );

    }
}