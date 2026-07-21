import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/Avatar";
import { Button } from "@/shared/ui/Button";
import { RoleBadge } from "@/shared/components/RoleBadge";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { ErrorState } from "@/shared/components/ErrorState";
import { useToast } from "@/hooks/useToast";

import { useProfile } from "@/features/profile/hooks/useProfile";
import { useUpdateProfile } from "@/features/profile/hooks/useUpdateProfile";
import { ProfileForm } from "@/features/profile/components/ProfileForm";

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.profile.image || undefined} alt={profile.name} />
          <AvatarFallback className="text-lg">{initialsOf(profile.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-semibold text-foreground">{profile.name}</h1>
          <div className="flex items-center gap-2">
            <RoleBadge role={profile.role} />
            <span className="font-body text-sm text-muted-foreground">{profile.email}</span>
          </div>
        </div>
      </div>

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
        <CardContent>
          <Button variant="outline" asChild>
            <Link to="/app/profile/change-password" className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Change Password
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
