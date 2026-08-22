import { useMemo, useState } from "react";
import { Trophy, Medal } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/Select";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useLeaderboard } from "@/domains/leaderboard/hooks/useLeaderboard";
import { useDepartments } from "@/domains/departments/hooks/useDepartments";

const RANK_COLOR = ["text-warning", "text-muted-foreground", "text-accent"];

/**
 * Real leaderboard, tenant-isolated server-side (organizationId,
 * confirmed - the one dimension that was already real). Department
 * and batch ("branch" and "year") are real server-enrichments added
 * this pass - closing a previously-confirmed gap where no way to
 * filter by either existed at all. Filtering itself happens
 * client-side since the real backend endpoint doesn't take filter
 * query params, only returns the full tenant-scoped list. Rank shown
 * is always recomputed from position within the CURRENT filtered
 * view (displayRank), not the raw org-wide `rank` field - a real fix
 * this pass: filtering to one department previously still showed each
 * student's org-wide rank (e.g. "5th, 12th, 19th"), not their real
 * 1st/2nd/3rd standing within that department.
 */
export function LeaderboardPanel() {
  const { data: entries, isLoading, isError, error, refetch } = useLeaderboard();
  const { data: departments } = useDepartments();
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");
  const [batchFilter, setBatchFilter] = useState<string>("ALL");

  const batches = useMemo(() => {
    const set = new Set((entries ?? []).map((e) => e.batch).filter((b): b is string => Boolean(b)));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = (entries ?? [])
    .filter((e) => departmentFilter === "ALL" || e.departmentId === departmentFilter)
    .filter((e) => batchFilter === "ALL" || e.batch === batchFilter)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((entry, index) => ({ ...entry, displayRank: index + 1 }));

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All departments</SelectItem>
            {(departments ?? []).map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All batches</SelectItem>
            {batches.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Trophy} title="No entries match this filter" />
      ) : (
        <div className="flex flex-col gap-1.5">
          {filtered.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <div className="flex items-center gap-2.5">
                {entry.displayRank <= 3 ? (
                  <Medal className={`h-4 w-4 ${RANK_COLOR[entry.displayRank - 1]}`} aria-hidden="true" />
                ) : (
                  <span className="w-4 text-center text-xs text-muted-foreground">{entry.displayRank}</span>
                )}
                <span className="font-medium text-foreground">{entry.studentName ?? entry.studentUsn ?? "Student"}</span>
              </div>
              <span className="font-semibold text-primary">{entry.totalPoints} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
