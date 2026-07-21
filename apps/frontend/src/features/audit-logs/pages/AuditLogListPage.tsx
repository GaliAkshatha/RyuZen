import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollText } from "lucide-react";

import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui/Table";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useAuditLogs } from "@/features/audit-logs/hooks/useAuditLogs";

const PAGE_SIZE = 20;

export function AuditLogListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");

  const { data, isLoading, isError, error, refetch } = useAuditLogs({
    page,
    limit: PAGE_SIZE,
    userId: userId || undefined,
    action: action || undefined,
    entityType: entityType || undefined,
  });

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <ScrollText className="h-6 w-6 text-primary" aria-hidden="true" />
        Audit Logs
      </h1>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          placeholder="Filter by user ID"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setPage(1);
          }}
        />
        <Input
          placeholder="Filter by action"
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
        />
        <Input
          placeholder="Filter by entity type"
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-10" />
          ))}
        </div>
      ) : !data || data.logs.length === 0 ? (
        <EmptyState title="No audit logs found" description="Try adjusting your filters." />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User</TableHead>
                <TableHead>When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/app/admin/audit-logs/${log.id}`)}
                >
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.entityType ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.method}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-mono text-xs">{log.path}</TableCell>
                  <TableCell>
                    <Badge variant={log.statusCode >= 400 ? "destructive" : "outline"}>
                      {log.statusCode}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.userId ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              Page {data.page} of {totalPages} ({data.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
