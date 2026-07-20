import { CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Badge } from "@/shared/ui/Badge";

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
      className={className}
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
      <CardContent className="flex items-center justify-between font-body text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{points} pts</span>
        {endDate && (
          <span className="flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
            {endDate}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
