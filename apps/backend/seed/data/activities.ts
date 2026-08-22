import { ActivityModel } from "../../src/domains/academic/activities/infrastructure/persistence/ActivityModel.js";
import { ActivityStatus } from "../../src/domains/academic/activities/domain/constants/ActivityStatus.js";
import { ActivityType } from "../../src/domains/academic/activities/domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../src/domains/academic/activities/domain/constants/ActivityVisibility.js";

import { pick, randomInt, chance } from "../utils/random.js";
import type { SeededOrganization, SeededFaculty, SeededActivity } from "../types.js";

const ACTIVITY_TITLES: Record<string, string[]> = {
  [ActivityType.ASSIGNMENT]: ["Data Structures Assignment", "Database Design Exercise", "Algorithms Problem Set"],
  [ActivityType.WORKSHOP]: ["Cloud Fundamentals Workshop", "Git & GitHub Workshop", "AI Tools Workshop"],
  [ActivityType.EVENT]: ["Tech Talk: Careers in Engineering", "Alumni Panel Discussion"],
  [ActivityType.HACKATHON]: ["24-Hour Campus Hackathon", "Innovation Sprint"],
  [ActivityType.QUIZ]: ["Aptitude Quiz Round 1", "Core CS Concepts Quiz"],
};

const ACTIVITY_TYPES = Object.keys(ACTIVITY_TITLES) as ActivityType[];

/**
 * Creates 2-3 real activities per faculty member, each genuinely
 * targeted to that faculty's own department (departmentIds is
 * required on create, confirmed against the real backend schema this
 * session) - with real, varied batch/semester/section targeting on
 * top for realistic eligibility testing, and a genuine status mix
 * (mostly PUBLISHED, since only published activities are visible to
 * students, with a couple of real drafts too).
 */
export async function seedActivities(org: SeededOrganization, faculty: SeededFaculty[]): Promise<SeededActivity[]> {
  const results: SeededActivity[] = [];

  for (const member of faculty) {
    const activityCount = randomInt(2, 3);

    for (let i = 0; i < activityCount; i++) {
      const type = pick(ACTIVITY_TYPES);
      const title = pick(ACTIVITY_TITLES[type]);
      const status = chance(0.8) ? ActivityStatus.PUBLISHED : ActivityStatus.DRAFT;
      const points = randomInt(20, 100);

      const activity = await ActivityModel.create({
        organizationId: org.id,
        createdBy: member.userId,
        title,
        description: `${title} - real hands-on work for students in this department.`,
        type,
        status,
        visibility: ActivityVisibility.DEPARTMENT,
        departmentIds: [member.departmentId],
        batches: chance(0.4) ? [pick(["2022-2026", "2023-2027"])] : undefined,
        semesters: chance(0.3) ? [pick([5, 6, 7])] : undefined,
        sections: chance(0.3) ? [pick(["A", "B"])] : undefined,
        points,
        penaltyPoints: 0,
        startDate: new Date(Date.now() - randomInt(1, 10) * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + randomInt(5, 30) * 24 * 60 * 60 * 1000),
      });

      results.push({
        id: activity._id.toString(),
        title,
        createdBy: member.userId,
        departmentId: member.departmentId,
        points,
      });
    }
  }

  console.log(`Seed: created ${results.length} activities for "${org.name}"`);
  return results;
}
