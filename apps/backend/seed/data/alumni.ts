import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { AlumniModel } from "../../src/domains/academic/alumni/infrastructure/persistence/AlumniModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../../src/domains/identity/domain/constants/UserStatus.js";
import { AlumniStatus } from "../../src/domains/academic/alumni/domain/constants/AlumniStatus.js";

import { SEED_PASSWORD } from "../config/organizations.config.js";
import { hashSeedPassword } from "../utils/password.js";
import { pick, randomInt, chance } from "../utils/random.js";
import { recordCredential } from "../utils/credentialsLog.js";
import type { SeededOrganization, SeededAlumnus } from "../types.js";

const FIRST_NAMES = ["Ramesh", "Sunita", "Manoj", "Deepa", "Ashok", "Nandini"];
const LAST_NAMES = ["Agarwal", "Krishnan", "Bhatt", "Chawla", "Rangan"];

function randomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

/**
 * Creates 4-5 real Alumni records per organization - a genuine mix of
 * ACTIVE (a real linked User account, can actually log in) and
 * INVITED (no account yet, matching the real invite-token-only path
 * confirmed on AlumniModel - userId is genuinely optional there).
 */
export async function seedAlumni(org: SeededOrganization): Promise<SeededAlumnus[]> {
  const results: SeededAlumnus[] = [];
  const count = randomInt(4, 5);
  const passwordHash = await hashSeedPassword(SEED_PASSWORD);

  for (let i = 0; i < count; i++) {
    const name = randomName();
    const email = `alumni${i + 1}@${org.code.toLowerCase()}.edu`;
    // The first alumnus is always guaranteed ACTIVE - real demo
    // credentials (the landing page's "Explore as Alumni") are
    // hardcoded to alumni1@<code>.edu, so that specific one must
    // reliably have a real account; every other alumnus stays
    // genuinely randomized for realistic mixed data.
    const makeActive = i === 0 ? true : chance(0.6);

    if (makeActive) {
      const user = await UserModel.create({
        organizationId: org.id,
        name,
        email,
        role: UserRole.ALUMNI,
        status: UserStatus.ACTIVE,
        auth: { passwordHash, emailVerified: true },
      });

      const alumnus = await AlumniModel.create({
        organizationId: org.id,
        userId: user._id,
        email,
        name,
        graduationYear: randomInt(2020, 2024),
        isVerified: chance(0.7),
        status: AlumniStatus.ACTIVE,
      });

      recordCredential({ organization: org.name, role: "Alumni", name, email, password: SEED_PASSWORD });
      results.push({ alumniId: alumnus._id.toString(), userId: user._id.toString(), name, email, password: SEED_PASSWORD });
    } else {
      const alumnus = await AlumniModel.create({
        organizationId: org.id,
        email,
        name,
        graduationYear: randomInt(2020, 2024),
        isVerified: false,
        status: AlumniStatus.INVITED,
      });

      results.push({ alumniId: alumnus._id.toString(), name, email });
    }
  }

  console.log(`Seed: created ${results.length} alumni for "${org.name}"`);
  return results;
}
