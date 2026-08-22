import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * New primitive, per the rebuild's design-system gap: previously every
 * page hand-rolled its own header markup (title + icon + description
 * + actions), each slightly different. One real contract now:
 * icon+title on the left, optional description below, optional
 * actions on the right — used consistently across the rebuilt Student
 * pages rather than reinvented per page.
 *
 * Deliberately has no "card" chrome of its own - a page header is
 * page furniture, not a widget, and should never look like one more
 * box in a grid of boxes.
 */
export function PageHeader({
  icon: Icon,
  title,
  description,
  actions,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-2xl font-semibold leading-tight text-foreground">{title}</h1>
          {description && (
            <p className="font-body text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
