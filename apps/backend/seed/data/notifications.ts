import { NotificationModel } from "../../src/domains/communication/notifications/infrastructure/persistence/NotificationModel.js";

import { pick, pickMany } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededStudent } from "../types.js";

/**
 * Real notifications matching the exact real sender-role rules
 * SendNotificationUseCase enforces (Org Admin: ALL/FACULTY/STUDENT/ALUMNI;
 * Faculty: STUDENT only, optionally department-scoped) - seeded
 * directly via the model since this is offline seed data, not a live
 * HTTP call, but shaped exactly as that real enforcement would allow,
 * so the notification UI has real, valid data to render and the
 * mark-as-read flow has a genuine mix of read/unread to exercise.
 */
export async function seedNotifications(org: SeededOrganization, faculty: SeededFaculty[], students: SeededStudent[]): Promise<void> {
  let created = 0;

  await NotificationModel.create({
    organizationId: org.id,
    senderId: org.orgAdmin.id,
    title: "Welcome to the new semester",
    message: `Welcome back to ${org.name}! Check the Activities tab for what's open this term.`,
    type: "ANNOUNCEMENT",
    targetAudience: "ALL",
    readBy: [],
  });
  created++;

  if (org.departments.length > 0) {
    const targetDept = pick(org.departments);
    const readers = pickMany(
      students.filter((s) => s.departmentId === targetDept.id),
      2,
    );

    await NotificationModel.create({
      organizationId: org.id,
      senderId: org.orgAdmin.id,
      title: `${targetDept.name} department update`,
      message: `A new placement drive relevant to ${targetDept.name} students has been published - check the Drives tab.`,
      type: "INFO",
      targetAudience: "STUDENT",
      departmentIds: [targetDept.id],
      readBy: readers.map((s) => s.userId),
    });
    created++;
  }

  if (faculty.length > 0 && students.length > 0) {
    const sender = pick(faculty);
    const readers = pickMany(students, Math.min(3, students.length));

    await NotificationModel.create({
      organizationId: org.id,
      senderId: sender.userId,
      title: "Assignment deadline reminder",
      message: "Reminder: submissions for open activities are due soon. Don't wait until the last day.",
      type: "REMINDER",
      targetAudience: "STUDENT",
      readBy: readers.map((s) => s.userId),
    });
    created++;
  }

  console.log(`Seed: created ${created} notifications for "${org.name}"`);
}
