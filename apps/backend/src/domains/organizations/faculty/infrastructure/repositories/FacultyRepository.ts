import { IFacultyRepository } from "./IFacultyRepository.js";

import { Faculty } from "../../domain/entities/Faculty.js";

import { FacultyModel } from "../persistence/FacultyModel.js";
import { FacultyMapper } from "../mappers/FacultyMapper.js";

export class FacultyRepository
implements IFacultyRepository {

    async create(
        faculty: Faculty
    ): Promise<Faculty> {

        const document =
            await FacultyModel.create(
                faculty.toObject()
            );

        return FacultyMapper.toDomain(
            document
        );

    }

    async findById(
        id: string
    ): Promise<Faculty | null> {

        const document =
            await FacultyModel.findById(id);

        return document
            ? FacultyMapper.toDomain(document)
            : null;

    }

    async findByUserId(
        userId: string
    ): Promise<Faculty | null> {

        const document =
            await FacultyModel.findOne({

                userId

            });

        return document
            ? FacultyMapper.toDomain(document)
            : null;

    }

    async findByDepartment(
        departmentId: string
    ): Promise<Faculty[]> {

        const documents =
            await FacultyModel.find({

                departmentId

            }).sort({

                employeeId: 1

            });

        return documents.map(
            FacultyMapper.toDomain
        );

    }

    async existsByEmployeeId(
        organizationId: string,
        employeeId: string
    ): Promise<boolean> {

        return await FacultyModel.exists({

            organizationId,

            employeeId

        }) !== null;

    }

}