import { describe, it, expect } from "vitest";

import { GetMentorshipsUseCase } from "../GetMentorshipsUseCase.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY REGRESSION TEST: GetMentorshipsUseCase previously trusted a
 * client-provided facultyId filter with no verification it belonged
 * to the caller - any Faculty user could pass another real faculty's
 * id via ?facultyId= and see their mentee list. Fixed by always
 * deriving a Faculty caller's own real facultyId server-side and
 * ignoring whatever was in the request. This is the "assigned
 * mentees" scope the My Students roster (frontend, not yet built)
 * will rely on - it must be trustworthy before that UI is built.
 */
describe("Mentorship: Faculty scope cannot be bypassed by id manipulation", () => {
  const facultyByUser: Record<string, any> = {
    "user-fac-real": { id: "fac-real", userId: "user-fac-real", organizationId: "org-1" },
  };
  const facultyRepo = { async findByUserId(userId: string) { return facultyByUser[userId] ?? null; } };

  function makeUseCase() {
    const calls: any[] = [];
    const mentorshipRepo = {
      async findByOrganization(organizationId: string, filters: any) {
        calls.push({ organizationId, filters });
        return [];
      },
    };
    const useCase = new GetMentorshipsUseCase(mentorshipRepo as any, facultyRepo as any);
    return { useCase, calls };
  }

  it("ignores a client-provided facultyId and uses the caller's own real facultyId instead", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute(
      "org-1",
      { facultyId: "fac-someone-elses-real-id" }, // attempted id manipulation
      "user-fac-real",
      UserRole.FACULTY,
    );

    expect(calls[0].filters.facultyId).toBe("fac-real");
    expect(calls[0].filters.facultyId).not.toBe("fac-someone-elses-real-id");
  });

  it("scopes to a sentinel that matches nothing when the Faculty caller has no linked profile", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute("org-1", {}, "user-fac-no-profile", UserRole.FACULTY);

    expect(calls[0].filters.facultyId).toBe("__no_faculty_profile__");
  });

  it("still allows ORG_ADMIN to filter by any real facultyId (broader access is correct for this role)", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute("org-1", { facultyId: "fac-any" }, "admin-1", UserRole.ORG_ADMIN);

    expect(calls[0].filters.facultyId).toBe("fac-any");
  });

  it("Faculty caller with no filter still gets scoped to their own mentees only, not the whole org", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute("org-1", {}, "user-fac-real", UserRole.FACULTY);

    expect(calls[0].filters.facultyId).toBe("fac-real");
  });
});
