import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ScrollText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";

import { useAuditLog } from "@/features/audit-logs/hooks/useAuditLog";

export function AuditLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: log, isLoading, isError, error, refetch } = useAuditLog(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !log) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <Link
        to="/app/admin/audit-logs"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Audit Logs
      </Link>

      <div className="flex items-center gap-2">
        <ScrollText className="h-6 w-6 text-primary" aria-hidden="true" />
        <h1 className="font-display text-2xl font-semibold text-foreground">{log.action}</h1>
        <Badge variant={log.statusCode >= 400 ? "destructive" : "outline"}>{log.statusCode}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 font-body text-sm">
          <p>
            <span className="font-medium text-foreground">Method:</span>{" "}
            <span className="text-muted-foreground">{log.method}</span>
          </p>
          <p>
            <span className="font-medium text-foreground">Path:</span>{" "}
            <span className="font-mono text-xs text-muted-foreground">{log.path}</span>
          </p>
          {log.entityType && (
            <p>
              <span className="font-medium text-foreground">Entity:</span>{" "}
              <span className="text-muted-foreground">
                {log.entityType}
                {log.entityId ? ` (${log.entityId})` : ""}
              </span>
            </p>
          )}
          {log.userId && (
            <p>
              <span className="font-medium text-foreground">User:</span>{" "}
              <span className="font-mono text-xs text-muted-foreground">{log.userId}</span>
            </p>
          )}
          {log.ipAddress && (
            <p>
              <span className="font-medium text-foreground">IP Address:</span>{" "}
              <span className="text-muted-foreground">{log.ipAddress}</span>
            </p>
          )}
          {log.userAgent && (
            <p>
              <span className="font-medium text-foreground">User Agent:</span>{" "}
              <span className="text-muted-foreground">{log.userAgent}</span>
            </p>
          )}
          {log.createdAt && (
            <p>
              <span className="font-medium text-foreground">When:</span>{" "}
              <span className="text-muted-foreground">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      {log.metadata && Object.keys(log.metadata).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
