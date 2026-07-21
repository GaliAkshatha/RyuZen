import { AlertOctagon } from "lucide-react";

import { ErrorPageLayout } from "@/features/errors/components/ErrorPageLayout";

/** The ErrorBoundary's fallback UI for uncaught render-time crashes anywhere in the app. */
export function ServerErrorPage() {
  return (
    <ErrorPageLayout
      icon={AlertOctagon}
      code="500"
      title="Something Went Wrong"
      description="An unexpected error occurred. Reloading the page usually fixes this — if it keeps happening, please let us know."
      primaryAction={{ label: "Back to Home", to: "/" }}
      secondaryAction={{ label: "Reload Page", onClick: () => window.location.reload() }}
    />
  );
}
