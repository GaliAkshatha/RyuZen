import { describe, it, expect } from "vitest";

import { SubmissionEligibilityService } from "../SubmissionEligibilityService.js";
import { ActivityStatus } from "../../../../activities/domain/constants/ActivityStatus.js";

/**
 * BUSINESS-LOGIC REGRESSION TEST: ActivityVisibility's DEPARTMENT/
 * SEMESTER/YEAR values were previously purely decorative - IActivity
 * had no field to record which department/batch, and even after
 * adding those real fields, nothing checked them against the
 * submitting student. Any student in the organization could submit to
 * any published activity regardless of its stated targeting. Fixed by
 * enforcing departmentIds/batches here, the same real place
 * organization/status/deadline/duplicate were already correctly
 * checked.
 */
describe("SubmissionEligibilityService: department/batch targeting", () => {
  const futureDate = new Date(Date.now() + 86400000);

  function makeService(activity: any, studentsByUserId: Record<string, any> = {}) {
    const activityRepository = { async findById(id: string) { return id === activity.id ? activity : null; } };
    const submissionRepository = { async findAll() { return []; } };
    const studentRepository = { async findByUserId(userId: string) { return studentsByUserId[userId] ?? null; } };
    return new SubmissionEligibilityService(activityRepository as any, submissionRepository as any, studentRepository as any);
  }

  const baseActivity = {
    id: "activity-1", organizationId: "org-1", status: ActivityStatus.PUBLISHED, endDate: futureDate,
  };

  it("allows submission when the activity has no department/batch restriction at all", async () => {
    const service = makeService({ ...baseActivity });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).resolves.toBeUndefined();
  });

  it("rejects a student from a different department than the activity's real target", async () => {
    const activity = { ...baseActivity, departmentIds: ["dept-cse"] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-ece", batch: "2022-2026" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("allows a student from the activity's real target department", async () => {
    const activity = { ...baseActivity, departmentIds: ["dept-cse"] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-cse", batch: "2022-2026" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).resolves.toBeUndefined();
  });

  it("rejects a student from a different batch than the activity's real target", async () => {
    const activity = { ...baseActivity, batches: ["2022-2026"] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-cse", batch: "2021-2025" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("rejects a non-student caller when the activity has real targeting", async () => {
    const activity = { ...baseActivity, batches: ["2022-2026"] };
    const service = makeService(activity, {});
    await expect(service.validateSubmission("activity-1", "org-1", "user-non-student")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("rejects a student from a different semester than the activity's real target", async () => {
    const activity = { ...baseActivity, semesters: [6] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-cse", cgpa: 8, semester: 4, batch: "2022-2026", section: "B" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("allows a student from the activity's real target semester and section", async () => {
    const activity = { ...baseActivity, semesters: [6], sections: ["B"] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-cse", cgpa: 8, semester: 6, batch: "2022-2026", section: "B" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).resolves.toBeUndefined();
  });

  it("rejects a student from a different section than the activity's real target", async () => {
    const activity = { ...baseActivity, sections: ["A"] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-cse", cgpa: 8, semester: 6, batch: "2022-2026", section: "B" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("rejects a student with no section set when the activity targets a specific section", async () => {
    const activity = { ...baseActivity, sections: ["B"] };
    const service = makeService(activity, {
      "user-student-1": { id: "student-1", departmentId: "dept-cse", cgpa: 8, semester: 6, batch: "2022-2026" },
    });
    await expect(service.validateSubmission("activity-1", "org-1", "user-student-1")).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
