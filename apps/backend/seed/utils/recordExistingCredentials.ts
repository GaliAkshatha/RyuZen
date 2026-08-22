import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";

import { recordCredential } from "./credentialsLog.js";
import { SEED_PASSWORD } from "../config/organizations.config.js";

const ROLE_LABELS: Record<string, string> = {
  [UserRole.ORG_ADMIN]: "Org Admin",
  [UserRole.PLACEMENT_ADMIN]: "Placement Admin",
  [UserRole.FACULTY]: "Faculty",
  [UserRole.STUDENT]: "Student",
  [UserRole.ALUMNI]: "Alumni",
  [UserRole.RECRUITER]: "Recruiter",
};

/**
 * Queries every real User already in an organization and records
 * their credentials using the one shared seed password every seeded
 * account uses - shared between index.ts (used when an organization
 * already exists and its full data-seeding chain is skipped, so the
 * credentials file still ends up complete) and regenerateCredentials.ts
 * (the standalone recovery script), so this logic exists in exactly
 * one place rather than being duplicated across both.
 */
export async function recordExistingOrgCredentials(organizationId: string, organizationName: string): Promise<void> {
  const users = await UserModel.find({ organizationId }).sort({ role: 1, name: 1 });

  for (const user of users) {
    const label = ROLE_LABELS[user.role];
    if (!label) continue;

    recordCredential({
      organization: organizationName,
      role: label,
      name: user.name,
      email: user.email,
      password: SEED_PASSWORD,
    });
  }
}
