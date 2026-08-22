import { fileURLToPath } from "url";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";
import { seedOrganizations } from "./data/organizations.js";
import { seedFaculty } from "./data/faculty.js";
import { seedStudents } from "./data/students.js";
import { seedAlumni } from "./data/alumni.js";
import { seedPlacementAdmin } from "./data/placementAdmins.js";
import { seedCompanies } from "./data/companies.js";
import { seedRecruiters } from "./data/recruiters.js";
import { seedDrives } from "./data/drives.js";
import { seedActivities } from "./data/activities.js";
import { seedSubmissions } from "./data/submissions.js";
import { seedApplications } from "./data/applications.js";
import { seedConnections } from "./data/connections.js";
import { seedLeaderboard } from "./data/leaderboard.js";
import { generateCredentialsFile } from "./generateCredentialsFile.js";
import { recordExistingOrgCredentials } from "./utils/recordExistingCredentials.js";

/**
 * Full seed run, one organization at a time, in real dependency
 * order - departments before faculty/students (both reference a real
 * departmentId), faculty before activities (activities need a real
 * creator), students+activities before submissions, drives+students
 * before applications, submissions+applications before the
 * leaderboard (it aggregates both). Platform Admin (SUPER_ADMIN) is
 * deliberately never touched anywhere in this script, per explicit
 * instruction - only real ORG_ADMIN-scoped data is created.
 */
async function main(): Promise<void> {
  console.log("Seed: starting\n");

  await connectForSeed();

  const organizations = await seedOrganizations();

  for (const org of organizations) {
    if (org.alreadyExisted) {
      console.log(`\n--- "${org.name}" already exists - skipping data creation, recording its existing accounts ---`);
      await recordExistingOrgCredentials(org.id, org.name);
      continue;
    }

    console.log(`\n--- Seeding "${org.name}" ---`);

    const faculty = await seedFaculty(org);
    const students = await seedStudents(org);
    const alumni = await seedAlumni(org);
    await seedPlacementAdmin(org);
    const companies = await seedCompanies(org);
    await seedRecruiters(org, companies);
    const drives = await seedDrives(org, companies);
    const activities = await seedActivities(org, faculty);
    const pointsByUserId = await seedSubmissions(org.id, activities, students);
    await seedApplications(drives, students);
    await seedConnections(org.id, students, faculty, alumni);
    await seedLeaderboard(org.id, students, pointsByUserId);
  }

  const credentialsPath = fileURLToPath(new URL("../SEED_CREDENTIALS.md", import.meta.url));
  await generateCredentialsFile(credentialsPath);

  await disconnectAfterSeed();

  console.log("\nSeed: complete");
}

main().catch((error) => {
  console.error("Seed: failed");
  console.error(error);
  process.exit(1);
});
