import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { cn } from "@/utils/cn";
import { Button } from "@/shared/ui/Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  /**
   * Escape hatch for future original artwork (see the product brief's
   * "empty pages should feel beautiful rather than unfinished" and
   * "replace generic placeholders with original illustrations" —
   * intentionally deferred, not built yet). When provided, this
   * entirely replaces the icon — sized and positioned by the
   * illustration itself, not constrained to the small icon's
   * dimensions — so dropping in real artwork later is a one-line prop
   * change per usage, never a layout rework. Every current call site
   * keeps rendering the plain icon exactly as today until this is
   * actually populated.
   */
  illustration?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Per the design skill's writing guidance: "an empty screen is an
 * invitation to act." Every usage should supply a title that says what's
 * missing and, where a real action exists, actionLabel/onAction to give
 * the person something to do about it — not just a passive "nothing
 * here" message.
 */
export function EmptyState({
  icon: Icon = Inbox,
  illustration,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-10 text-center",
        className,
      )}
    >
      {illustration ?? <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />}
      <div className="flex flex-col gap-1">
        <p className="font-display text-base font-medium text-foreground">{title}</p>
        {description && <p className="font-body text-sm text-muted-foreground">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
