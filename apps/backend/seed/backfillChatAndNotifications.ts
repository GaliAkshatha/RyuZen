import { OrganizationModel } from "../src/domains/organizations/infrastructure/persistence/OrganizationModel.js";
import { DepartmentModel } from "../src/domains/academic/departments/infrastructure/persistence/DepartmentModel.js";
import { UserModel } from "../src/domains/identity/infrastructure/persistence/UserModel.js";
import { UserRole } from "../src/domains/identity/domain/constants/UserRole.js";
import { FacultyRepository } from "../src/domains/academic/faculty/infrastructure/repositories/FacultyRepository.js";
import { StudentRepository } from "../src/domains/academic/students/infrastructure/repositories/StudentRepository.js";
import { AIChatModel } from "../src/domains/ai/chat/infrastructure/persistence/AIChatModel.js";
import { NotificationModel } from "../src/domains/communication/notifications/infrastructure/persistence/NotificationModel.js";
import { NewsModel } from "../src/domains/communication/news/infrastructure/persistence/NewsModel.js";
import { ChatModel } from "../src/domains/communication/chat/infrastructure/persistence/ChatModel.js";
import { UserPortfolioModel } from "../src/domains/career/user-portfolio/infrastructure/persistence/UserPortfolioModel.js";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";
import { seedAiChats } from "./data/aiChats.js";
import { seedNotifications } from "./data/notifications.js";
import { seedNews } from "./data/news.js";
import { seedMessages } from "./data/messages.js";
import { seedPortfolios } from "./data/portfolios.js";
import type { SeededOrganization, SeededFaculty, SeededStudent } from "./types.js";

const facultyRepository = new FacultyRepository();
const studentRepository = new StudentRepository();

/**
 * Standalone backfill for organizations that already existed before
 * AI chat, notification, and news seeding were added to the main
 * seed script - the main script's real per-organization idempotency
 * (confirmed necessary to avoid the E11000 duplicate-org error from
 * earlier) means a plain re-run skips ALL data creation for an org
 * that already exists, including this new data. This script targets
 * exactly that gap: reads each real organization's existing
 * faculty/students/departments/org-admin from the database (the same
 * real data recordExistingOrgCredentials already reads for
 * credentials) and runs the three new seed steps against them -
 * creates AI chats, notifications, and news, touches nothing else.
 *
 * Faculty names: a real gap found while adding News support here -
 * FacultyRepository.findByOrganization returns Faculty entities,
 * which don't carry a name (that lives on the linked User document) -
 * previously left as empty strings, tolerated because neither AI
 * chats nor notifications ever used faculty.name. News does (real
 * author attribution), so this now does one real batch UserModel
 * query to fill in genuine names, not empty strings.
 */
async function main(): Promise<void> {
  console.log("Backfilling AI chats, notifications, news, conversations, and portfolios for existing organizations\n");

  await connectForSeed();

  const organizations = await OrganizationModel.find({});

  for (const orgDoc of organizations) {
    const organizationId = orgDoc._id.toString();

    const [departments, orgAdminUser, placementAdminUser, facultyEntities, studentEntities] = await Promise.all([
      DepartmentModel.find({ organizationId }),
      UserModel.findOne({ organizationId, role: UserRole.ORG_ADMIN }),
      UserModel.findOne({ organizationId, role: UserRole.PLACEMENT_ADMIN }),
      facultyRepository.findByOrganization(organizationId, {}),
      studentRepository.findByOrganization(organizationId, {}),
    ]);

    if (!orgAdminUser || facultyEntities.length === 0 || studentEntities.length === 0) {
      console.log(`Skipping "${orgDoc.name}" - missing an org admin, faculty, or students to seed against.`);
      continue;
    }

    const facultyUsers = await UserModel.find({ _id: { $in: facultyEntities.map((f) => f.userId) } });
    const facultyNameByUserId = new Map(facultyUsers.map((u) => [u._id.toString(), u.name]));

    const org: SeededOrganization = {
      id: organizationId,
      name: orgDoc.name,
      code: orgDoc.code,
      orgAdmin: {
        id: orgAdminUser._id.toString(),
        name: orgAdminUser.name,
        email: orgAdminUser.email,
        password: "",
        role: UserRole.ORG_ADMIN,
      },
      departments: departments.map((d) => ({ id: d._id.toString(), name: d.name, code: d.code })),
      alreadyExisted: true,
    };

    const faculty: SeededFaculty[] = facultyEntities.map((f) => ({
      facultyId: f.id!,
      userId: f.userId,
      name: facultyNameByUserId.get(f.userId) ?? "",
      email: "",
      password: "",
      departmentId: f.departmentId ?? "",
    }));

    const students: SeededStudent[] = studentEntities.map((s) => ({
      studentId: s.id!,
      userId: s.userId,
      name: "",
      email: "",
      password: "",
      departmentId: s.departmentId ?? "",
      batch: s.batch,
      semester: s.semester,
      section: s.section ?? "",
    }));

    const existingChatCount = await AIChatModel.countDocuments({ userId: { $in: students.map((s) => s.userId) } });
    const existingNotificationCount = await NotificationModel.countDocuments({ organizationId });
    const existingNewsCount = await NewsModel.countDocuments({ organizationId });
    const existingChatDocCount = await ChatModel.countDocuments({ organizationId });
    const existingPortfolioCount = await UserPortfolioModel.countDocuments({ userId: { $in: students.map((s) => s.userId) } });

    console.log(`\n--- "${org.name}" ---`);

    if (existingChatCount > 0) {
      console.log(`  Skipping AI chats - ${existingChatCount} already exist for this organization's students.`);
    } else {
      await seedAiChats(students);
    }

    if (existingNotificationCount > 0) {
      console.log(`  Skipping notifications - ${existingNotificationCount} already exist for this organization.`);
    } else {
      await seedNotifications(org, faculty, students);
    }

    if (existingNewsCount > 0) {
      console.log(`  Skipping news - ${existingNewsCount} post(s) already exist for this organization.`);
    } else if (!placementAdminUser) {
      console.log("  Skipping news - no Placement Admin account found for this organization.");
    } else {
      await seedNews(org, faculty, { id: placementAdminUser._id.toString(), name: placementAdminUser.name });
    }

    if (existingChatDocCount > 0) {
      console.log(`  Skipping conversations - ${existingChatDocCount} already exist for this organization.`);
    } else {
      await seedMessages(organizationId, students);
    }

    if (existingPortfolioCount > 0) {
      console.log(`  Skipping portfolios - ${existingPortfolioCount} already exist for this organization's students.`);
    } else {
      await seedPortfolios(students);
    }
  }

  await disconnectAfterSeed();

  console.log("\nDone.");
}

main().catch((error) => {
  console.error("Backfill failed");
  console.error(error);
  process.exit(1);
});
