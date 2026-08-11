import { describe, it, expect } from "vitest";

import { GetMyFacultyProfileUseCase } from "../GetMyFacultyProfileUseCase.js";

/**
 * Real, persistent regression test for a real multi-tenancy rule: a
 * faculty profile that genuinely belongs to a DIFFERENT organization
 * must never resolve for a caller authenticated against another org,
 * even if the userId happens to match. Previously verified only via a
 * disposable smoke-test script. Made permanent per the Testing
 * Strategy's explicit multi-tenancy priority.
 */
describe("Faculty self-lookup: multi-tenancy boundary", () => {
  const facultyByUser: Record<string, any> = {
    "user-fac-1": { id: "fac-1", userId: "user-fac-1", organizationId: "org-1", name: "Dr. Doe" },
    "user-fac-other-org": { id: "fac-2", userId: "user-fac-other-org", organizationId: "org-2", name: "Dr. Other" },
  };
  const repo = { async findByUserId(userId: string) { return facultyByUser[userId] ?? null; } };

  it("resolves the real faculty profile for a genuine same-org caller", async () => {
    const useCase = new GetMyFacultyProfileUseCase(repo as any);
    const result = await useCase.execute("user-fac-1", "org-1");
    expect(result.id).toBe("fac-1");
  });

  it("rejects a user with no linked faculty profile (404, not a crash)", async () => {
    const useCase = new GetMyFacultyProfileUseCase(repo as any);
    await expect(useCase.execute("user-student-1", "org-1")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects a real faculty profile that belongs to a DIFFERENT organization", async () => {
    const useCase = new GetMyFacultyProfileUseCase(repo as any);
    // user-fac-other-org's real profile is genuinely in org-2 - a caller
    // authenticated against org-1 must never see it, even though the
    // profile itself is real and the lookup succeeds at the repository level.
    await expect(useCase.execute("user-fac-other-org", "org-1")).rejects.toMatchObject({ statusCode: 404 });
  });
});
