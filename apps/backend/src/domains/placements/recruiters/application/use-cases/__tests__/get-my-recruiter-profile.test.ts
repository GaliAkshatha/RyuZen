import { describe, it, expect } from "vitest";

import { GetMyRecruiterProfileUseCase } from "../GetMyRecruiterProfileUseCase.js";

/**
 * BACKEND GAP FIX regression test: closes the "no GET /recruiters/me
 * self-lookup" gap - this was blocking a real "My Drives"/"My
 * Company" frontend experience since there was previously no safe
 * way to derive a recruiter's own real companyId.
 */
describe("GetMyRecruiterProfileUseCase", () => {
  const recruiter = { id: "recruiter-1", organizationId: "org-1", userId: "user-recruiter-1", companyId: "company-1", status: "ACTIVE" };

  function makeUseCase() {
    const repository = { async findByUserId(userId: string) { return userId === "user-recruiter-1" ? recruiter : null; } };
    return new GetMyRecruiterProfileUseCase(repository as any);
  }

  it("returns the caller's own real recruiter profile", async () => {
    const useCase = makeUseCase();
    const result = await useCase.execute("user-recruiter-1", "org-1");

    expect(result.companyId).toBe("company-1");
  });

  it("rejects a caller with no real recruiter profile at all", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute("user-no-profile", "org-1")).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects a real recruiter profile that belongs to a different organization", async () => {
    const useCase = makeUseCase();
    await expect(useCase.execute("user-recruiter-1", "org-2")).rejects.toMatchObject({ statusCode: 404 });
  });
});
