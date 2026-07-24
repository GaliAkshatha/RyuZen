import { CalendarClock, Coins } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/utils/cn";

export interface ActivityCardProps {
  title: string;
  type: string;
  status: string;
  points: number;
  endDate?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Prop shape mirrors the Activity entity's known fields (title, type,
 * points, status, endDate) — wired to real data when AC1 (Activities
 * Core) is built. Built now so AC1 and D1's dashboard widgets can
 * reuse one card rather than each inventing their own.
 *
 * Points are the "what you'll earn" figure — the single most exciting
 * number on this card — so they get the same primary/gold treatment
 * as XP everywhere else in the app, not buried as quiet metadata.
 */
export function ActivityCard({
  title,
  type,
  status,
  points,
  endDate,
  onClick,
  className,
}: ActivityCardProps) {
  return (
    <Card
      className={cn(
        "group border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300",
        onClick && "cursor-pointer hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.35)]",
        className,
      )}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") onClick();
            }
          : undefined
      }
    >
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline" className="w-fit">
            {type}
          </Badge>
        </div>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="flex items-center justify-between font-body text-sm">
        <span className="flex items-center gap-1.5 font-display text-base font-bold text-primary">
          <Coins className="h-4 w-4" aria-hidden="true" />
          {points} XP
        </span>
        {endDate && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            {endDate}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
