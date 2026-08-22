import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { FacultyModel } from "../../src/domains/academic/faculty/infrastructure/persistence/FacultyModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../../src/domains/identity/domain/constants/UserStatus.js";
import { FacultyStatus } from "../../src/domains/academic/faculty/domain/constants/FacultyStatus.js";

import { SEED_PASSWORD } from "../config/organizations.config.js";
import { hashSeedPassword } from "../utils/password.js";
import { pick, randomInt } from "../utils/random.js";
import { recordCredential } from "../utils/credentialsLog.js";
import type { SeededOrganization, SeededFaculty } from "../types.js";

const FIRST_NAMES = ["Ravi", "Ananya", "Vikram", "Priya", "Arjun", "Meera", "Karthik", "Divya", "Suresh", "Lakshmi"];
const LAST_NAMES = ["Rao", "Sharma", "Iyer", "Reddy", "Nair", "Patel", "Kumar", "Menon"];
const DESIGNATIONS = ["Assistant Professor", "Associate Professor", "Professor"];

function randomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

/** Creates 3-4 real Faculty accounts per organization, spread across every real department that org has. */
export async function seedFaculty(org: SeededOrganization): Promise<SeededFaculty[]> {
  const results: SeededFaculty[] = [];
  const count = randomInt(3, 4);
  const passwordHash = await hashSeedPassword(SEED_PASSWORD);

  for (let i = 0; i < count; i++) {
    const department = org.departments[i % org.departments.length];
    const name = randomName();
    const email = `faculty${i + 1}@${org.code.toLowerCase()}.edu`;

    const user = await UserModel.create({
      organizationId: org.id,
      name,
      email,
      role: UserRole.FACULTY,
      status: UserStatus.ACTIVE,
      auth: { passwordHash, emailVerified: true },
    });

    const faculty = await FacultyModel.create({
      organizationId: org.id,
      userId: user._id,
      departmentId: department.id,
      employeeId: `${org.code}-FAC-${String(i + 1).padStart(3, "0")}`,
      designation: pick(DESIGNATIONS),
      status: FacultyStatus.ACTIVE,
    });

    recordCredential({ organization: org.name, role: "Faculty", name, email, password: SEED_PASSWORD });

    results.push({
      facultyId: faculty._id.toString(),
      userId: user._id.toString(),
      name,
      email,
      password: SEED_PASSWORD,
      departmentId: department.id,
    });
  }

  console.log(`Seed: created ${results.length} faculty for "${org.name}"`);
  return results;
}
