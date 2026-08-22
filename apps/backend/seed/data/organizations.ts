import { OrganizationModel } from "../../src/domains/organizations/infrastructure/persistence/OrganizationModel.js";
import { OrganizationSettingsModel } from "../../src/domains/organizations/infrastructure/persistence/OrganizationSettingsModel.js";
import { DepartmentModel } from "../../src/domains/academic/departments/infrastructure/persistence/DepartmentModel.js";
import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../../src/domains/identity/domain/constants/UserStatus.js";
import { OrganizationStatus } from "../../src/domains/organizations/domain/constants/OrganizationStatus.js";

import { ORG_DEFINITIONS, SEED_PASSWORD } from "../config/organizations.config.js";
import { hashSeedPassword } from "../utils/password.js";
import { recordCredential } from "../utils/credentialsLog.js";
import type { SeededOrganization } from "../types.js";

/**
 * Creates each real Organization document, its (mostly-default)
 * OrganizationSettings row, every department the org will use, and
 * one real Org Admin account per org - the root of everything else
 * this seed script builds, since every later document references
 * one of these organizationIds.
 */
export async function seedOrganizations(): Promise<SeededOrganization[]> {
  const results: SeededOrganization[] = [];

  for (const def of ORG_DEFINITIONS) {
    const org = await OrganizationModel.create({
      name: def.name,
      code: def.code,
      status: OrganizationStatus.ACTIVE,
    });

    await OrganizationSettingsModel.create({
      organizationId: org._id,
    });

    const departments = [];
    for (const deptName of def.departmentNames) {
      const dept = await DepartmentModel.create({
        organizationId: org._id,
        name: deptName,
        code: deptName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase(),
      });
      departments.push({ id: dept._id.toString(), name: dept.name, code: dept.code });
    }

    const adminEmail = `admin@${def.code.toLowerCase()}.edu`;
    const adminPasswordHash = await hashSeedPassword(SEED_PASSWORD);
    const adminUser = await UserModel.create({
      organizationId: org._id,
      name: `${def.name} Admin`,
      email: adminEmail,
      role: UserRole.ORG_ADMIN,
      status: UserStatus.ACTIVE,
      auth: { passwordHash: adminPasswordHash, emailVerified: true },
    });

    recordCredential({
      organization: def.name,
      role: "Org Admin",
      name: adminUser.name,
      email: adminEmail,
      password: SEED_PASSWORD,
    });

    results.push({
      id: org._id.toString(),
      name: org.name,
      code: org.code,
      orgAdmin: {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminEmail,
        password: SEED_PASSWORD,
        role: UserRole.ORG_ADMIN,
      },
      departments,
    });

    console.log(`Seed: created organization "${org.name}" with ${departments.length} departments`);
  }

  return results;
}
