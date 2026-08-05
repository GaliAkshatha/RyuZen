import { AttendanceSession } from "../../domain/entities/AttendanceSession.js";

import { AttendanceSessionModel } from "../persistence/AttendanceSessionModel.js";
import { AttendanceSessionMapper } from "../mappers/AttendanceSessionMapper.js";

import { IAttendanceSessionRepository } from "./IAttendanceSessionRepository.js";

export class AttendanceSessionRepository
implements IAttendanceSessionRepository {

    async create(

        session: AttendanceSession

    ): Promise<AttendanceSession> {

        const document =
            await AttendanceSessionModel.create(

                AttendanceSessionMapper.toPersistence(
                    session
                )

            );

        return AttendanceSessionMapper.toDomain(
            document
        );

    }

    async findByIdWithSecret(

        id: string

    ): Promise<AttendanceSession | null> {

        const document =
            await AttendanceSessionModel.findById(id).select("+qrSecret");

        return document
            ? AttendanceSessionMapper.toDomain(document)
            : null;

    }

    async findById(

        id: string

    ): Promise<AttendanceSession | null> {

        const document =
            await AttendanceSessionModel.findById(id);

        return document
            ? AttendanceSessionMapper.toDomain(document)
            : null;

    }

    async findByFaculty(

        organizationId: string,

        facultyId: string

    ): Promise<AttendanceSession[]> {

        const documents =
            await AttendanceSessionModel
                .find({ organizationId, facultyId })
                .sort({ openedAt: -1 });

        return documents.map(
            document => AttendanceSessionMapper.toDomain(document)
        );

    }

    async save(

        session: AttendanceSession

    ): Promise<AttendanceSession> {

        const document =
            await AttendanceSessionModel.findByIdAndUpdate(

                session.id,

                AttendanceSessionMapper.toPersistence(
                    session
                ),

                {
                    new: true,
                    runValidators: true
                }

            ).select("+qrSecret");

        if (!document) {

            throw new Error(
                "Attendance session not found."
            );

        }

        return AttendanceSessionMapper.toDomain(
            document
        );

    }

}
