import { OrganizationModel } from "../src/domains/organizations/infrastructure/persistence/OrganizationModel.js";
import { DepartmentModel } from "../src/domains/academic/departments/infrastructure/persistence/DepartmentModel.js";
import { UserModel } from "../src/domains/identity/infrastructure/persistence/UserModel.js";
import { UserRole } from "../src/domains/identity/domain/constants/UserRole.js";
import { FacultyRepository } from "../src/domains/academic/faculty/infrastructure/repositories/FacultyRepository.js";
import { StudentRepository } from "../src/domains/academic/students/infrastructure/repositories/StudentRepository.js";
import { AIChatModel } from "../src/domains/ai/chat/infrastructure/persistence/AIChatModel.js";
import { NotificationModel } from "../src/domains/communication/notifications/infrastructure/persistence/NotificationModel.js";

import { connectForSeed, disconnectAfterSeed } from "./utils/connection.js";
import { seedAiChats } from "./data/aiChats.js";
import { seedNotifications } from "./data/notifications.js";
import type { SeededOrganization, SeededFaculty, SeededStudent } from "./types.js";

const facultyRepository = new FacultyRepository();
const studentRepository = new StudentRepository();

/**
 * Standalone backfill for organizations that already existed before
 * AI chat and notification seeding were added to the main seed
 * script - the main script's real per-organization idempotency
 * (confirmed necessary to avoid the E11000 duplicate-org error from
 * earlier) means a plain re-run skips ALL data creation for an org
 * that already exists, including this new data. This script targets
 * exactly that gap: reads each real organization's existing
 * faculty/students/departments/org-admin from the database (the same
 * real data recordExistingOrgCredentials already reads for
 * credentials) and runs only the two new seed steps against them -
 * creates AI chats and notifications, touches nothing else.
 */
async function main(): Promise<void> {
  console.log("Backfilling AI chats and notifications for existing organizations\n");

  await connectForSeed();

  const organizations = await OrganizationModel.find({});

  for (const orgDoc of organizations) {
    const organizationId = orgDoc._id.toString();

    const [departments, orgAdminUser, facultyEntities, studentEntities] = await Promise.all([
      DepartmentModel.find({ organizationId }),
      UserModel.findOne({ organizationId, role: UserRole.ORG_ADMIN }),
      facultyRepository.findByOrganization(organizationId, {}),
      studentRepository.findByOrganization(organizationId, {}),
    ]);

    if (!orgAdminUser || facultyEntities.length === 0 || studentEntities.length === 0) {
      console.log(`Skipping "${orgDoc.name}" - missing an org admin, faculty, or students to seed against.`);
      continue;
    }

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
      name: "",
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
  }

  await disconnectAfterSeed();

  console.log("\nDone.");
}

main().catch((error) => {
  console.error("Backfill failed");
  console.error(error);
  process.exit(1);
});
