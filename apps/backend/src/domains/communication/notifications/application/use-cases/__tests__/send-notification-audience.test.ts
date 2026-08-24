import { describe, it, expect } from "vitest";

import { SendNotificationUseCase } from "../SendNotificationUseCase.js";
import { NotificationAudience } from "../../../domain/constants/NotificationAudience.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * BUSINESS-LOGIC REGRESSION TEST: the real sender-role scoping behind
 * who can send a notification to whom - a confirmed, previously-real
 * gap (any caller who reached this endpoint could pick ANY audience
 * at all, including a Faculty member broadcasting to the whole org).
 */
describe("SendNotificationUseCase - sender-role audience enforcement", () => {
  function makeUseCase() {
    const repository = {
      async create(notification: unknown) {
        return notification;
      },
    };
    return new SendNotificationUseCase(repository as any);
  }

  const baseDto = { title: "Test", message: "Test message" };

  it("allows FACULTY to send to STUDENT", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute({ ...baseDto, targetAudience: NotificationAudience.STUDENT }, "org-1", "user-1", UserRole.FACULTY),
    ).resolves.toBeDefined();
  });

  it("rejects FACULTY sending to ALL", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute({ ...baseDto, targetAudience: NotificationAudience.ALL }, "org-1", "user-1", UserRole.FACULTY),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects FACULTY sending to ORG_ADMIN", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute({ ...baseDto, targetAudience: NotificationAudience.ORG_ADMIN }, "org-1", "user-1", UserRole.FACULTY),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("allows ORG_ADMIN to send to ALL, FACULTY, STUDENT, and ALUMNI", async () => {
    const useCase = makeUseCase();
    for (const audience of [NotificationAudience.ALL, NotificationAudience.FACULTY, NotificationAudience.STUDENT, NotificationAudience.ALUMNI]) {
      await expect(
        useCase.execute({ ...baseDto, targetAudience: audience }, "org-1", "user-1", UserRole.ORG_ADMIN),
      ).resolves.toBeDefined();
    }
  });

  it("rejects ORG_ADMIN sending to ORG_ADMIN", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute({ ...baseDto, targetAudience: NotificationAudience.ORG_ADMIN }, "org-1", "user-1", UserRole.ORG_ADMIN),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("allows SUPER_ADMIN to send to any real audience, including ORG_ADMIN", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute({ ...baseDto, targetAudience: NotificationAudience.ORG_ADMIN }, "org-1", "user-1", UserRole.SUPER_ADMIN),
    ).resolves.toBeDefined();
  });

  it("rejects a role with no configured allowed audiences (e.g. STUDENT)", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute({ ...baseDto, targetAudience: NotificationAudience.ALL }, "org-1", "user-1", UserRole.STUDENT),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects departmentIds on a non-STUDENT/FACULTY audience", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute(
        { ...baseDto, targetAudience: NotificationAudience.ALUMNI, departmentIds: ["dept-1"] },
        "org-1",
        "user-1",
        UserRole.ORG_ADMIN,
      ),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it("allows departmentIds on a STUDENT audience", async () => {
    const useCase = makeUseCase();
    await expect(
      useCase.execute(
        { ...baseDto, targetAudience: NotificationAudience.STUDENT, departmentIds: ["dept-1"] },
        "org-1",
        "user-1",
        UserRole.ORG_ADMIN,
      ),
    ).resolves.toBeDefined();
  });
});
