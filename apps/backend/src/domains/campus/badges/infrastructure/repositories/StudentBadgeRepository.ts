import { StudentBadge } from "../../domain/entities/StudentBadge.js";

import { StudentBadgeModel } from "../persistence/StudentBadgeModel.js";

import { StudentBadgeMapper } from "../mappers/StudentBadgeMapper.js";

import { IStudentBadgeRepository } from "./IStudentBadgeRepository.js";

export class StudentBadgeRepository
implements IStudentBadgeRepository {

    async create(

        studentBadge: StudentBadge

    ): Promise<StudentBadge> {

        const document =

            await StudentBadgeModel.create(

                StudentBadgeMapper.toPersistence(

                    studentBadge

                )

            );

        return StudentBadgeMapper.toDomain(

            document

        );

    }

    async findByStudent(

        studentId: string

    ): Promise<StudentBadge[]> {

        const documents =

            await StudentBadgeModel.find({

                studentId

            })

                .sort({

                    awardedAt: -1

                });

        return documents.map(

            document =>

                StudentBadgeMapper.toDomain(
                    document
                )

        );

    }

    async existsByStudentAndBadge(

        studentId: string,

        badgeId: string

    ): Promise<boolean> {

        const document =

            await StudentBadgeModel.findOne({

                studentId,

                badgeId

            });

        return !!document;

    }

}
