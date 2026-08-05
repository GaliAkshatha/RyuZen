import type { ReactNode } from "react";

export interface AuthCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Footer link row, e.g. "Don't have an account? Register" */
  footer?: ReactNode;
}

/**
 * AuthLayout (F8) provides the outer centered card (border, background,
 * padding). AuthCard provides the consistent inner heading/spacing/
 * footer-link convention shared by all 4 auth pages, so each page only
 * supplies its title, form, and footer link — not the whole scaffold.
 */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && <p className="font-body text-sm text-muted-foreground">{description}</p>}
      </div>

      {children}

      {footer && <div className="font-body text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
