import { cn } from "@/utils/cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";

export interface LeaderboardCardProps {
  rank: number;
  name: string;
  points: number;
  avatarUrl?: string;
  /** Highlights the row, e.g. for "this is you" in a leaderboard list. */
  isCurrentUser?: boolean;
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LeaderboardCard({
  rank,
  name,
  points,
  avatarUrl,
  isCurrentUser,
  className,
}: LeaderboardCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-lg border border-border bg-card p-3",
        isCurrentUser && "border-primary bg-primary/5",
        className,
      )}
    >
      <span className="w-6 text-center font-display text-sm font-semibold text-muted-foreground">
        {rank}
      </span>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{initialsOf(name)}</AvatarFallback>
      </Avatar>
      <span className="flex-1 truncate font-body text-sm text-foreground">{name}</span>
      <span className="font-display text-sm font-semibold text-primary">{points} pts</span>
    </div>
  );
}
