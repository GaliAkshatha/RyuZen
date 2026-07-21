import {
  BarChart3,
  Users,
  Network,
  ClipboardList,
  Users2,
  Calendar,
  TrendingUp,
} from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useAdminDashboard } from "@/features/admin-dashboard/hooks/useAdminDashboard";

export function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
        Analytics
      </h1>

      {isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <>
          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">Users</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Users" value={data.users.total} icon={Users} />
              <StatCard label="Students" value={data.users.students} />
              <StatCard label="Faculty" value={data.users.faculty} />
              <StatCard label="Alumni" value={data.users.alumni} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">
              Academic &amp; Campus
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Departments" value={data.departments} icon={Network} />
              <StatCard label="Clubs" value={data.clubs} icon={Users2} />
              <StatCard label="Activities" value={data.activities.total} icon={ClipboardList} />
              <StatCard label="Pending Reviews" value={data.activities.pendingReviews} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">Events</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total Events" value={data.events.total} icon={Calendar} />
              <StatCard label="Published Events" value={data.events.published} />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-body text-sm font-medium text-muted-foreground">Placements</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Companies"
                value={data.placements.totalCompanies}
                icon={TrendingUp}
              />
              <StatCard label="Published Drives" value={data.placements.publishedDrives} />
              <StatCard label="Total Applications" value={data.placements.totalApplications} />
              <StatCard label="Placement Rate" value={`${data.placements.placementRate}%`} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
