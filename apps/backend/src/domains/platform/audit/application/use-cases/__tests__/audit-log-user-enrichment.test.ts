import { describe, it, expect } from "vitest";

import { GetAuditLogsUseCase } from "../GetAuditLogsUseCase.js";
import { GetAuditLogUseCase } from "../GetAuditLogUseCase.js";

/**
 * Regression test for a real gap found while auditing Organization
 * Admin: an audit log's entire purpose is answering "who did this,"
 * but both the list and single-record views previously showed only a
 * raw userId. Fixed by enriching with the real actor's name, the same
 * proven pattern already applied to Leaderboard, Mentorship, and Job
 * Applications.
 */
describe("Audit Logs: actor name enrichment", () => {
  const userA = { id: "user-a", name: "Priya Singh" };
  const userRepo = { async findById(id: string) { return id === "user-a" ? userA : null; } };

  it("enriches each list entry with the real actor's name", async () => {
    const logsRepo = {
      async findByOrganization() {
        return {
          logs: [
            { id: "log-1", organizationId: "org-1", userId: "user-a", action: "CREATE", method: "POST", path: "/x", statusCode: 201 },
          ],
          total: 1,
          page: 1,
          limit: 20,
        };
      },
    };
    const useCase = new GetAuditLogsUseCase(logsRepo as any, userRepo as any);

    const result = await useCase.execute("org-1", {});

    expect(result.logs[0].userName).toBe("Priya Singh");
  });

  it("leaves userName undefined for a log with no user (system-triggered) rather than erroring", async () => {
    const logsRepo = {
      async findByOrganization() {
        return {
          logs: [{ id: "log-2", organizationId: "org-1", action: "SYSTEM", method: "POST", path: "/x", statusCode: 200 }],
          total: 1,
          page: 1,
          limit: 20,
        };
      },
    };
    const useCase = new GetAuditLogsUseCase(logsRepo as any, userRepo as any);

    const result = await useCase.execute("org-1", {});

    expect(result.logs[0].userName).toBeUndefined();
  });

  it("enriches the single-record lookup the same way", async () => {
    const logRepo = {
      async findById(id: string) {
        return id === "log-1"
          ? { id: "log-1", organizationId: "org-1", userId: "user-a", action: "CREATE", method: "POST", path: "/x", statusCode: 201 }
          : null;
      },
    };
    const useCase = new GetAuditLogUseCase(logRepo as any, userRepo as any);

    const result = await useCase.execute("log-1", "org-1");

    expect(result.userName).toBe("Priya Singh");
  });
});
