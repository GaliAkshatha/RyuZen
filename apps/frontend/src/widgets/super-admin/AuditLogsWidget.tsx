import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";
import { Badge } from "@/shared/ui/Badge";

import { useAuditLogs } from "@/features/audit-logs/hooks/useAuditLogs";

/**
 * Wired in AD4. Shows the caller's OWN organization's recent audit
 * logs — even SUPER_ADMIN does not get a cross-tenant platform-wide
 * view here (confirmed against GetAuditLogsUseCase: always scoped by
 * req.user.organizationId).
 */
export function AuditLogsWidget() {
  const { data, isLoading } = useAuditLogs({ page: 1, limit: 4 });

  return (
    <WidgetCard title="Audit Logs" icon={ScrollText} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : !data || data.logs.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground">No audit log entries yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {data.logs.map((log) => (
            <li key={log.id} className="flex items-center justify-between gap-2">
              <span className="truncate font-body text-sm text-foreground">{log.action}</span>
              <Badge variant={log.statusCode >= 400 ? "destructive" : "outline"}>
                {log.statusCode}
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/app/admin/audit-logs"
        className="mt-2 inline-block font-body text-xs text-primary underline underline-offset-4"
      >
        View all
      </Link>
    </WidgetCard>
  );
}
