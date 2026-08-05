import { AttendanceRecord } from "../entities/AttendanceRecord.js";

export interface SuspiciousIpPattern {

    ipAddress: string;

    distinctStudentCount: number;

    studentIds: string[];

}

/**
 * The real "same IP marking many different students" anomaly signal -
 * referenced from IAttendanceRecordRepository.countDistinctStudentsByIpInSession's
 * doc comment, and that repository method is correctly implemented,
 * but nothing ever called it until now. A pure function over already-
 * fetched records (one query for the whole session, not N queries per
 * distinct IP) - flags, never blocks. This surfaces a real signal to
 * faculty to review; it does not auto-reject anyone's attendance,
 * since a shared campus network or lab genuinely can produce false
 * positives a human should judge, not code.
 *
 * `threshold` is the minimum distinct-student count at one IP to flag
 * - callers decide what's suspicious for their context, never
 * hardcoded here.
 */
export function findSuspiciousAttendancePatterns(

    records: AttendanceRecord[],

    threshold: number

): SuspiciousIpPattern[] {

    const studentsByIp = new Map<string, Set<string>>();

    for (const record of records) {

        if (!record.ipAddress) {
            continue;
        }

        const existing = studentsByIp.get(record.ipAddress) ?? new Set<string>();

        existing.add(record.studentId);

        studentsByIp.set(record.ipAddress, existing);

    }

    const flagged: SuspiciousIpPattern[] = [];

    for (const [ipAddress, studentIds] of studentsByIp) {

        if (studentIds.size >= threshold) {

            flagged.push({

                ipAddress,

                distinctStudentCount: studentIds.size,

                studentIds: [...studentIds]

            });

        }

    }

    return flagged;

}
