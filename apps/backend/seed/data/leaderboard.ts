import { LeaderboardEntryModel } from "../../src/domains/campus/leaderboard/infrastructure/persistence/LeaderboardEntryModel.js";
import { LeaderboardRepository } from "../../src/domains/campus/leaderboard/infrastructure/repositories/LeaderboardRepository.js";
import { JobApplicationModel } from "../../src/domains/placements/applications/infrastructure/persistence/JobApplicationModel.js";

import { randomInt } from "../utils/random.js";
import type { SeededStudent } from "../types.js";

/**
 * Creates one real LeaderboardEntry per student who earned real
 * activityPoints (from seedSubmissions' approved-points map) - real
 * students with zero approved submissions simply don't appear, same
 * as the real backend would never rank a student with nothing to
 * rank. studentId here is the Student document's own id (confirmed
 * directly against RecalculateLeaderboardUseCase - `studentId:
 * student.id!`, not student.userId, a different reference than
 * Submission's submittedBy). placementPoints comes from real
 * JobApplication SELECTED outcomes, a small real bonus per selection
 * - reuses the real repository's reRank() for the actual rank
 * ordering, the same method the real recalculate endpoint calls, so
 * rank is never hand-computed separately from how the app itself
 * computes it.
 */
export async function seedLeaderboard(organizationId: string, students: SeededStudent[], pointsByUserId: Map<string, number>): Promise<void> {
  const repository = new LeaderboardRepository();
  let created = 0;

  for (const student of students) {
    const activityPoints = pointsByUserId.get(student.userId) ?? 0;

    const selectedApplications = await JobApplicationModel.countDocuments({
      studentId: student.studentId,
      status: "SELECTED",
    });

    const placementPoints = selectedApplications * randomInt(30, 60);

    if (activityPoints === 0 && placementPoints === 0) continue;

    const clubPoints = randomInt(0, 15);
    const eventPoints = randomInt(0, 15);
    const totalPoints = activityPoints + clubPoints + eventPoints + placementPoints;

    await LeaderboardEntryModel.create({
      organizationId,
      studentId: student.studentId,
      activityPoints,
      clubPoints,
      eventPoints,
      placementPoints,
      totalPoints,
      rank: 0,
    });

    created++;
  }

  await repository.reRank(organizationId);

  console.log(`Seed: created ${created} leaderboard entries`);
}
