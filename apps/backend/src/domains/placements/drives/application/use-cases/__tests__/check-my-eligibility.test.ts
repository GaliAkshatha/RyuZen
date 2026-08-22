import { describe, it, expect } from "vitest";

import { CheckMyEligibilityUseCase } from "../CheckMyEligibilityUseCase.js";

/**
 * BACKEND GAP FIX regression test: closes the "no student-facing
 * eligibility signal" gap. Reuses isStudentEligibleForDrive() -
 * these tests confirm the real, human-readable reasons match what
 * that shared function actually checks, not invented text.
 */
describe("CheckMyEligibilityUseCase", () => {
  const drive = {
    id: "drive-1",
    organizationId: "org-1",
    eligibilityCriteria: { minCgpa: 8, departmentIds: ["dept-cse"] },
  };

  function makeUseCase(student: any) {
    const driveRepo = { async findById(id: string) { return id === "drive-1" ? drive : null; } };
    const studentRepo = { async findByUserId(userId: string) { return userId === "user-student-1" ? student : null; } };
    return new CheckMyEligibilityUseCase(driveRepo as any, studentRepo as any);
  }

  it("returns eligible with no reasons for a student who genuinely meets all criteria", async () => {
    const useCase = makeUseCase({ id: "student-1", departmentId: "dept-cse", cgpa: 8.5, semester: 6, batch: "2022-2026" });
    const result = await useCase.execute("drive-1", "org-1", "user-student-1");

    expect(result.eligible).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("returns ineligible with real, specific reasons for a student who fails multiple criteria", async () => {
    const useCase = makeUseCase({ id: "student-1", departmentId: "dept-ece", cgpa: 7.0, semester: 6, batch: "2022-2026" });
    const result = await useCase.execute("drive-1", "org-1", "user-student-1");

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain("Your department is not eligible for this drive.");
    expect(result.reasons.some((r) => r.includes("CGPA"))).toBe(true);
  });

  it("rejects a caller with no real student profile", async () => {
    const useCase = makeUseCase(null);
    await expect(useCase.execute("drive-1", "org-1", "user-student-1")).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects a drive belonging to a different organization", async () => {
    const useCase = makeUseCase({ id: "student-1", departmentId: "dept-cse", cgpa: 9, semester: 6, batch: "2022-2026" });
    await expect(useCase.execute("drive-1", "org-2", "user-student-1")).rejects.toMatchObject({ statusCode: 404 });
  });
});
