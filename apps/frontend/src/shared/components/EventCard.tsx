import { CalendarDays, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";

export interface EventCardProps {
  title: string;
  status: string;
  startDate: string;
  location?: string;
  onClick?: () => void;
  className?: string;
}

export function EventCard({
  title,
  status,
  startDate,
  location,
  onClick,
  className,
}: EventCardProps) {
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
        <CardTitle className="text-base">{title}</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {startDate}
        </span>
        {location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {location}
          </span>
        )}
      </CardContent>
    </Card>
  );
}
