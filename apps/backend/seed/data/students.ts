import { UserModel } from "../../src/domains/identity/infrastructure/persistence/UserModel.js";
import { StudentModel } from "../../src/domains/academic/students/infrastructure/persistence/StudentModel.js";
import { UserRole } from "../../src/domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../../src/domains/identity/domain/constants/UserStatus.js";
import { StudentStatus } from "../../src/domains/academic/students/domain/constants/StudentStatus.js";

import { SEED_PASSWORD } from "../config/organizations.config.js";
import { hashSeedPassword } from "../utils/password.js";
import { pick, randomInt } from "../utils/random.js";
import { recordCredential } from "../utils/credentialsLog.js";
import type { SeededOrganization, SeededStudent } from "../types.js";

const FIRST_NAMES = [
  "Aditya", "Sneha", "Rohan", "Kavya", "Aarav", "Ishita", "Dev", "Pooja", "Nikhil", "Riya",
  "Siddharth", "Ananya", "Varun", "Shreya", "Kabir",
];
const LAST_NAMES = ["Verma", "Gupta", "Joshi", "Pillai", "Chatterjee", "Bose", "Malhotra", "Desai"];

/** Real batches spanning 2 admission years, so "year"/batch filtering (Leaderboard, Activity targeting) has genuine variety to filter over, not one flat cohort. */
const BATCHES = ["2022-2026", "2023-2027"];
const SECTIONS = ["A", "B"];

function randomName(): string {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

/** Creates 10-12 real Student accounts per organization, spread realistically across departments, 2 batches, semesters, and sections. */
export async function seedStudents(org: SeededOrganization): Promise<SeededStudent[]> {
  const results: SeededStudent[] = [];
  const count = randomInt(10, 12);
  const passwordHash = await hashSeedPassword(SEED_PASSWORD);

  for (let i = 0; i < count; i++) {
    const department = org.departments[i % org.departments.length];
    const batch = pick(BATCHES);
    const section = pick(SECTIONS);
    const semester = batch === "2022-2026" ? randomInt(5, 7) : randomInt(1, 3);
    const name = randomName();
    const email = `student${i + 1}@${org.code.toLowerCase()}.edu`;
    const usn = `${org.code}${batch.slice(2, 4)}${String(i + 1).padStart(3, "0")}`;

    const user = await UserModel.create({
      organizationId: org.id,
      name,
      email,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      auth: { passwordHash, emailVerified: true },
    });

    const student = await StudentModel.create({
      organizationId: org.id,
      userId: user._id,
      departmentId: department.id,
      usn,
      batch,
      semester,
      section,
      cgpa: Number((randomInt(60, 95) / 10).toFixed(1)),
      status: StudentStatus.ACTIVE,
    });

    recordCredential({ organization: org.name, role: "Student", name, email, password: SEED_PASSWORD });

    results.push({
      studentId: student._id.toString(),
      userId: user._id.toString(),
      name,
      email,
      password: SEED_PASSWORD,
      departmentId: department.id,
      batch,
      semester,
      section,
    });
  }

  console.log(`Seed: created ${results.length} students for "${org.name}"`);
  return results;
}
