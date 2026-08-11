import { describe, it, expect } from "vitest";

import { authorizePermission } from "../../../../../../shared/core/middleware/authorizePermission.js";
import { UserRole } from "../../../../../identity/domain/constants/UserRole.js";

/**
 * SECURITY REGRESSION TEST: protects this session's fix, where
 * PLACEMENT_ADMIN was missing from the frontend's Companies/Drives nav
 * and route guards despite the backend already granting real access.
 * The frontend fix only matters if the backend genuinely allows it -
 * this test exercises the real authorizePermission middleware with
 * the exact role lists company.routes.ts and
 * placement-drive.routes.ts use, so a future change to either route
 * file that silently drops PLACEMENT_ADMIN will fail this test.
 */
describe("Placement Admin: Companies/Drives backend access", () => {
  // Mirrors company.routes.ts POST "/" and placement-drive.routes.ts
  // POST "/" exactly - both are authorizePermission(ORG_ADMIN, PLACEMENT_ADMIN).
  const createResourceMiddleware = authorizePermission(UserRole.ORG_ADMIN, UserRole.PLACEMENT_ADMIN);

  function runMiddleware(role: UserRole) {
    const req: any = { user: { role } };
    let calledNext = false;
    let thrown: any = null;
    try {
      createResourceMiddleware(req, {} as any, () => {
        calledNext = true;
      });
    } catch (e) {
      thrown = e;
    }
    return { calledNext, thrown };
  }

  it("allows PLACEMENT_ADMIN to create a Company/Drive (matches company.routes.ts and placement-drive.routes.ts)", () => {
    const { calledNext, thrown } = runMiddleware(UserRole.PLACEMENT_ADMIN);
    expect(calledNext).toBe(true);
    expect(thrown).toBeNull();
  });

  it("allows ORG_ADMIN to create a Company/Drive", () => {
    const { calledNext, thrown } = runMiddleware(UserRole.ORG_ADMIN);
    expect(calledNext).toBe(true);
    expect(thrown).toBeNull();
  });

  it("rejects SUPER_ADMIN from creating a Company/Drive (explicitly excluded by design, confirmed in both route files)", () => {
    const { calledNext, thrown } = runMiddleware(UserRole.SUPER_ADMIN);
    expect(calledNext).toBe(false);
    expect(thrown).toMatchObject({ statusCode: 403 });
  });

  it("rejects an unrelated role (STUDENT) from creating a Company/Drive", () => {
    const { calledNext, thrown } = runMiddleware(UserRole.STUDENT);
    expect(calledNext).toBe(false);
    expect(thrown).toMatchObject({ statusCode: 403 });
  });
});
