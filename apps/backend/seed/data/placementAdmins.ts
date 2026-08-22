import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../../src/domains/identity/domain/constants/UserStatus.js";

import { SEED_PASSWORD } from "../config/organizations.config.js";
import { hashSeedPassword } from "../utils/password.js";
import { recordCredential } from "../utils/credentialsLog.js";
import type { SeededOrganization, SeededUser } from "../types.js";

/** PLACEMENT_ADMIN is genuinely just a User role - confirmed no dedicated profile model exists for it, unlike Faculty/Student/Alumni/Recruiter. */
export async function seedPlacementAdmin(org: SeededOrganization): Promise<SeededUser> {
  const name = `${org.name} Placement Admin`;
  const email = `placement-admin@${org.code.toLowerCase()}.edu`;
  const passwordHash = await hashSeedPassword(SEED_PASSWORD);

  const user = await UserModel.create({
    organizationId: org.id,
    name,
    email,
    role: UserRole.PLACEMENT_ADMIN,
    status: UserStatus.ACTIVE,
    auth: { passwordHash, emailVerified: true },
  });

  recordCredential({ organization: org.name, role: "Placement Admin", name, email, password: SEED_PASSWORD });
  console.log(`Seed: created placement admin for "${org.name}"`);

  return { id: user._id.toString(), name, email, password: SEED_PASSWORD, role: UserRole.PLACEMENT_ADMIN };
}
