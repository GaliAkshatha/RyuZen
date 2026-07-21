import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Users } from "lucide-react";

import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/components/Card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/Breadcrumb";
import { HeroBanner } from "@/shared/components/HeroBanner";
import { StatCard } from "@/shared/components/StatCard";
import { ActivityCard } from "@/shared/components/ActivityCard";
import { EventCard } from "@/shared/components/EventCard";
import { LeaderboardCard } from "@/shared/components/LeaderboardCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader, SkeletonRows } from "@/shared/components/SkeletonLoader";
import { Spinner } from "@/shared/components/Spinner";
import { ChartWrapper } from "@/shared/components/ChartWrapper";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { RoleBadge } from "@/shared/components/RoleBadge";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { FormErrorSummary } from "@/shared/components/FormErrorSummary";
import { AiPlaceholderNotice } from "@/shared/components/AiPlaceholderNotice";
import { UrlInputField } from "@/shared/components/UrlInputField";
import { DataGrid, type DataGridColumn } from "@/shared/components/DataGrid";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { AppTopbar } from "@/shared/components/AppTopbar";
import { AppApiError } from "@/types/api";
import { UserRole } from "@/types/enums";

interface MockStudent {
  id: string;
  name: string;
  department: string;
  year: number;
  points: number;
}

const MOCK_STUDENTS: MockStudent[] = Array.from({ length: 23 }).map((_, i) => ({
  id: `s${i + 1}`,
  name: `Student ${String.fromCharCode(65 + (i % 26))}${i}`,
  department: ["Computer Science", "Mechanical", "Electrical", "Civil"][i % 4] as string,
  year: (i % 4) + 1,
  points: 100 - i * 3,
}));

const studentColumns: DataGridColumn<MockStudent>[] = [
  { key: "name", header: "Name", render: (s) => s.name, sortable: true, sortValue: (s) => s.name },
  {
    key: "department",
    header: "Department",
    render: (s) => s.department,
    sortable: true,
    sortValue: (s) => s.department,
  },
  { key: "year", header: "Year", render: (s) => s.year, sortable: true, sortValue: (s) => s.year },
  {
    key: "points",
    header: "Points",
    render: (s) => s.points,
    sortable: true,
    sortValue: (s) => s.points,
  },
];

const chartData = [
  { month: "Jan", students: 42 },
  { month: "Feb", students: 58 },
  { month: "Mar", students: 71 },
  { month: "Apr", students: 65 },
];

const ALL_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.ORG_ADMIN,
  UserRole.FACULTY,
  UserRole.STUDENT,
  UserRole.ALUMNI,
];

/**
 * Dev-only route verifying all 22 F7 composites, per F7's own DoD.
 * Not linked from any nav, not auth-gated.
 */
export function CompositePlaygroundPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200",
  );
  const [sidebarRole, setSidebarRole] = useState<UserRole>(UserRole.STUDENT);

  return (
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold">Composite Playground</h1>
          <ThemeToggle />
        </header>

        <Section title="Card & Breadcrumb">
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="p-6 font-body text-sm">A plain Card composite.</CardContent>
            </Card>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Activities</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Hackathon 2026</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </Section>

        <Section title="HeroBanner">
          <HeroBanner
            title="Welcome back, Ava"
            subtitle="You have 3 activities due this week."
            actions={<Button size="sm">View Activities</Button>}
          />
        </Section>

        <Section title="StatCard">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Students"
              value={1284}
              icon={Users}
              trend={{ direction: "up", value: "+4.2%" }}
            />
            <StatCard label="Active Clubs" value={18} />
            <StatCard
              label="Pending Reviews"
              value={7}
              trend={{ direction: "down", value: "-2" }}
            />
          </div>
        </Section>

        <Section title="ActivityCard, EventCard & LeaderboardCard">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ActivityCard
              title="Campus Hackathon"
              type="HACKATHON"
              status="PUBLISHED"
              points={50}
              endDate="Aug 12"
            />
            <EventCard
              title="Alumni Meetup"
              status="PUBLISHED"
              startDate="Aug 20, 6:00 PM"
              location="Main Hall"
            />
            <div className="flex flex-col gap-2">
              <LeaderboardCard rank={1} name="Ava Sorenson" points={980} isCurrentUser />
              <LeaderboardCard rank={2} name="Marcus Reyes" points={912} />
            </div>
          </div>
        </Section>

        <Section title="EmptyState & ErrorState">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EmptyState
              title="No submissions yet"
              description="Submissions will appear here once students apply."
            />
            <ErrorState
              error={new AppApiError({ message: "Failed to load placement drives.", status: 500 })}
              onRetry={() => undefined}
            />
          </div>
        </Section>

        <Section title="SkeletonLoader & Spinner">
          <div className="flex flex-col gap-4">
            <SkeletonRows rows={3} />
            <SkeletonLoader className="h-24 w-24" />
            <Spinner size="lg" />
          </div>
        </Section>

        <Section title="ChartWrapper">
          <ChartWrapper title="Monthly Sign-ups" description="New students per month">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Bar dataKey="students" fill="hsl(var(--primary))" radius={4} />
            </BarChart>
          </ChartWrapper>
        </Section>

        <Section title="StatusBadge & RoleBadge">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {["ACTIVE", "PENDING", "REJECTED", "DRAFT", "PUBLISHED", "ARCHIVED", "PRIVATE"].map(
                (s) => (
                  <StatusBadge key={s} status={s} />
                ),
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((r) => (
                <RoleBadge key={r} role={r} />
              ))}
            </div>
          </div>
        </Section>

        <Section title="ConfirmDialog">
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Delete Club
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this club?"
            description="This will remove all members. This action cannot be undone."
            destructive
            confirmLabel="Delete"
            onConfirm={() => setConfirmOpen(false)}
          />
        </Section>

        <Section title="FormErrorSummary & AiPlaceholderNotice">
          <div className="flex flex-col gap-4">
            <FormErrorSummary errors={["email: Invalid email address.", "password: Too short."]} />
            <AiPlaceholderNotice />
          </div>
        </Section>

        <Section title="UrlInputField">
          <UrlInputField
            label="Avatar URL"
            value={previewUrl}
            onChange={setPreviewUrl}
            placeholder="https://example.com/avatar.png"
            className="max-w-sm"
          />
        </Section>

        <Section title="DataGrid (sort, search, paginate against 23 static rows)">
          <DataGrid
            data={MOCK_STUDENTS}
            columns={studentColumns}
            getRowId={(s) => s.id}
            searchable
            searchPlaceholder="Search students…"
            pageSize={5}
          />
        </Section>

        <Section title="AppSidebar (fed a fake role — switch to see the nav filter live)">
          <div className="mb-3 flex flex-wrap gap-2">
            {ALL_ROLES.map((r) => (
              <Button
                key={r}
                size="sm"
                variant={sidebarRole === r ? "default" : "outline"}
                onClick={() => setSidebarRole(r)}
              >
                {r}
              </Button>
            ))}
          </div>
          <div className="h-96 overflow-y-auto rounded-lg border border-border">
            <AppSidebar role={sidebarRole} />
          </div>
        </Section>

        <Section title="AppTopbar">
          <div className="overflow-hidden rounded-lg border border-border">
            <AppTopbar
              userName="Ava Sorenson"
              userRole={UserRole.STUDENT}
              unreadNotificationCount={3}
              onLogout={() => undefined}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h2 className="font-display text-lg font-medium">{title}</h2>
      {children}
    </section>
  );
}
