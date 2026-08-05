import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";

import { AttendanceRecordModel } from "../persistence/AttendanceRecordModel.js";
import { AttendanceRecordMapper } from "../mappers/AttendanceRecordMapper.js";

import { IAttendanceRecordRepository } from "./IAttendanceRecordRepository.js";

export class AttendanceRecordRepository
implements IAttendanceRecordRepository {

    async create(

        record: AttendanceRecord

    ): Promise<AttendanceRecord> {

        const document =
            await AttendanceRecordModel.create(

                AttendanceRecordMapper.toPersistence(
                    record
                )

            );

        return AttendanceRecordMapper.toDomain(
            document
        );

    }

    async findById(

        id: string

    ): Promise<AttendanceRecord | null> {

        const document =
            await AttendanceRecordModel.findById(id);

        return document
            ? AttendanceRecordMapper.toDomain(document)
            : null;

    }

    async findBySessionAndStudent(

        sessionId: string,

        studentId: string

    ): Promise<AttendanceRecord | null> {

        const document =
            await AttendanceRecordModel.findOne({ sessionId, studentId });

        return document
            ? AttendanceRecordMapper.toDomain(document)
            : null;

    }

    async findBySession(

        sessionId: string

    ): Promise<AttendanceRecord[]> {

        const documents =
            await AttendanceRecordModel.find({ sessionId });

        return documents.map(
            document => AttendanceRecordMapper.toDomain(document)
        );

    }

    async findByStudent(

        studentId: string

    ): Promise<AttendanceRecord[]> {

        const documents =
            await AttendanceRecordModel
                .find({ studentId })
                .sort({ markedAt: -1 });

        return documents.map(
            document => AttendanceRecordMapper.toDomain(document)
        );

    }

    async countDistinctStudentsByIpInSession(

        sessionId: string,

        ipAddress: string

    ): Promise<number> {

        const distinctStudentIds =

            await AttendanceRecordModel.distinct(
                "studentId",
                { sessionId, ipAddress }
            );

        return distinctStudentIds.length;

    }

    async save(

        record: AttendanceRecord

    ): Promise<AttendanceRecord> {

        const document =
            await AttendanceRecordModel.findByIdAndUpdate(

                record.id,

                AttendanceRecordMapper.toPersistence(
                    record
                ),

                {
                    new: true,
                    runValidators: true
                }

            );

        if (!document) {

            throw new Error(
                "Attendance record not found."
            );

        }

        return AttendanceRecordMapper.toDomain(
            document
        );

    }

}
