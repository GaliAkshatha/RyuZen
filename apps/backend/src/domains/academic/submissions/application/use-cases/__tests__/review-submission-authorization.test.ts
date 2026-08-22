import { describe, it, expect } from "vitest";

import { ReviewSubmissionUseCase } from "../ReviewSubmissionUseCase.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";
import { SubmissionStatus } from "../../../domain/constants/SubmissionStatus.js";

/**
 * SECURITY REGRESSION TEST: ReviewSubmissionUseCase previously had no
 * organizationId parameter and no role/ownership check at all - any
 * authenticated user of any role, in any organization, could approve
 * or reject any submission (including the real point-award side
 * effect this triggers). Fixed by requiring organization match and
 * genuine activity-creator ownership (or SUPER_ADMIN). This test file
 * is the permanent record of that fix.
 */
describe("ReviewSubmissionUseCase: organization and ownership isolation", () => {
  const submissionOrgA = {
    id: "sub-1", organizationId: "org-1", activityId: "activity-1", submittedBy: "user-student-1",
    status: "PENDING", remarks: "", attachments: [], review: {}, submittedAt: new Date(),
    applyreview: () => {},
  };
  const activityOrgA = { id: "activity-1", organizationId: "org-1", createdBy: "user-faculty-rvitm" };
  const activityOtherOrg = { id: "activity-2", organizationId: "org-2", createdBy: "user-faculty-other" };
  const submissionOtherOrg = {
    id: "sub-2", organizationId: "org-2", activityId: "activity-2", submittedBy: "user-student-2",
    status: "PENDING", remarks: "", attachments: [], review: {}, submittedAt: new Date(),
    applyreview: () => {},
  };

  function makeUseCase() {
    const submissions: Record<string, any> = { "sub-1": submissionOrgA, "sub-2": submissionOtherOrg };
    const activities: Record<string, any> = { "activity-1": activityOrgA, "activity-2": activityOtherOrg };

    const repository = {
      async findById(id: string) { return submissions[id] ?? null; },
      async save(s: any) { return s; },
    };
    const activityRepository = { async findById(id: string) { return activities[id] ?? null; } };
    const studentRepository = { async findByUserId() { return null; } };
    const recordPointTransaction = { async execute() {} };
    const recordSystemNotification = { async execute() {} };
    const recordGrowthEvent = { async execute() {} };

    return new ReviewSubmissionUseCase(
      repository as any, studentRepository as any, activityRepository as any,
      recordPointTransaction as any, recordSystemNotification as any, recordGrowthEvent as any,
    );
  }

  const reviewDto = { status: SubmissionStatus.APPROVED, feedback: "", pointsAwarded: 0 };

  it("allows the activity's real creator (a real RVITM faculty) to review its own organization's submission", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("sub-1", "org-1", "user-faculty-rvitm", UserRole.FACULTY, reviewDto),
    ).resolves.toBeDefined();
  });

  it("rejects a faculty member who did NOT create the activity, even within the same organization", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("sub-1", "org-1", "user-faculty-someone-else", UserRole.FACULTY, reviewDto),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects a caller from a DIFFERENT organization entirely - the core cross-tenant vulnerability", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("sub-2", "org-1", "user-faculty-rvitm", UserRole.FACULTY, reviewDto),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("allows SUPER_ADMIN to review any real submission regardless of creator", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("sub-1", "org-1", "admin-1", UserRole.SUPER_ADMIN, reviewDto),
    ).resolves.toBeDefined();
  });
});
