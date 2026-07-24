/**
 * Purely presentational Level system, derived client-side from
 * `totalPoints` (the only real, backend-owned gamification number —
 * see LeaderboardEntryResponseDto). There is no "Level" field or
 * concept anywhere in the backend, and this deliberately does not add
 * one — introducing a new persisted field would be a backend/schema
 * change, out of scope for a UI/UX pass on a frozen architecture.
 * Instead, Level is computed fresh from points every render: the same
 * points value always produces the same Level, nothing is stored,
 * and if the scoring model ever changes server-side this simply
 * recomputes correctly with zero migration.
 *
 * Curve: each level requires progressively more points
 * (level N needs N * 50 additional points beyond the previous level),
 * so early levels come quickly (motivating early engagement) while
 * later levels feel earned.
 */
export interface LevelProgress {
  level: number;
  pointsIntoLevel: number;
  pointsForNextLevel: number;
  progress: number;
}

function pointsRequiredForLevel(level: number): number {
  return level * 50;
}

export function computeLevelProgress(totalPoints: number): LevelProgress {
  const safePoints = Math.max(0, totalPoints);

  let level = 1;
  let pointsConsumed = 0;

  while (pointsConsumed + pointsRequiredForLevel(level) <= safePoints) {
    pointsConsumed += pointsRequiredForLevel(level);
    level += 1;
  }

  const pointsForNextLevel = pointsRequiredForLevel(level);
  const pointsIntoLevel = safePoints - pointsConsumed;
  const progress = pointsForNextLevel === 0 ? 0 : pointsIntoLevel / pointsForNextLevel;

  return {
    level,
    pointsIntoLevel,
    pointsForNextLevel,
    progress: Math.min(1, Math.max(0, progress)),
  };
}
