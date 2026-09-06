import { OrganizationModel } from "../src/domains/organizations/infrastructure/persistence/OrganizationModel.js";
import { StudentModel } from "../src/domains/academic/students/infrastructure/persistence/StudentModel.js";
import { FacultyModel } from "../src/domains/academic/faculty/infrastructure/persistence/FacultyModel.js";
import { UserModel } from "../src/domains/identity/infrastructure/persistence/UserModel.js";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";

import { seedClubs } from "./data/clubs.js";
import { seedEvents } from "./data/events.js";
import { seedBadges } from "./data/badges.js";
import { seedAssessments } from "./data/assessments.js";
import { seedAttendance } from "./data/attendance.js";
import { seedMockInterviews } from "./data/mockInterviews.js";

import type { SeededOrganization, SeededFaculty, SeededStudent } from "./types.js";

/**
 * Standalone backfill for the same real, recurring gap every backfill
 * script in this folder exists to close: an organization that
 * already existed before a new seed feature was added skips ALL data
 * creation on a re-run of `npm run seed` (see index.ts's own
 * `alreadyExisted` guard) - including these six domains, added after
 * most real testing organizations were already seeded. This targets
 * exactly that gap. Creates real clubs/events/badges/assessments/
 * attendance/mock-interviews for every existing organization's real,
 * already-existing faculty and students - creates no new
 * organizations, faculty, or students, and deletes nothing.
 */
async function main(): Promise<void> {
  console.log("Backfilling clubs, events, badges, assessments, attendance, and mock interviews for existing organizations\n");

  await connectForSeed();

  const organizations = await OrganizationModel.find({});

  for (const orgDoc of organizations) {
    const organizationId = orgDoc._id.toString();
    console.log(`\n--- "${orgDoc.name}" ---`);

    const org: SeededOrganization = {
      id: organizationId,
      name: orgDoc.name,
      code: orgDoc.code,
      orgAdmin: { id: "", name: "", email: "", password: "", role: "ORG_ADMIN" },
      departments: [],
      alreadyExisted: true,
    };

    const facultyDocs = await FacultyModel.find({ organizationId });
    const faculty: SeededFaculty[] = [];
    for (const doc of facultyDocs) {
      const user = await UserModel.findById(doc.userId);
      if (!user) continue;
      faculty.push({
        facultyId: doc._id.toString(),
        userId: doc.userId.toString(),
        name: user.name,
        email: user.email,
        password: "",
        departmentId: doc.departmentId?.toString() ?? "",
      });
    }

    const studentDocs = await StudentModel.find({ organizationId });
    const students: SeededStudent[] = [];
    for (const doc of studentDocs) {
      const user = await UserModel.findById(doc.userId);
      if (!user) continue;
      students.push({
        studentId: doc._id.toString(),
        userId: doc.userId.toString(),
        name: user.name,
        email: user.email,
        password: "",
        departmentId: doc.departmentId?.toString() ?? "",
        batch: doc.batch,
        semester: doc.semester,
        section: doc.section ?? "",
      });
    }

    if (faculty.length === 0 || students.length === 0) {
      console.log(`  Skipping - no existing faculty/students found for this organization.`);
      continue;
    }

    const clubs = await seedClubs(org, faculty, students);
    await seedEvents(org, faculty, students, clubs);
    await seedBadges(org, faculty, students);
    await seedAssessments(org, faculty, students);
    await seedAttendance(org, faculty, students);
    await seedMockInterviews(org, students);

    console.log(`  Done - ${clubs.length} clubs and their related data created.`);
  }

  await disconnectAfterSeed();

  console.log("\nBackfill: complete");
}

main().catch((error) => {
  console.error("Backfill: failed");
  console.error(error);
  process.exit(1);
});
