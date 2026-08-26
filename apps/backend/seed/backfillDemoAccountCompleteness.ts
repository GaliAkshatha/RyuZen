import { OrganizationModel } from "../src/domains/organizations/infrastructure/persistence/OrganizationModel.js";
import { UserModel } from "../src/domains/identity/infrastructure/persistence/UserModel.js";
import { UserRole } from "../src/domains/identity/domain/constants/UserRole.js";
import { ActivityModel } from "../src/domains/academic/activities/infrastructure/persistence/ActivityModel.js";
import { SubmissionModel } from "../src/domains/academic/submissions/infrastructure/persistence/SubmissionModel.js";
import { SubmissionStatus } from "../src/domains/academic/submissions/domain/constants/SubmissionStatus.js";
import { ActivityStatus } from "../src/domains/academic/activities/domain/constants/ActivityStatus.js";
import { RecruiterModel } from "../src/domains/placements/recruiters/infrastructure/persistence/RecruiterModel.js";
import { PlacementDriveModel } from "../src/domains/placements/drives/infrastructure/persistence/PlacementDriveModel.js";
import { PlacementDriveStatus } from "../src/domains/placements/drives/domain/constants/PlacementDriveStatus.js";
import { JobApplicationModel } from "../src/domains/placements/applications/infrastructure/persistence/JobApplicationModel.js";
import { CompanyModel } from "../src/domains/placements/companies/infrastructure/persistence/CompanyModel.js";
import { LeaderboardEntry } from "../src/domains/campus/leaderboard/domain/entities/LeaderboardEntry.js";
import { LeaderboardRepository } from "../src/domains/campus/leaderboard/infrastructure/repositories/LeaderboardRepository.js";
import { StudentRepository } from "../src/domains/academic/students/infrastructure/repositories/StudentRepository.js";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";
import { randomInt, pick } from "./utils/random.js";

const studentRepository = new StudentRepository();
const leaderboardRepository = new LeaderboardRepository();

/**
 * Standalone backfill applying two real fixes from this session to
 * organizations that already existed before those fixes landed -
 * the same real gap the idempotent main seed script has for any
 * fix: an org that already exists skips ALL data creation on a
 * re-run, including these two new guarantees. This script targets
 * exactly that gap, touching only the two specific demo accounts
 * (student1, recruiter1) - creates nothing else, deletes nothing.
 *
 * Fix 1: student1 is guaranteed at least 3 real APPROVED submissions
 * (with real pointsAwarded) so they have a genuine leaderboard entry
 * and career score, instead of possibly having rolled zero
 * submissions across every activity under the original fully-random
 * seedSubmissions logic.
 *
 * Fix 2: recruiter1's own company is guaranteed a real PUBLISHED
 * drive (previously, drives and recruiters were assigned to
 * companies via two independent random picks with no guaranteed
 * overlap - recruiter1's company could easily have received no
 * drive at all), plus a few real applications so the pipeline isn't
 * empty.
 */
async function main(): Promise<void> {
  console.log("Backfilling demo account completeness (student1, recruiter1) for existing organizations\n");

  await connectForSeed();

  const organizations = await OrganizationModel.find({});

  for (const orgDoc of organizations) {
    const organizationId = orgDoc._id.toString();
    console.log(`\n--- "${orgDoc.name}" ---`);

    await backfillDemoStudent(organizationId);
    await backfillDemoRecruiter(organizationId);
  }

  await disconnectAfterSeed();
  console.log("\nDone.");
}

