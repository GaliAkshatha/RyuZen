import { FileQuestion } from "lucide-react";

import { ErrorPageLayout } from "@/features/errors/components/ErrorPageLayout";

/** The catch-all route (path="*") for any URL that doesn't match a real route. */
export function NotFoundPage() {
  return (
    <ErrorPageLayout
      icon={FileQuestion}
      code="404"
      title="Page Not Found"
      description="The page you're looking for doesn't exist, or may have moved."
      primaryAction={{ label: "Back to Home", to: "/" }}
    />
  );
}
