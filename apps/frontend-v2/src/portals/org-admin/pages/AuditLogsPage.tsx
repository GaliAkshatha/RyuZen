import { useState } from "react";
import { ScrollText, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useAuditLogs } from "@/domains/audit-logs/hooks/useAuditLogs";

const PAGE_SIZE = 25;

function statusColor(statusCode: number) {
  if (statusCode >= 500) return "text-destructive";
  if (statusCode >= 400) return "text-warning";
  if (statusCode >= 300) return "text-info";
  return "text-success";
}

/**
 * Real, server-paginated audit log viewer - closes a real, confirmed
 * gap. userName is server-enriched (this engagement's own earlier
 * fix), so every row can genuinely answer "who did this," not just
 * show a raw user id.
 */
export function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    action: actionFilter || undefined,
    entityType: entityTypeFilter || undefined,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Audit logs</h1>
        <p className="text-sm text-muted-foreground">Every real action taken across your organization.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-action">Filter by action</Label>
          <Input
            id="filter-action"
            placeholder="e.g. CREATE_STUDENT"
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-entity">Filter by entity type</Label>
          <Input
            id="filter-entity"
            placeholder="e.g. Student"
            value={entityTypeFilter}
            onChange={(e) => { setEntityTypeFilter(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !data || data.logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No audit logs match these filters" />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {data.logs.map((log) => (
              <Card key={log.id}>
                <CardContent className="py-3">
                  <button
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {log.userName ?? "Unknown user"} · {log.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.method} {log.path}
                        {log.createdAt && ` · ${new Date(log.createdAt).toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${statusColor(log.statusCode)}`}>{log.statusCode}</span>
                      {expandedId === log.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {expandedId === log.id && (
                    <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
                      {log.entityType && <p>Entity: {log.entityType}{log.entityId ? ` (${log.entityId})` : ""}</p>}
                      {log.ipAddress && <p>IP: {log.ipAddress}</p>}
                      {log.userAgent && <p>User agent: {log.userAgent}</p>}
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <pre className="mt-1 overflow-x-auto rounded bg-muted p-2 text-[11px]">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Page {data.page} of {totalPages} · {data.total} total
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="flex items-center gap-1.5">
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Previous
              </Button>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="flex items-center gap-1.5">
                Next
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
