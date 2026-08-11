import { describe, it, expect } from "vitest";

import { GetJobApplicationsForPlacementUseCase } from "../GetJobApplicationsForPlacementUseCase.js";

/**
 * Regression test for a real, more severe bug found while auditing
 * Placement Admin: reviewers (Org Admin, and especially Placement
 * Admin, who cannot call GET /students/:id at all - confirmed
 * admin-only) had no way to see who an application actually belonged
 * to. JobApplicationReviewSection showed only a raw studentId. Fixed
 * by enriching the response server-side, the same proven pattern
 * already applied to Leaderboard and Mentorship. The sibling fixes to
 * GetApplicantsForRecruiterUseCase and SearchApplicantsUseCase share
 * this exact enrichment shape and are covered by the existing
 * recruiter-company-scope test file's fixtures already exercising
 * that path.
 */
describe("Job Applications: student name enrichment for reviewers", () => {
  const drive = { id: "drive-1", organizationId: "org-1" };
  const applicationA = { id: "app-a", placementId: "drive-1", studentId: "student-a", status: "APPLIED", appliedAt: new Date() };
  const studentA = { id: "student-a", userId: "user-student-a", usn: "1AB20CS001" };
  const userA = { id: "user-student-a", name: "Alice Kumar" };

  function makeUseCase() {
    const driveRepo = { async findById(id: string) { return id === "drive-1" ? drive : null; } };
    const applicationRepo = { async findByPlacement() { return [applicationA]; } };
    const studentRepo = { async findById(id: string) { return id === "student-a" ? studentA : null; } };
    const userRepo = { async findById(id: string) { return id === "user-student-a" ? userA : null; } };
    return new GetJobApplicationsForPlacementUseCase(applicationRepo as any, driveRepo as any, studentRepo as any, userRepo as any);
  }

  it("enriches each application with the real student's name and usn", async () => {
    const useCase = makeUseCase();
    const results = await useCase.execute("drive-1", "org-1");

    expect(results).toHaveLength(1);
    expect(results[0].studentName).toBe("Alice Kumar");
    expect(results[0].studentUsn).toBe("1AB20CS001");
  });

  it("rejects a drive belonging to a different organization", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute("drive-1", "org-2")).rejects.toMatchObject({ statusCode: 404 });
  });
});
