import { SubmissionModel } from "../../src/domains/academic/submissions/infrastructure/persistence/SubmissionModel.js";
import { SubmissionStatus } from "../../src/domains/academic/submissions/domain/constants/SubmissionStatus.js";

import { chance, randomInt } from "../utils/random.js";
import type { SeededActivity, SeededStudent } from "../types.js";

const REJECTION_REASONS = [
  "Submission does not meet the activity requirements - please review the brief and resubmit.",
  "Missing required attachment - link provided does not contain the requested work.",
  "Late submission past the activity deadline.",
];

/**
 * Creates real submissions from students to published activities in
 * their own department - a realistic mix: most students who submit
 * get APPROVED (with real pointsAwarded feeding the leaderboard),
 * some are left PENDING (genuinely awaiting faculty review), a few
 * are REJECTED with real feedback explaining why (the "penalty" case
 * requested - a rejection with no points, not a separate mechanism).
 * Deliberately not every student submits to every activity - some
 * students have zero submissions, matching realistic participation
 * rather than perfect coverage.
 *
 * One real, confirmed exception: the demo-designated student
 * (student1@<code>.edu, hardcoded in the frontend's demoAccounts.ts)
 * is guaranteed real APPROVED submissions for their first few
 * eligible activities, bypassing the random chance() rolls that
 * apply to everyone else. Confirmed via an actual real recorded
 * session: leaving this fully randomized meant student1 could
 * genuinely roll zero submissions across every activity, landing
 * demo visitors on a student account with no leaderboard standing
 * and no career score at all - a real gap for the one account this
 * platform's own landing page sends visitors into by name.
 */
export async function seedSubmissions(
  organizationId: string,
  activities: SeededActivity[],
  students: SeededStudent[],
): Promise<Map<string, number>> {
  const pointsByStudent = new Map<string, number>();
  let created = 0;

  const demoStudent = students.find((s) => s.email.startsWith("student1@"));
  let demoApprovedCount = 0;
  const DEMO_MIN_APPROVED = 3;

  for (const activity of activities) {
    const departmentStudents = students.filter((s) => s.departmentId === activity.departmentId);

    for (const student of departmentStudents) {
      const isDemoStudent = demoStudent?.userId === student.userId;
      const guaranteeApproval = isDemoStudent && demoApprovedCount < DEMO_MIN_APPROVED;

      if (!guaranteeApproval && !chance(0.65)) continue;

      const outcome = guaranteeApproval ? "approved" : chance(0.6) ? "approved" : chance(0.6) ? "pending" : "rejected";

      await SubmissionModel.create({
        activityId: activity.id,
        organizationId,
        submittedBy: student.userId,
        status:
          outcome === "approved"
            ? SubmissionStatus.APPROVED
            : outcome === "pending"
              ? SubmissionStatus.PENDING
              : SubmissionStatus.REJECTED,
        remarks: "Completed as per the activity brief.",
        attachments: [{ name: "submission.pdf", url: "https://example.com/submission.pdf", mimeType: "application/pdf" }],
        review:
          outcome === "approved"
            ? { reviewedBy: activity.createdBy, reviewedAt: new Date(), feedback: "Well done - approved.", pointsAwarded: activity.points }
            : outcome === "rejected"
              ? { reviewedBy: activity.createdBy, reviewedAt: new Date(), feedback: REJECTION_REASONS[randomInt(0, 2)], pointsAwarded: 0 }
              : { pointsAwarded: 0 },
        submittedAt: new Date(Date.now() - randomInt(1, 8) * 24 * 60 * 60 * 1000),
      });

      created++;

      if (outcome === "approved") {
        pointsByStudent.set(student.userId, (pointsByStudent.get(student.userId) ?? 0) + activity.points);
        if (isDemoStudent) demoApprovedCount++;
      }
    }
  }

  console.log(`Seed: created ${created} submissions`);
  return pointsByStudent;
}
