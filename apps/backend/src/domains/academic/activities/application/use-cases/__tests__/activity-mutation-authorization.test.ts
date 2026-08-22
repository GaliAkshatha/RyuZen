import { describe, it, expect } from "vitest";

import { UpdateActivityUseCase } from "../UpdateActivityUseCase.js";
import { PublishActivityUseCase } from "../PublishActivityUseCase.js";
import { CloseActivityUseCase } from "../CloseActivityUseCase.js";
import { DeleteActivityUseCase } from "../DeleteActivityUseCase.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY REGRESSION TEST: Update/Publish/Close/Delete previously had
 * no organizationId or ownership check whatsoever - DeleteActivityUseCase
 * in particular called repository.delete(id) directly with zero
 * verification, meaning any authenticated Faculty member in any
 * organization could permanently delete any other organization's
 * activities. All four now enforce the same real pattern: organization
 * match, and only the activity's real creator or a SUPER_ADMIN may act
 * on it. One representative test per use case, covering the shared
 * vulnerability class rather than duplicating exhaustive cases four times.
 */
describe("Activity mutations: organization and ownership isolation", () => {
  function makeActivity(overrides: Partial<{ id: string; organizationId: string; createdBy: string }> = {}) {
    return {
      id: "activity-1",
      organizationId: "org-1",
      createdBy: "user-faculty-rvitm",
      publish: () => {},
      close: () => {},
      updateDetails: () => {},
      attachments: [],
      ...overrides,
    };
  }

  function makeRepo(activity: any) {
    return {
      async findById(id: string) { return id === activity.id ? activity : null; },
      async save(a: any) { return a; },
      async delete() {},
    };
  }

  it("UpdateActivityUseCase rejects a faculty member from a different organization", async () => {
    const activity = makeActivity();
    const useCase = new UpdateActivityUseCase(makeRepo(activity) as any);
    await expect(
      useCase.execute("activity-1", "org-2", "user-faculty-rvitm", UserRole.FACULTY, {}),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("PublishActivityUseCase rejects a faculty member who did not create the activity", async () => {
    const activity = makeActivity();
    const useCase = new PublishActivityUseCase(makeRepo(activity) as any);
    await expect(
      useCase.execute("activity-1", "org-1", "user-faculty-someone-else", UserRole.FACULTY),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("CloseActivityUseCase allows the real creator to close their own activity", async () => {
    const activity = makeActivity();
    const useCase = new CloseActivityUseCase(makeRepo(activity) as any);
    await expect(
      useCase.execute("activity-1", "org-1", "user-faculty-rvitm", UserRole.FACULTY),
    ).resolves.toBeDefined();
  });

  it("DeleteActivityUseCase rejects deletion by a non-creator, non-admin caller (the most severe of the four - previously had zero checks at all)", async () => {
    const activity = makeActivity();
    const repo = makeRepo(activity);
    const useCase = new DeleteActivityUseCase(repo as any);
    await expect(
      useCase.execute("activity-1", "org-1", "user-faculty-someone-else", UserRole.FACULTY),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("DeleteActivityUseCase allows SUPER_ADMIN to delete regardless of creator", async () => {
    const activity = makeActivity();
    const useCase = new DeleteActivityUseCase(makeRepo(activity) as any);
    await expect(
      useCase.execute("activity-1", "org-1", "admin-1", UserRole.SUPER_ADMIN),
    ).resolves.toBeUndefined();
  });
});
