import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";

export interface WidgetCardProps {
  title: string;
  icon?: LucideIcon;
  /**
   * When false, renders a consistent "not wired yet" placeholder body
   * instead of `children`, labeled with the milestone that will wire
   * it. Every widget in this milestone renders through this one shell
   * so H1 (Dashboard Widget Completion) has one obvious visual pattern
   * to audit against, rather than 25 bespoke placeholder treatments.
   */
  wired: boolean;
  /** Which future milestone wires this widget, e.g. "AC1". Required when wired is false. */
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
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
          {title}
        </CardTitle>
        {!wired && milestone && (
          <Badge variant="secondary" className="font-mono text-[10px]">
            {milestone}
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
