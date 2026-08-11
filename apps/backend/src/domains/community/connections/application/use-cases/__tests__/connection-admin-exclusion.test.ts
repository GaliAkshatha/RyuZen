import { describe, it, expect } from "vitest";

import { GetConnectableUsersUseCase } from "../GetConnectableUsersUseCase.js";
import { SendConnectionRequestUseCase } from "../SendConnectionRequestUseCase.js";
import { ConnectionRequest } from "../../../domain/entities/ConnectionRequest.js";
import { UserStatus } from "../../../../../identity/domain/constants/UserStatus.js";

/**
 * Real, persistent regression test for a real business rule: Org
 * Admin and Super Admin do not participate in the social connection
 * graph. Previously verified only via a disposable smoke-test script
 * (created, run, deleted) - this is that same verification made
 * permanent, per the Testing Strategy's own priority ordering
 * (Security / Authorization first). See GetConnectableUsersUseCase
 * and SendConnectionRequestUseCase for the real rule this protects.
 */
describe("Connections: Org Admin / Super Admin exclusion", () => {
  const users: Record<string, any> = {
    "user-student": {
      id: "user-student",
      organizationId: "org-1",
      name: "Alice",
      role: "STUDENT",
      status: UserStatus.ACTIVE,
      profile: { image: "" },
    },
    "user-faculty": {
      id: "user-faculty",
      organizationId: "org-1",
      name: "Dr. Bob",
      role: "FACULTY",
      status: UserStatus.ACTIVE,
      profile: { image: "" },
    },
    "user-org-admin": {
      id: "user-org-admin",
      organizationId: "org-1",
      name: "Admin Carol",
      role: "ORG_ADMIN",
      status: UserStatus.ACTIVE,
      profile: { image: "" },
    },
    "user-super-admin": {
      id: "user-super-admin",
      organizationId: "org-1",
      name: "Root Dave",
      role: "SUPER_ADMIN",
      status: UserStatus.ACTIVE,
      profile: { image: "" },
    },
  };

  function makeFakes() {
    const userRepo = {
      async findById(id: string) {
        return users[id] ?? null;
      },
      async findByOrganization() {
        return Object.values(users);
      },
    };
    const connectionRepo = {
      async findBetween() {
        return null;
      },
      async create(r: ConnectionRequest) {
        return ConnectionRequest.create({ ...r.toObject(), id: "req-1" });
      },
    };
    const notif = { async execute() {} };
    return { userRepo, connectionRepo, notif };
  }

  it("excludes ORG_ADMIN and SUPER_ADMIN from the real people directory", async () => {
    const { userRepo, connectionRepo } = makeFakes();
    const useCase = new GetConnectableUsersUseCase(userRepo as any, connectionRepo as any);

    const directory = await useCase.execute("org-1", "user-student");

    expect(directory.some((p) => p.id === "user-org-admin")).toBe(false);
    expect(directory.some((p) => p.id === "user-super-admin")).toBe(false);
    expect(directory.some((p) => p.id === "user-faculty")).toBe(true);
  });

  it("never exposes sensitive fields like email in the directory", async () => {
    const { userRepo, connectionRepo } = makeFakes();
    const useCase = new GetConnectableUsersUseCase(userRepo as any, connectionRepo as any);

    const directory = await useCase.execute("org-1", "user-student");

    for (const person of directory) {
      expect(person).not.toHaveProperty("email");
    }
  });

  it("rejects a connection request to ORG_ADMIN even with a known id", async () => {
    const { userRepo, connectionRepo, notif } = makeFakes();
    const useCase = new SendConnectionRequestUseCase(connectionRepo as any, userRepo as any, notif as any);

    await expect(
      useCase.execute("org-1", "user-student", { toUserId: "user-org-admin" }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("rejects a connection request to SUPER_ADMIN even with a known id", async () => {
    const { userRepo, connectionRepo, notif } = makeFakes();
    const useCase = new SendConnectionRequestUseCase(connectionRepo as any, userRepo as any, notif as any);

    await expect(
      useCase.execute("org-1", "user-student", { toUserId: "user-super-admin" }),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("still allows a connection request to a real peer (Faculty)", async () => {
    const { userRepo, connectionRepo, notif } = makeFakes();
    const useCase = new SendConnectionRequestUseCase(connectionRepo as any, userRepo as any, notif as any);

    const result = await useCase.execute("org-1", "user-student", { toUserId: "user-faculty" });

    expect(result.status).toBe("PENDING");
  });
});
