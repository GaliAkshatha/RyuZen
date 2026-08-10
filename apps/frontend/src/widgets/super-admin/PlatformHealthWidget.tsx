import { Activity, CheckCircle2, XCircle } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useHealthCheck } from "@/features/platform-health/hooks/useHealthCheck";

/**
 * Now genuinely wired to the real GET /health endpoint - the hook and
 * service already existed and were correctly, honestly scoped (basic
 * reachability only, no fabricated uptime/metrics), but the widget
 * itself was still showing a static placeholder instead of calling
 * them. Stays honest about what this actually checks: reachability,
 * not deep infrastructure health.
 */
export function PlatformHealthWidget() {
  const { data, isLoading } = useHealthCheck();

  return (
    <WidgetCard title="Platform Health" icon={Activity} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex items-center gap-2">
          {data?.reachable ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              <span className="font-body text-sm text-foreground">Backend reachable</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
              <span className="font-body text-sm text-foreground">Backend unreachable</span>
            </>
          )}
        </div>
      )}
      <p className="mt-1 font-body text-xs text-muted-foreground">
        Basic connectivity only — no deeper infrastructure metrics exist yet.
      </p>
    </WidgetCard>
  );
}
