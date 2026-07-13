import { Student } from "../../domain/entities/Student.js";

import { StudentModel } from "../persistence/StudentModel.js";

import { StudentMapper } from "../mappers/StudentMapper.js";

import { IStudentRepository, StudentFilters } from "./IStudentRepository.js";

import { BaseRepository } from "../../../../../shared/core/repository/BaseRepository.js";

export class StudentRepository extends BaseRepository<Student>
implements IStudentRepository {

    async create(

        student: Student

    ): Promise<Student> {

        const document =

            await StudentModel.create(

                StudentMapper.toPersistence(

                    student

                )

            );

        return StudentMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<Student | null> {

        const document =

            await StudentModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return StudentMapper.toDomain(

            document

        );

    }

    async findByUserId(

        userId: string

    ): Promise<Student | null> {

        const document =

            await StudentModel.findOne({

                userId

            });

        if (!document) {

            return null;

        }

        return StudentMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: StudentFilters

    ): Promise<Student[]> {

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.departmentId) {

            query.departmentId =

                filters.departmentId;

        }

        if (filters.batch) {

            query.batch =

                filters.batch;

        }

        if (filters.semester) {

            query.semester =

                filters.semester;

        }

        const documents =

            await StudentModel.find(query)

                .sort({

                    createdAt: -1

                });

        return documents.map(

            document =>

                StudentMapper.toDomain(
                    document
                )

        );

    }

    async existsByUserId(

        userId: string

    ): Promise<boolean> {

        const document =

            await StudentModel.findOne({

                userId

            });

        return !!document;

    }

    async existsByUsn(

        organizationId: string,

        usn: string

    ): Promise<boolean> {

        const document =

            await StudentModel.findOne({

                organizationId,

                usn: usn.toUpperCase()

            });

        return !!document;

    }

    async save(

        student: Student

    ): Promise<Student> {

        const document =

            await StudentModel.findByIdAndUpdate(

                student.id,

                StudentMapper.toPersistence(

                    student

                ),

                {

                    new: true,

                    runValidators: true

                }

            );

        if (!document) {

            throw new Error(

                "Student not found."

            );

        }

        return StudentMapper.toDomain(

            document

        );

    }

    async delete(

        id: string

    ): Promise<void> {

        await StudentModel.findByIdAndDelete(

            id

        );

    }

}
