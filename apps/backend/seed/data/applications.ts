import { JobApplicationModel } from "../../src/domains/placements/applications/infrastructure/persistence/JobApplicationModel.js";

import { chance, pick, randomInt } from "../utils/random.js";
import type { SeededDrive, SeededStudent } from "../types.js";

/**
 * Creates real job applications from students to PUBLISHED/CLOSED
 * drives. Uses student.studentId (the real Student document's own
 * id), not student.userId - confirmed directly against
 * ApplyToPlacementUseCase, which looks up the Student by userId first
 * and then uses that Student entity's own id for the application,
 * not the User id. A wrong id here would create applications that
 * silently never resolve to a real student in any real query.
 */
export async function seedApplications(drives: SeededDrive[], students: SeededStudent[]): Promise<void> {
  const applicableDrives = drives.filter((d) => d.status === "PUBLISHED" || d.status === "CLOSED");
  let created = 0;

  for (const drive of applicableDrives) {
    const applicants = students.filter(() => chance(0.4));

    for (const student of applicants) {
      const status = pick(["APPLIED", "APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"]);

      await JobApplicationModel.create({
        placementId: drive.id,
        studentId: student.studentId,
        resume: "https://example.com/resume.pdf",
        status,
        remarks: status === "SELECTED" ? "Offer extended." : status === "REJECTED" ? "Not moving forward at this time." : undefined,
        appliedAt: new Date(Date.now() - randomInt(1, 20) * 24 * 60 * 60 * 1000),
      });

      created++;
    }
  }

  console.log(`Seed: created ${created} job applications`);
}
