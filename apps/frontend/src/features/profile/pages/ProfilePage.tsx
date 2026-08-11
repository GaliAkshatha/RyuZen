import { Link } from "react-router-dom";
import { Settings, TrendingUp, UserSquare, FileText, Code2, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { RoleBadge } from "@/shared/components/RoleBadge";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { ErrorState } from "@/shared/components/ErrorState";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { useToast } from "@/hooks/useToast";
import { UserRole } from "@/types/enums";

import { useProfile } from "@/features/profile/hooks/useProfile";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { StudentProgressionSection } from "@/features/profile/components/StudentProgressionSection";
import { initialsOf } from "@/utils/initialsOf";

const STUDENT_LINKS = [
  { to: "/app/growth", label: "Growth", description: "Skills, achievements, roadmap", icon: TrendingUp },
  { to: "/app/career/portfolio", label: "My Portfolio", description: "Projects & visibility", icon: UserSquare },
  { to: "/app/career/resume", label: "Resume", description: "Generate & download", icon: FileText },
  { to: "/app/coding-profiles", label: "Coding Practice", description: "Linked platforms", icon: Code2 },
];

export function ProfilePage() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile();
  const { mutate, isPending, error: updateError } = useUpdateProfile();
  const { toast } = useToast();

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !profile) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const isStudent = profile.role === UserRole.STUDENT;

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="academy" />

      {/* Cover + identity — same gradient language as HeroBanner, so the
        profile reads as part of the same visual system rather than a
        different page style. */}
      <div className="relative overflow-hidden rounded-lg border border-border bg-gradient-to-br from-primary/15 via-card to-card p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
              <AvatarImage src={profile.profile.image || undefined} alt={profile.name} />
              <AvatarFallback className="text-xl">{initialsOf(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                {profile.name}
              </h1>
              <div className="flex items-center gap-2">
                <RoleBadge role={profile.role} />
                <span className="font-body text-sm text-muted-foreground">{profile.email}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link to="/app/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" aria-hidden="true" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {isStudent && <StudentProgressionSection />}

      {isStudent && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STUDENT_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card/60 p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <link.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm font-medium text-foreground">{link.label}</p>
                <p className="truncate font-body text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ArrowRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={profile}
            isSubmitting={isPending}
            error={updateError}
            onSubmit={(payload) =>
              mutate(payload, {
                onSuccess: () => toast({ title: "Profile updated" }),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
