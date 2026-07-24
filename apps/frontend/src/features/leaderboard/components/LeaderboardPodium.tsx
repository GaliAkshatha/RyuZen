import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/shared/ui/Avatar";
import { cn } from "@/utils/cn";

import type { LeaderboardEntryResponseDto } from "@/features/leaderboard/types/leaderboard.types";
import type { StudentResponseDto } from "@/features/students/types/student.types";
import { studentLabel } from "@/features/students/utils/studentLabels";
import { initialsOf } from "@/utils/initialsOf";

interface LeaderboardPodiumProps {
  first?: LeaderboardEntryResponseDto;
  second?: LeaderboardEntryResponseDto;
  third?: LeaderboardEntryResponseDto;
  resolveStudent: (studentId: string) => StudentResponseDto | undefined;
}


const PLACE_STYLE = {
  1: {
    order: "sm:order-2",
    height: "sm:h-40",
    ring: "ring-primary/60",
    glow: "shadow-[0_0_32px_-8px_hsl(var(--primary)/0.5)]",
    badge: "bg-primary text-primary-foreground",
    avatarSize: "h-20 w-20",
  },
  2: {
    order: "sm:order-1",
    height: "sm:h-32",
    ring: "ring-border",
    glow: "",
    badge: "bg-muted text-muted-foreground",
    avatarSize: "h-16 w-16",
  },
  3: {
    order: "sm:order-3",
    height: "sm:h-28",
    ring: "ring-warning/40",
    glow: "",
    badge: "bg-warning/20 text-warning",
    avatarSize: "h-16 w-16",
  },
} as const;

function PodiumStep({
  place,
  entry,
  student,
}: {
  place: 1 | 2 | 3;
  entry?: LeaderboardEntryResponseDto;
  student?: StudentResponseDto;
}) {
  const style = PLACE_STYLE[place];

  if (!entry) {
    return <div className={cn("flex-1", style.order)} />;
  }

  const name = student ? studentLabel(student) : entry.studentId;

  return (
    <Link
      to={`/app/leaderboard/${entry.studentId}`}
      className={cn(
        "group flex flex-1 flex-col items-center gap-2 rounded-t-xl border border-b-0 border-border/60 bg-card/60 pb-4 pt-6 transition-all duration-300 hover:bg-card",
        style.order,
      )}
    >
      <div className="relative">
        {place === 1 && (
          <Crown
            className="absolute -top-6 left-1/2 h-6 w-6 -translate-x-1/2 text-primary motion-safe:animate-float"
            aria-hidden="true"
          />
        )}
        <Avatar className={cn(style.avatarSize, "ring-2 ring-offset-2 ring-offset-background", style.ring, style.glow)}>
          <AvatarFallback className="font-display font-bold">{initialsOf(name)}</AvatarFallback>
        </Avatar>
      </div>
      <p className="max-w-[8rem] truncate text-center font-body text-sm font-semibold text-foreground">{name}</p>
      <p className="font-display text-lg font-bold text-foreground">{entry.totalPoints.toLocaleString()}</p>
      <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-xs font-bold", style.badge)}>
        #{entry.rank}
      </span>
      <div className={cn("mt-2 w-full rounded-t-lg bg-gradient-to-t from-primary/10 to-transparent", style.height)} />
    </Link>
  );
}

/**
 * Top-3 podium for the Leaderboard — deliberately original, not a copy
 * of any reference artwork: SVG/CSS only, built entirely from existing
 * tokens (rank 1 = primary/gold glow, 2 = neutral, 3 = warning/amber
 * standing in for bronze), so it themes automatically and adds no new
 * dependencies or assets.
 */
export function LeaderboardPodium({ first, second, third, resolveStudent }: LeaderboardPodiumProps) {
  if (!first && !second && !third) return null;

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-4">
      <PodiumStep place={2} entry={second} student={second ? resolveStudent(second.studentId) : undefined} />
      <PodiumStep place={1} entry={first} student={first ? resolveStudent(first.studentId) : undefined} />
      <PodiumStep place={3} entry={third} student={third ? resolveStudent(third.studentId) : undefined} />
    </div>
  );
}
