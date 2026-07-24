/**
 * Consolidated from 4 byte-identical copies (AppTopbar, LeaderboardCard,
 * ProfilePage, LeaderboardPodium) found during the final production
 * review — genuine duplication, not intentional per-context variation.
 */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
