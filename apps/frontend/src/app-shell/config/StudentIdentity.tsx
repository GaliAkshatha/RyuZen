import { useAuth } from "@/contexts/AuthContext";
import { useMyLeaderboardEntry } from "@/features/leaderboard/hooks/useMyLeaderboardEntry";
import { computeLevelProgress } from "@/utils/xpLevel";

/**
 * Sidebar identity slot - real name from auth, real level/progress
 * derived from the same computeLevelProgress utility already used and
 * verified on the (not-yet-rebuilt) dashboard. Sidebar chrome, not
 * Dashboard content - in scope for this shell-integration phase.
 * Silently shows just the name if the leaderboard entry hasn't loaded
 * or doesn't exist yet, rather than a loading flicker in a small
 * sidebar slot.
 */
export function StudentIdentity() {
  const { user } = useAuth();
  const { data: entry } = useMyLeaderboardEntry();
  const progress = entry ? computeLevelProgress(entry.totalPoints) : null;

  return (
    <div className="flex flex-col gap-1.5">
      <p className="truncate font-body text-sm font-medium text-foreground">{user?.name}</p>
      {progress && (
        <>
          <p className="font-body text-xs text-muted-foreground">Level {progress.level}</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${Math.round(progress.progress * 100)}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
