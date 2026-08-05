import { AttendanceRecord } from "../../domain/entities/AttendanceRecord.js";

export interface IAttendanceRecordRepository {

    create(
        record: AttendanceRecord
    ): Promise<AttendanceRecord>;

    findById(
        id: string
    ): Promise<AttendanceRecord | null>;

    findBySessionAndStudent(
        sessionId: string,
        studentId: string
    ): Promise<AttendanceRecord | null>;

    findBySession(
        sessionId: string
    ): Promise<AttendanceRecord[]>;

    findByStudent(
        studentId: string
    ): Promise<AttendanceRecord[]>;

    /** Real anomaly-detection query - how many DIFFERENT students were marked from this same IP in this session. */
    countDistinctStudentsByIpInSession(
        sessionId: string,
        ipAddress: string
    ): Promise<number>;

    save(
        record: AttendanceRecord
    ): Promise<AttendanceRecord>;

}
