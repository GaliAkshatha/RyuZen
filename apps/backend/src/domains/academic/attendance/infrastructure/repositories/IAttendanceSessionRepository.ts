import { AttendanceSession } from "../../domain/entities/AttendanceSession.js";

export interface IAttendanceSessionRepository {

    create(
        session: AttendanceSession
    ): Promise<AttendanceSession>;

    /** Includes the real qrSecret - only ever called by the specific use cases that need to verify a scanned token, never for general display. */
    findByIdWithSecret(
        id: string
    ): Promise<AttendanceSession | null>;

    findById(
        id: string
    ): Promise<AttendanceSession | null>;

    findByFaculty(
        organizationId: string,
        facultyId: string
    ): Promise<AttendanceSession[]>;

    save(
        session: AttendanceSession
    ): Promise<AttendanceSession>;

}
