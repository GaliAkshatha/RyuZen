import { describe, it, expect } from "vitest";

import { ListSubmissionsUseCase } from "../ListSubmissionsUseCase.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY REGRESSION TEST: ListSubmissionsUseCase previously had no
 * role restriction and trusted the client-provided submittedBy filter
 * completely - a student could list any other student's submissions,
 * or the whole organization's, by manipulating query params. Fixed
 * with real role-appropriate scoping: STUDENT is always forced to
 * their own id, FACULTY must specify a real activity they own.
 */
describe("ListSubmissionsUseCase: role-based scoping", () => {
  const activityOwnedByFaculty = { id: "activity-1", organizationId: "org-1", createdBy: "user-faculty-1" };

  function makeUseCase() {
    const calls: any[] = [];
    const repository = {
      async findAll(filter: any) {
        calls.push(filter);
        return [];
      },
    };
    const activityRepository = {
      async findById(id: string) { return id === "activity-1" ? activityOwnedByFaculty : null; },
    };
    return { useCase: new ListSubmissionsUseCase(repository as any, activityRepository as any), calls };
  }

  it("forces a STUDENT caller's submittedBy to their own real id, ignoring any other value requested", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute(
      { organizationId: "org-1", submittedBy: "user-someone-elses-real-id" },
      "user-student-1",
      UserRole.STUDENT,
    );

    expect(calls[0].submittedBy).toBe("user-student-1");
    expect(calls[0].submittedBy).not.toBe("user-someone-elses-real-id");
  });

  it("rejects a FACULTY caller who does not specify an activityId", async () => {
    const { useCase } = makeUseCase();

    await expect(
      useCase.execute({ organizationId: "org-1" }, "user-faculty-1", UserRole.FACULTY),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects a FACULTY caller specifying an activity they did not create", async () => {
    const { useCase } = makeUseCase();

    await expect(
      useCase.execute(
        { organizationId: "org-1", activityId: "activity-1" },
        "user-faculty-someone-else",
        UserRole.FACULTY,
      ),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("allows a FACULTY caller listing submissions for their own real activity", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute(
      { organizationId: "org-1", activityId: "activity-1" },
      "user-faculty-1",
      UserRole.FACULTY,
    );

    expect(calls[0].activityId).toBe("activity-1");
  });

  it("allows ORG_ADMIN full organization-scoped access with no further restriction", async () => {
    const { useCase, calls } = makeUseCase();

    await useCase.execute({ organizationId: "org-1" }, "admin-1", UserRole.ORG_ADMIN);

    expect(calls[0].organizationId).toBe("org-1");
    expect(calls[0].submittedBy).toBeUndefined();
  });
});
