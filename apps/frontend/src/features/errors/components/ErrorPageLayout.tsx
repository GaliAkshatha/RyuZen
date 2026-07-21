import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/ui/Button";

interface ErrorPageLayoutProps {
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
  primaryAction: { label: string; to: string };
  secondaryAction?: { label: string; onClick: () => void };
}

/**
 * Shared shell for all 3 global error pages (403/404/500). Deliberately
 * layout-agnostic — no AppShell nav/sidebar — since these routes sit
 * outside the authenticated route tree in router.tsx and need to work
 * whether or not the person is logged in, or whether the app's own
 * chrome is what's currently broken (500 case).
 */
export function ErrorPageLayout({
  icon: Icon,
  code,
  title,
  description,
  primaryAction,
  secondaryAction,
}: ErrorPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-body text-sm font-medium tracking-wide text-muted-foreground">{code}</p>
        <h1 className="font-display text-3xl font-semibold text-foreground">{title}</h1>
        <p className="max-w-md font-body text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild>
          <Link to={primaryAction.to}>{primaryAction.label}</Link>
        </Button>
        {secondaryAction && (
          <Button variant="outline" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
