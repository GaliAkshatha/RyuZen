import { fileURLToPath } from "url";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";
import { seedOrganizations } from "./data/organizations.js";
import { seedFaculty } from "./data/faculty.js";
import { seedStudents } from "./data/students.js";
import { seedAlumni } from "./data/alumni.js";
import { seedClubs } from "./data/clubs.js";
import { seedEvents } from "./data/events.js";
import { seedBadges } from "./data/badges.js";
import { seedAssessments } from "./data/assessments.js";
import { seedAttendance } from "./data/attendance.js";
import { seedMockInterviews } from "./data/mockInterviews.js";
import { seedPlacementAdmin } from "./data/placementAdmins.js";
import { seedCompanies } from "./data/companies.js";
import { seedRecruiters } from "./data/recruiters.js";
import { seedDrives } from "./data/drives.js";
import { seedActivities } from "./data/activities.js";
import { seedSubmissions } from "./data/submissions.js";
import { seedApplications } from "./data/applications.js";
import { seedConnections } from "./data/connections.js";
import { seedLeaderboard } from "./data/leaderboard.js";
import { seedAiChats } from "./data/aiChats.js";
import { seedNotifications } from "./data/notifications.js";
import { seedNews } from "./data/news.js";
import { seedMessages } from "./data/messages.js";
import { seedPortfolios } from "./data/portfolios.js";
import { seedSkills } from "./data/skills.js";
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
    const clubs = await seedClubs(org, faculty, students);
    await seedEvents(org, faculty, students, clubs);
    await seedBadges(org, faculty, students);
    await seedAssessments(org, faculty, students);
    await seedAttendance(org, faculty, students);
    await seedMockInterviews(org, students);
    const alumni = await seedAlumni(org);
    const placementAdmin = await seedPlacementAdmin(org);
    await seedNews(org, faculty, placementAdmin);
    const companies = await seedCompanies(org);
    const recruiters = await seedRecruiters(org, companies);
    const demoRecruiter = recruiters.find((r) => r.email.startsWith("recruiter1@"));
    const drives = await seedDrives(org, companies, demoRecruiter?.companyId);
    const activities = await seedActivities(org, faculty);
    const pointsByUserId = await seedSubmissions(org.id, activities, students);
    await seedApplications(drives, students);
    await seedConnections(org.id, students, faculty, alumni);
    await seedMessages(org.id, students);
    await seedPortfolios(students);
    await seedSkills(students);
    await seedLeaderboard(org.id, students, pointsByUserId);
    await seedAiChats(students);
    await seedNotifications(org, faculty, students);
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
