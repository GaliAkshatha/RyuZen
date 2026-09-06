import { randomBytes } from "crypto";

import { AttendanceSessionModel } from "../../src/domains/academic/attendance/infrastructure/persistence/AttendanceSessionModel.js";
import { AttendanceRecordModel } from "../../src/domains/academic/attendance/infrastructure/persistence/AttendanceRecordModel.js";

import { pickMany, randomInt, chance } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededStudent } from "../types.js";

const SUBJECTS = ["Data Structures", "Operating Systems", "Database Management", "Computer Networks"];

/**
 * Real, already-closed past sessions (a live rotating QR session
 * wouldn't make sense as seed data - the token itself is only ever
 * meaningful in real time). qrSecret is a real random value, matching
 * the schema's real requirement, even though no live session will
 * ever ask for it. Each session gets real per-student records with a
 * genuine status mix (mostly PRESENT, some LATE, a few ABSENT) - the
 * demo student is guaranteed a real PRESENT record in at least one
 * session, matching the same guarantee pattern used elsewhere.
 */
export async function seedAttendance(
  org: SeededOrganization,
  faculty: SeededFaculty[],
  students: SeededStudent[],
): Promise<void> {
  const demoStudent = students.find((s) => s.email.startsWith("student1@"));
  let demoMarked = false;

  for (const member of faculty.slice(0, 3)) {
    const sessionCount = randomInt(2, 3);

    for (let i = 0; i < sessionCount; i++) {
      const openedAt = new Date(Date.now() - randomInt(3, 60) * 24 * 60 * 60 * 1000);
      const closedAt = new Date(openedAt.getTime() + randomInt(45, 75) * 60 * 1000);

      const session = await AttendanceSessionModel.create({
        organizationId: org.id,
        facultyId: member.userId,
        subject: SUBJECTS[i % SUBJECTS.length],
        departmentId: member.departmentId,
        qrSecret: randomBytes(16).toString("hex"),
        qrRotationSeconds: 20,
        windowMinutes: 15,
        requireLocation: false,
        status: "CLOSED",
        openedAt,
        closedAt,
      });

      const attendees = pickMany(students, randomInt(6, Math.min(15, students.length)));
      const attendeeIds = new Set(attendees.map((s) => s.studentId));

      if (demoStudent && !demoMarked) {
        attendeeIds.add(demoStudent.studentId);
        demoMarked = true;
      }

      for (const studentId of attendeeIds) {
        const isDemo = demoStudent && studentId === demoStudent.studentId;
        const status = isDemo ? "PRESENT" : chance(0.75) ? "PRESENT" : chance(0.5) ? "LATE" : "ABSENT";

        if (status === "ABSENT") {
          continue;
        }

        await AttendanceRecordModel.create({
          organizationId: org.id,
          sessionId: session._id,
          studentId,
          method: chance(0.85) ? "QR" : "MANUAL",
          status,
          markedAt: new Date(openedAt.getTime() + randomInt(1, 40) * 60 * 1000),
          markedBy: member.userId,
        });
      }
    }
  }
}
