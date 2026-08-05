import { IAttendanceRecord } from "../interfaces/IAttendanceRecord.js";
import { AttendanceCorrectionStatus } from "../constants/AttendanceCorrectionStatus.js";
import { AttendanceRecordStatus } from "../constants/AttendanceRecordStatus.js";

export class AttendanceRecord {

    constructor(

        private readonly props: IAttendanceRecord

    ) {}

    static create(

        props: IAttendanceRecord

    ): AttendanceRecord {

        return new AttendanceRecord(props);

    }

    requestCorrection(

        reason: string

    ): void {

        if (this.props.correctionStatus === AttendanceCorrectionStatus.PENDING) {

            throw new Error(
                "A correction request is already pending for this record."
            );

        }

        this.props.correctionStatus = AttendanceCorrectionStatus.PENDING;

        this.props.correctionReason = reason;

    }

    reviewCorrection(

        approved: boolean,

        reviewedBy: string,

        newStatus?: AttendanceRecordStatus

    ): void {

        if (this.props.correctionStatus !== AttendanceCorrectionStatus.PENDING) {

            throw new Error(
                "There is no pending correction request to review."
            );

        }

        this.props.correctionStatus =
            approved ? AttendanceCorrectionStatus.APPROVED : AttendanceCorrectionStatus.REJECTED;

        this.props.correctionReviewedBy = reviewedBy;

        if (approved && newStatus) {

            this.props.status = newStatus;

        }

    }

    get id(): string | undefined {
        return this.props.id;
    }

    get organizationId(): string {
        return this.props.organizationId;
    }

    get sessionId(): string {
        return this.props.sessionId;
    }

    get studentId(): string {
        return this.props.studentId;
    }

    get method() {
        return this.props.method;
    }

    get status() {
        return this.props.status;
    }

    get markedAt(): Date {
        return this.props.markedAt;
    }

    get ipAddress(): string | undefined {
        return this.props.ipAddress;
    }

    get userAgent(): string | undefined {
        return this.props.userAgent;
    }

    get latitude(): number | undefined {
        return this.props.latitude;
    }

    get longitude(): number | undefined {
        return this.props.longitude;
    }

    get markedBy(): string | undefined {
        return this.props.markedBy;
    }

    get correctionStatus(): AttendanceCorrectionStatus | undefined {
        return this.props.correctionStatus;
    }

    get correctionReason(): string | undefined {
        return this.props.correctionReason;
    }

    get correctionReviewedBy(): string | undefined {
        return this.props.correctionReviewedBy;
    }

    toObject(): Readonly<IAttendanceRecord> {
        return Object.freeze({ ...this.props });
    }

}
