import { Link } from "react-router-dom";
import { Users, UserCheck, Inbox, ChevronRight, ShieldCheck, ShieldAlert, Briefcase, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { useAuth } from "@/domains/auth/AuthContext";
import { usePeople } from "@/domains/connections/hooks/usePeople";
import { useMyConnections } from "@/domains/connections/hooks/useMyConnections";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";
import { useMyAlumniRecord } from "@/domains/alumni-management/hooks/useMyAlumniRecord";

/**
 * Real Alumni home. Connection counts are the same real domain as
 * before; new this pass is a real "your profile" card using
 * useMyAlumniRecord - a genuine gap this filled: every alumni
 * endpoint was previously SUPER_ADMIN/ORG_ADMIN only, so an alumnus
 * could never see their own company, designation, graduation year,
 * or verification status anywhere in the app. That's now a real,
 * ALUMNI-callable self-view endpoint (GET /alumni/me), not invented -
 * confirmed against the actual backend before building this.
 */
export function AlumniHomePage() {
  const { user } = useAuth();
  const { data: record } = useMyAlumniRecord();
  const { data: people } = usePeople();
  const { data: connections } = useMyConnections();
  const { data: pendingRequests } = usePendingRequests();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Stay connected with your campus network.</p>
      </div>

      {record && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Your profile
              {record.isVerified ? (
                <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-medium text-warning">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  Awaiting verification
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Graduated</p>
                <p className="text-sm font-medium text-foreground">{record.graduationYear ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="text-sm font-medium text-foreground">{record.company ?? "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <UserCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">Designation</p>
                <p className="text-sm font-medium text-foreground">{record.designation ?? "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={Users} value={people?.length ?? 0} label="People to connect with" tone="primary" to="/alumni/connect" />
        <StatCard icon={UserCheck} value={connections?.length ?? 0} label="My connections" tone="success" to="/alumni/connect?tab=connections" />
        <StatCard icon={Inbox} value={pendingRequests?.length ?? 0} label="Pending requests" tone="warning" to="/alumni/connect?tab=requests" />
      </div>

      {connections && connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent connections
              <Link to="/alumni/connect?tab=connections" className="text-xs font-medium text-primary">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {connections.slice(0, 5).map((connection) => (
              <div key={connection.connectionRequestId} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {connection.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{connection.name}</p>
                    <p className="text-xs text-muted-foreground">{connection.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
