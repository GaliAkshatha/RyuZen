import type { LucideIcon } from "lucide-react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";

export interface WidgetCardProps {
  title: string;
  icon?: LucideIcon;
  /**
   * When false, renders a consistent placeholder body instead of
   * `children`. As of H1 (Dashboard Widget Completion & Cross-Role
   * QA), every scheduled milestone is complete, so the ONLY
   * `wired={false}` widgets remaining are the 3 documented, permanent
   * backend gaps (see AttendanceWidget.tsx, StudentProgressWidget.tsx,
   * MentorshipOverviewWidget.tsx) — identified by a `milestone` value
   * ending in "*". This shell renders those with a distinct amber
   * "Backend Gap" treatment rather than the neutral "coming soon"
   * badge, since they are not upcoming work.
   */
  wired: boolean;
  /** The milestone that wired this slot, or — for the 3 permanent gaps — the blocked milestone with a trailing "*", e.g. "A4*". Required when wired is false. */
  milestone?: string;
  placeholderMessage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function WidgetCard({
  title,
  icon: Icon,
  wired,
  milestone,
  placeholderMessage = "This widget will show real data once its module is built.",
  children,
  className,
}: WidgetCardProps) {
  const isPermanentGap = !wired && milestone?.endsWith("*");

  return (
    <Card
      className={cn(
        "group flex h-full flex-col border-border/60 bg-card/80 backdrop-blur-sm transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.35)]",
        className,
      )}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2.5 text-base">
          {Icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary/15 group-hover:ring-primary/30">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
          {title}
        </CardTitle>
        {!wired && milestone && (
          <Badge
            variant={isPermanentGap ? "warning" : "secondary"}
            className="flex items-center gap-1 font-mono text-[10px]"
          >
            {isPermanentGap && <AlertTriangle className="h-3 w-3" aria-hidden="true" />}
            {isPermanentGap ? "Backend Gap" : milestone}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        {wired ? (
          children
        ) : (
          <p className="font-body text-sm text-muted-foreground">{placeholderMessage}</p>
        )}
      </CardContent>
    </Card>
  );
}
