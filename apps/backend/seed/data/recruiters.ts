import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { RecruiterModel } from "../../src/domains/placements/recruiters/infrastructure/persistence/RecruiterModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../../src/domains/identity/domain/constants/UserStatus.js";
import { RecruiterStatus } from "../../src/domains/placements/recruiters/domain/constants/RecruiterStatus.js";

import { SEED_PASSWORD } from "../config/organizations.config.js";
import { hashSeedPassword } from "../utils/password.js";
import { pick, pickMany } from "../utils/random.js";
import { recordCredential } from "../utils/credentialsLog.js";
import type { SeededOrganization, SeededCompany, SeededRecruiter } from "../types.js";

const FIRST_NAMES = ["Neha", "Amit", "Sanjay", "Pooja", "Rahul"];
const LAST_NAMES = ["Shah", "Kapoor", "Mehta", "Bansal"];

function randomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

/** Creates 2-3 real recruiters per organization, each attached to one of that org's own real companies. */
export async function seedRecruiters(org: SeededOrganization, companies: SeededCompany[]): Promise<SeededRecruiter[]> {
  const results: SeededRecruiter[] = [];
  const assignedCompanies = pickMany(companies, Math.min(3, companies.length));
  const passwordHash = await hashSeedPassword(SEED_PASSWORD);

  for (let i = 0; i < assignedCompanies.length; i++) {
    const company = assignedCompanies[i];
    const name = randomName();
    const email = `recruiter${i + 1}@${org.code.toLowerCase()}.edu`;

    const user = await UserModel.create({
      organizationId: org.id,
      name,
      email,
      role: UserRole.RECRUITER,
      status: UserStatus.ACTIVE,
      auth: { passwordHash, emailVerified: true },
    });

    const recruiter = await RecruiterModel.create({
      organizationId: org.id,
      userId: user._id,
      companyId: company.id,
      jobTitle: "Talent Acquisition Manager",
      status: RecruiterStatus.ACTIVE,
    });

    recordCredential({ organization: org.name, role: "Recruiter", name, email, password: SEED_PASSWORD });

    results.push({
      recruiterId: recruiter._id.toString(),
      userId: user._id.toString(),
      name,
      email,
      password: SEED_PASSWORD,
      companyId: company.id,
    });
  }

  console.log(`Seed: created ${results.length} recruiters for "${org.name}"`);
  return results;
}
