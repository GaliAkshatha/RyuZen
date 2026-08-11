import { describe, it, expect } from "vitest";

import { GetInterviewRoundsForApplicationUseCase } from "../GetInterviewRoundsForApplicationUseCase.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY REGRESSION TEST: GetInterviewRoundsForApplicationUseCase
 * previously only checked ownership for STUDENT callers, leaving every
 * other authenticated role - RECRUITER in particular - able to read
 * interview round data for any application in any organization. Fixed
 * by reusing the exact scope pattern already proven in
 * ScheduleInterviewRoundUseCase. This test file is the permanent
 * record of that fix.
 */
describe("Interview Rounds: read authorization (GET /interview-rounds/application/:id)", () => {
  const applicationA = { id: "app-a", placementId: "drive-a", studentId: "student-a" };
  const applicationB = { id: "app-b", placementId: "drive-b", studentId: "student-b" };

  const driveA = { id: "drive-a", organizationId: "org-1", companyId: "company-A" };
  const driveB = { id: "drive-b", organizationId: "org-1", companyId: "company-B" };
  const driveOtherOrg = { id: "drive-other-org", organizationId: "org-2", companyId: "company-C" };
  const applicationOtherOrg = { id: "app-other-org", placementId: "drive-other-org", studentId: "student-x" };

  const studentA = { id: "student-a", userId: "user-student-a" };
  const studentB = { id: "student-b", userId: "user-student-b" };

  const recruiters: Record<string, any> = {
    "recruiter-company-a": { organizationId: "org-1", companyId: "company-A" },
    "recruiter-company-b": { organizationId: "org-1", companyId: "company-B" },
  };

  function makeUseCase() {
    const applications: Record<string, any> = {
      "app-a": applicationA,
      "app-b": applicationB,
      "app-other-org": applicationOtherOrg,
    };
    const drives: Record<string, any> = {
      "drive-a": driveA,
      "drive-b": driveB,
      "drive-other-org": driveOtherOrg,
    };
    const students: Record<string, any> = {
      "user-student-a": studentA,
      "user-student-b": studentB,
    };

    const applicationRepo = { async findById(id: string) { return applications[id] ?? null; } };
    const driveRepo = { async findById(id: string) { return drives[id] ?? null; } };
    const studentRepo = { async findByUserId(userId: string) { return students[userId] ?? null; } };
    const recruiterRepo = { async findByUserId(userId: string) { return recruiters[userId] ?? null; } };
    const roundRepo = { async findByApplication() { return []; } };

    return new GetInterviewRoundsForApplicationUseCase(
      roundRepo as any, applicationRepo as any, driveRepo as any, studentRepo as any, recruiterRepo as any,
    );
  }

  it("allows a student to read interview rounds for their own application", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-a", "org-1", "user-student-a", UserRole.STUDENT),
    ).resolves.toEqual([]);
  });

  it("rejects a student reading another student's application (404, not leaked)", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-b", "org-1", "user-student-a", UserRole.STUDENT),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("allows a recruiter to read rounds for an application at their own real company", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-a", "org-1", "recruiter-company-a", UserRole.RECRUITER),
    ).resolves.toEqual([]);
  });

  it("rejects a recruiter reading rounds for a DIFFERENT company's drive (the core vulnerability)", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-b", "org-1", "recruiter-company-a", UserRole.RECRUITER),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects any caller for an application whose drive belongs to a different organization", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-other-org", "org-1", "recruiter-company-a", UserRole.RECRUITER),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("allows ORG_ADMIN to read rounds for any real application in their own organization", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-b", "org-1", "admin-1", UserRole.ORG_ADMIN),
    ).resolves.toEqual([]);
  });

  it("rejects ORG_ADMIN reading an application whose drive is in a different organization", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute("app-other-org", "org-1", "admin-1", UserRole.ORG_ADMIN),
    ).rejects.toMatchObject({ statusCode: 404 });
  });
});
