import { BadgeModel } from "../../src/domains/campus/badges/infrastructure/persistence/BadgeModel.js";
import { StudentBadgeModel } from "../../src/domains/campus/badges/infrastructure/persistence/StudentBadgeModel.js";

import { pickMany, randomInt } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededStudent } from "../types.js";

const BADGE_CATALOG: { name: string; description: string; icon: string; criteria: string; points: number }[] = [
  { name: "Early Bird", description: "Among the first to join the platform.", icon: "🌅", criteria: "Registered in the first week of launch.", points: 10 },
  { name: "Team Player", description: "Consistently collaborates well with peers.", icon: "🤝", criteria: "Recognized by faculty for group contribution.", points: 15 },
  { name: "Coding Star", description: "Real, demonstrated strength in competitive programming.", icon: "💻", criteria: "Solved 50+ problems on a linked coding profile.", points: 25 },
  { name: "Event Champion", description: "Active, consistent participant in campus events.", icon: "🏆", criteria: "Attended 5+ campus events.", points: 20 },
  { name: "Mentor's Pick", description: "Personally recognized by their faculty mentor.", icon: "⭐", criteria: "Awarded directly by an assigned mentor.", points: 15 },
  { name: "Hackathon Finalist", description: "Reached the finals of a real campus hackathon.", icon: "🚀", criteria: "Top-3 finish in a hackathon activity.", points: 30 },
  { name: "Perfect Attendance", description: "No missed sessions across a full term.", icon: "📅", criteria: "100% attendance for a full semester.", points: 20 },
  { name: "Community Builder", description: "Genuinely active in campus clubs and organizing.", icon: "🌱", criteria: "Held an office (President/VP) in a campus club.", points: 25 },
];

let cachedBadgeIds: string[] | null = null;

/**
 * The real badge catalog is global, not per-organization - Badge.name
 * has a unique index with no organizationId scoping it, confirmed
 * directly against BadgeModel.ts. Seeded once, reused across every
 * organization this script processes, matching the same
 * already-exists pattern organizations.ts uses for itself.
 */
async function ensureBadgeCatalog(): Promise<string[]> {
  if (cachedBadgeIds) {
    return cachedBadgeIds;
  }

  const ids: string[] = [];

  for (const def of BADGE_CATALOG) {
    const existing = await BadgeModel.findOne({ name: def.name });
    if (existing) {
      ids.push(existing._id.toString());
      continue;
    }
    const created = await BadgeModel.create(def);
    ids.push(created._id.toString());
  }

  cachedBadgeIds = ids;
  return ids;
}

/**
 * Real awarding, not just catalog creation - a genuine subset of
 * students in this organization actually receive 1-3 real badges
 * each, awarded by a real faculty member's user account. The demo
 * student is guaranteed at least one award, matching the same
 * guarantee pattern used elsewhere in this seed script.
 */
export async function seedBadges(
  org: SeededOrganization,
  faculty: SeededFaculty[],
  students: SeededStudent[],
): Promise<void> {
  const badgeIds = await ensureBadgeCatalog();
  const awarder = faculty[0];
  if (!awarder) {
    return;
  }

  const demoStudent = students.find((s) => s.email.startsWith("student1@"));
  const recipients = new Set(pickMany(students, Math.max(3, Math.floor(students.length * 0.4))).map((s) => s.studentId));
  if (demoStudent) {
    recipients.add(demoStudent.studentId);
  }

  for (const studentId of recipients) {
    const awardCount = randomInt(1, 3);
    const awardedBadges = pickMany(badgeIds, awardCount);

    for (const badgeId of awardedBadges) {
      await StudentBadgeModel.create({
        studentId,
        badgeId,
        awardedBy: awarder.userId,
        awardedAt: new Date(Date.now() - randomInt(5, 200) * 24 * 60 * 60 * 1000),
      });
    }
  }
}