async function backfillDemoStudent(organizationId: string): Promise<void> {
  const demoUser = await UserModel.findOne({ organizationId, role: UserRole.STUDENT, email: /^student1@/ });
  if (!demoUser) {
    console.log("  Skipping student backfill - no student1 account found.");
    return;
  }

  const student = await studentRepository.findByUserId(demoUser._id.toString());
  if (!student?.departmentId) {
    console.log("  Skipping student backfill - student1 has no department on record.");
    return;
  }

  const existingApproved = await SubmissionModel.countDocuments({
    submittedBy: demoUser._id,
    status: SubmissionStatus.APPROVED,
  });

  const DEMO_MIN_APPROVED = 3;
  let newApprovedCount = 0;

  if (existingApproved < DEMO_MIN_APPROVED) {
    const alreadySubmittedTo = (await SubmissionModel.find({ submittedBy: demoUser._id }).distinct("activityId")) as unknown[];

    const eligibleActivities = await ActivityModel.find({
      organizationId,
      status: ActivityStatus.PUBLISHED,
      departmentIds: student.departmentId,
      _id: { $nin: alreadySubmittedTo },
    }).limit(DEMO_MIN_APPROVED - existingApproved);

    for (const activity of eligibleActivities) {
      await SubmissionModel.create({
        activityId: activity._id,
        organizationId,
        submittedBy: demoUser._id,
        status: SubmissionStatus.APPROVED,
        remarks: "Completed as per the activity brief.",
        attachments: [{ name: "submission.pdf", url: "https://example.com/submission.pdf", mimeType: "application/pdf" }],
        review: { reviewedBy: activity.createdBy, reviewedAt: new Date(), feedback: "Well done - approved.", pointsAwarded: activity.points },
        submittedAt: new Date(Date.now() - randomInt(1, 8) * 24 * 60 * 60 * 1000),
      });
      newApprovedCount++;
    }
  }

  if (newApprovedCount === 0 && existingApproved >= DEMO_MIN_APPROVED) {
    console.log(`  student1 already has ${existingApproved} approved submissions - no backfill needed.`);
    return;
  }

  if (newApprovedCount === 0) {
    console.log("  student1 needs more approved submissions, but no eligible published activities were found to backfill with.");
    return;
  }

  const allApproved = await SubmissionModel.find({ submittedBy: demoUser._id, status: SubmissionStatus.APPROVED }).populate("activityId", "points");
  const activityPoints = allApproved.reduce((sum, s) => {
    const activity = s.activityId as unknown as { points?: number };
    return sum + (activity?.points ?? 0);
  }, 0);

  const existingEntry = await leaderboardRepository.findByStudentId(organizationId, student.id!);

  await leaderboardRepository.upsert(
    LeaderboardEntry.create({
      organizationId,
      studentId: student.id!,
      activityPoints,
      clubPoints: existingEntry?.clubPoints ?? randomInt(0, 15),
      eventPoints: existingEntry?.eventPoints ?? randomInt(0, 15),
      placementPoints: existingEntry?.placementPoints ?? 0,
      totalPoints: activityPoints + (existingEntry?.clubPoints ?? 0) + (existingEntry?.eventPoints ?? 0) + (existingEntry?.placementPoints ?? 0),
      rank: existingEntry?.rank ?? 0,
    }),
  );

  await leaderboardRepository.reRank(organizationId);

  console.log(`  student1: created ${newApprovedCount} new approved submission(s), leaderboard entry updated (${activityPoints} activity points).`);
}

async function backfillDemoRecruiter(organizationId: string): Promise<void> {
  const demoRecruiterUser = await UserModel.findOne({ organizationId, role: UserRole.RECRUITER, email: /^recruiter1@/ });
  if (!demoRecruiterUser) {
    console.log("  Skipping recruiter backfill - no recruiter1 account found.");
    return;
  }

  const recruiter = await RecruiterModel.findOne({ userId: demoRecruiterUser._id });
  if (!recruiter) {
    console.log("  Skipping recruiter backfill - no Recruiter record for recruiter1.");
    return;
  }

  const existingDrive = await PlacementDriveModel.findOne({
    companyId: recruiter.companyId,
    status: { $in: [PlacementDriveStatus.PUBLISHED, PlacementDriveStatus.CLOSED] },
  });

  let drive = existingDrive;

  if (!drive) {
    const company = await CompanyModel.findById(recruiter.companyId);
    if (!company) {
      console.log("  Skipping recruiter backfill - recruiter1's company record was not found.");
      return;
    }

    drive = await PlacementDriveModel.create({
      organizationId,
      companyId: recruiter.companyId,
      title: `Software Engineer — ${company.name}`,
      description: `${company.name} is hiring for Software Engineer - real, hands-on work across our core product.`,
      package: `${randomInt(4, 18)} LPA`,
      location: pick(["Bengaluru", "Hyderabad", "Pune", "Remote"]),
      deadline: new Date(Date.now() + randomInt(7, 45) * 24 * 60 * 60 * 1000),
      status: PlacementDriveStatus.PUBLISHED,
    });

    console.log(`  recruiter1: created a real PUBLISHED drive for their company ("${company.name}") - none existed before.`);
  } else {
    console.log("  recruiter1's company already has a real published/closed drive - no drive backfill needed.");
  }

  const existingApplications = await JobApplicationModel.countDocuments({ placementId: drive._id });
  if (existingApplications > 0) {
    console.log(`  Drive already has ${existingApplications} real application(s) - no application backfill needed.`);
    return;
  }

  const orgStudents = await studentRepository.findByOrganization(organizationId, {});
  const applicants = orgStudents.slice(0, Math.min(6, orgStudents.length));

  let created = 0;
  for (const student of applicants) {
    const status = pick(["APPLIED", "APPLIED", "SHORTLISTED", "SELECTED"]);
    await JobApplicationModel.create({
      placementId: drive._id,
      studentId: student.id,
      resume: "https://example.com/resume.pdf",
      status,
      remarks: status === "SELECTED" ? "Offer extended." : undefined,
      appliedAt: new Date(Date.now() - randomInt(1, 20) * 24 * 60 * 60 * 1000),
    });
    created++;
  }

  console.log(`  recruiter1's drive had zero applicants - created ${created} real application(s).`);
}

main().catch((error) => {
  console.error("Backfill failed");
  console.error(error);
  process.exit(1);
});
