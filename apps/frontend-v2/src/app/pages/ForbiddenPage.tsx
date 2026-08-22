import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/Button";

export function ForbiddenPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 text-center">
      <p className="text-4xl font-semibold text-foreground">403</p>
      <p className="text-sm text-muted-foreground">You don't have access to this page.</p>
      <Button asChild size="sm">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}
