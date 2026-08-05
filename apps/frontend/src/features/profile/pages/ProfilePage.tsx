import { Link } from "react-router-dom";
import { KeyRound, Laptop } from "lucide-react";

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
      </div>

      {isStudent && <StudentProgressionSection />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link to="/app/profile/change-password" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Change Password
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/app/profile/sessions" className="flex items-center gap-2">
                <Laptop className="h-4 w-4" aria-hidden="true" />
                Active Sessions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
