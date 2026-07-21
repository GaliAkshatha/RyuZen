import { ShieldAlert } from "lucide-react";

import { ErrorPageLayout } from "@/features/errors/components/ErrorPageLayout";

/** Reached via RoleRoute's redirect when the signed-in user's role isn't permitted for the current route. */
export function ForbiddenPage() {
  return (
    <ErrorPageLayout
      icon={ShieldAlert}
      code="403"
      title="Access Denied"
      description="Your role doesn't have access to this section. If you think this is a mistake, contact your administrator."
      primaryAction={{ label: "Back to Dashboard", to: "/app/dashboard" }}
    />
  );
}
