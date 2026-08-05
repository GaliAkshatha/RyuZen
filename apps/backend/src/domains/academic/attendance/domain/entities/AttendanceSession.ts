import { IAttendanceSession } from "../interfaces/IAttendanceSession.js";
import { AttendanceSessionStatus } from "../constants/AttendanceSessionStatus.js";

export class AttendanceSession {

    constructor(

        private readonly props: IAttendanceSession

    ) {}

    static create(

        props: IAttendanceSession

    ): AttendanceSession {

        return new AttendanceSession(props);

    }

    close(): void {

        if (this.props.status === AttendanceSessionStatus.CLOSED) {

            throw new Error(
                "This attendance session is already closed."
            );

        }

        this.props.status = AttendanceSessionStatus.CLOSED;

        this.props.closedAt = new Date();

    }

    /** The real configurable window - a mark is only valid while the session is OPEN and still within its configured windowMinutes from opening. */
    isAcceptingMarks(): boolean {

        if (this.props.status === AttendanceSessionStatus.CLOSED) {
            return false;
        }

        const windowEndsAt =
            this.props.openedAt.getTime() + this.props.windowMinutes * 60 * 1000;

        return Date.now() <= windowEndsAt;

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get facultyId(): string {
        return this.props.facultyId;
    }

    get subject(): string {
        return this.props.subject;
    }

    get departmentId(): string | undefined {
        return this.props.departmentId;
    }

    get qrSecret(): string {
        return this.props.qrSecret;
    }

    get qrRotationSeconds(): number {
        return this.props.qrRotationSeconds;
    }

    get windowMinutes(): number {
        return this.props.windowMinutes;
    }

    get requireLocation(): boolean {
        return this.props.requireLocation;
    }

    get latitude(): number | undefined {
        return this.props.latitude;
    }

    get longitude(): number | undefined {
        return this.props.longitude;
    }

    get radiusMeters(): number | undefined {
        return this.props.radiusMeters;
    }

    get status(): AttendanceSessionStatus {
        return this.props.status;
    }

    get openedAt(): Date {
        return this.props.openedAt;
    }

    get closedAt(): Date | undefined {
        return this.props.closedAt;
    }

    toObject(): Readonly<IAttendanceSession> {
        return Object.freeze({ ...this.props });
    }

}
