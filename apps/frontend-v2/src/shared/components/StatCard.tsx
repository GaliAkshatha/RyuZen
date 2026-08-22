import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/shared/ui/Card";
import { cn } from "@/shared/utils/cn";

const TONE_CLASSES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
} as const;

/**
 * Real navigation, per explicit product direction: a stat card links
 * to its real related page only when one genuinely exists (the `to`
 * prop) - cards with no real destination stay plain, non-interactive
 * cards rather than being wrapped in a link that goes nowhere useful.
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  tone = "primary",
  trend,
  to,
  className,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone?: keyof typeof TONE_CLASSES;
  trend?: string;
  to?: string;
  className?: string;
}) {
  const content = (
    <CardContent className="p-4">
      <div className={cn("mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      {trend && <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{trend}</p>}
    </CardContent>
  );

  if (to) {
    return (
      <Link to={to}>
        <Card className={cn("transition-colors hover:border-primary/40", className)}>{content}</Card>
      </Link>
    );
  }

  return <Card className={className}>{content}</Card>;
}
